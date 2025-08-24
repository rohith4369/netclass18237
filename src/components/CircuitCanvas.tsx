import React, { useRef, useState, useCallback } from 'react';
import { Stage, Layer, Group, Line, Text, Circle, Rect } from 'react-konva';
import { CircuitState, Component, Connection, Point } from '../types/circuit';
import { getComponentTemplate } from '../data/componentLibrary';

interface CircuitCanvasProps {
  circuitState: CircuitState;
  onComponentUpdate: (componentId: string, updates: Partial<Component>) => void;
  onComponentDelete: (componentId: string) => void;
  onComponentSelect: (componentId: string | null) => void;
  onConnectionAdd: (from: { componentId: string; terminal: string }, to: { componentId: string; terminal: string }) => void;
  onConnectionDelete: (connectionId: string) => void;
  onConnectionSelect: (connectionId: string | null) => void;
}

export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
  circuitState,
  onComponentUpdate,
  onComponentDelete,
  onComponentSelect,
  onConnectionAdd,
  onConnectionDelete,
  onConnectionSelect
}) => {
  const stageRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [connectingTerminal, setConnectingTerminal] = useState<{ componentId: string; terminal: string } | null>(null);
  const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });

  const snapToGrid = (point: Point): Point => {
    if (!circuitState.snapToGrid) return point;
    return {
      x: Math.round(point.x / circuitState.gridSize) * circuitState.gridSize,
      y: Math.round(point.y / circuitState.gridSize) * circuitState.gridSize
    };
  };

  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      onComponentSelect(null);
      onConnectionSelect(null);
    }
  };

  const handleComponentDragStart = (componentId: string, e: any) => {
    setIsDragging(true);
    setDragStart({ x: e.target.x(), y: e.target.y() });
  };

  const handleComponentDragEnd = (componentId: string, e: any) => {
    setIsDragging(false);
    setDragStart(null);
    
    const newPos = snapToGrid({ x: e.target.x(), y: e.target.y() });
    onComponentUpdate(componentId, { position: newPos });
  };

  const handleTerminalClick = (componentId: string, terminal: string) => {
    if (!connectingTerminal) {
      setConnectingTerminal({ componentId, terminal });
    } else {
      if (connectingTerminal.componentId !== componentId || connectingTerminal.terminal !== terminal) {
        onConnectionAdd(connectingTerminal, { componentId, terminal });
      }
      setConnectingTerminal(null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (circuitState.selectedComponent) {
        onComponentDelete(circuitState.selectedComponent);
      } else if (circuitState.selectedConnection) {
        onConnectionDelete(circuitState.selectedConnection);
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [circuitState.selectedComponent, circuitState.selectedConnection]);

  const renderComponent = (component: Component) => {
    const template = getComponentTemplate(component.type);
    if (!template) return null;

    const isSelected = component.selected;
    const isConnecting = connectingTerminal?.componentId === component.id;

    return (
      <Group
        key={component.id}
        x={component.position.x}
        y={component.position.y}
        rotation={component.rotation}
        draggable
        onDragStart={(e) => handleComponentDragStart(component.id, e)}
        onDragEnd={(e) => handleComponentDragEnd(component.id, e)}
        onClick={() => onComponentSelect(component.id)}
      >
        {/* Component body */}
        <Rect
          width={40}
          height={20}
          x={-20}
          y={-10}
          fill={isSelected ? 'var(--accent-color)' : 'var(--secondary-bg)'}
          stroke={isConnecting ? 'var(--success-color)' : 'var(--border-color)'}
          strokeWidth={isSelected || isConnecting ? 2 : 1}
          cornerRadius={4}
        />
        
        {/* Component label */}
        <Text
          text={template.name}
          x={-20}
          y={-10}
          width={40}
          height={20}
          align="center"
          verticalAlign="middle"
          fontSize={10}
          fill="var(--text-primary)"
        />

        {/* Terminals */}
        {template.terminals.map((terminal) => {
          const isConnectingTerminal = connectingTerminal?.componentId === component.id && connectingTerminal?.terminal === terminal.id;
          const isConnected = circuitState.connections.some(conn => 
            (conn.from.componentId === component.id && conn.from.terminal === terminal.id) ||
            (conn.to.componentId === component.id && conn.to.terminal === terminal.id)
          );

          return (
            <Circle
              key={terminal.id}
              x={terminal.position.x}
              y={terminal.position.y}
              radius={4}
              fill={isConnectingTerminal ? 'var(--success-color)' : isConnected ? 'var(--accent-color)' : 'var(--text-secondary)'}
              stroke="var(--border-color)"
              strokeWidth={1}
              onClick={(e) => {
                e.cancelBubble = true;
                handleTerminalClick(component.id, terminal.id);
              }}
            />
          );
        })}
      </Group>
    );
  };

  const renderConnection = (connection: Connection) => {
    const fromComponent = circuitState.components.find(c => c.id === connection.from.componentId);
    const toComponent = circuitState.components.find(c => c.id === connection.to.componentId);
    
    if (!fromComponent || !toComponent) return null;

    const fromTemplate = getComponentTemplate(fromComponent.type);
    const toTemplate = getComponentTemplate(toComponent.type);
    
    if (!fromTemplate || !toTemplate) return null;

    const fromTerminal = fromTemplate.terminals.find(t => t.id === connection.from.terminal);
    const toTerminal = toTemplate.terminals.find(t => t.id === connection.to.terminal);
    
    if (!fromTerminal || !toTerminal) return null;

    // Calculate terminal positions in world coordinates
    const fromPos = {
      x: fromComponent.position.x + fromTerminal.position.x * Math.cos(fromComponent.rotation * Math.PI / 180) - fromTerminal.position.y * Math.sin(fromComponent.rotation * Math.PI / 180),
      y: fromComponent.position.y + fromTerminal.position.x * Math.sin(fromComponent.rotation * Math.PI / 180) + fromTerminal.position.y * Math.cos(fromComponent.rotation * Math.PI / 180)
    };

    const toPos = {
      x: toComponent.position.x + toTerminal.position.x * Math.cos(toComponent.rotation * Math.PI / 180) - toTerminal.position.y * Math.sin(toComponent.rotation * Math.PI / 180),
      y: toComponent.position.y + toTerminal.position.x * Math.sin(toComponent.rotation * Math.PI / 180) + toTerminal.position.y * Math.cos(toComponent.rotation * Math.PI / 180)
    };

    return (
      <Line
        key={connection.id}
        points={[fromPos.x, fromPos.y, toPos.x, toPos.y]}
        stroke={connection.selected ? 'var(--accent-color)' : 'var(--text-secondary)'}
        strokeWidth={connection.selected ? 3 : 2}
        lineCap="round"
        onClick={() => onConnectionSelect(connection.id)}
      />
    );
  };

  const renderConnectingLine = () => {
    if (!connectingTerminal) return null;

    const component = circuitState.components.find(c => c.id === connectingTerminal.componentId);
    if (!component) return null;

    const template = getComponentTemplate(component.type);
    if (!template) return null;

    const terminal = template.terminals.find(t => t.id === connectingTerminal.terminal);
    if (!terminal) return null;

    const terminalPos = {
      x: component.position.x + terminal.position.x * Math.cos(component.rotation * Math.PI / 180) - terminal.position.y * Math.sin(component.rotation * Math.PI / 180),
      y: component.position.y + terminal.position.x * Math.sin(component.rotation * Math.PI / 180) + terminal.position.y * Math.cos(component.rotation * Math.PI / 180)
    };

    return (
      <Line
        points={[terminalPos.x, terminalPos.y, mousePos.x, mousePos.y]}
        stroke="var(--success-color)"
        strokeWidth={2}
        lineCap="round"
        dash={[5, 5]}
      />
    );
  };

  const renderGrid = () => {
    if (!circuitState.snapToGrid) return null;

    const stage = stageRef.current;
    if (!stage) return null;

    const stageWidth = stage.width();
    const stageHeight = stage.height();
    const gridSize = circuitState.gridSize;

    const lines = [];
    
    // Vertical lines
    for (let x = 0; x <= stageWidth; x += gridSize) {
      lines.push(
        <Line
          key={`v${x}`}
          points={[x, 0, x, stageHeight]}
          stroke="var(--border-color)"
          strokeWidth={0.5}
          opacity={0.3}
        />
      );
    }

    // Horizontal lines
    for (let y = 0; y <= stageHeight; y += gridSize) {
      lines.push(
        <Line
          key={`h${y}`}
          points={[0, y, stageWidth, y]}
          stroke="var(--border-color)"
          strokeWidth={0.5}
          opacity={0.3}
        />
      );
    }

    return lines;
  };

  return (
    <div className="circuit-canvas">
      <Stage
        ref={stageRef}
        width={window.innerWidth - 600} // Adjust based on sidebar widths
        height={window.innerHeight - 80} // Adjust based on toolbar height
        onClick={handleStageClick}
        onMouseMove={(e) => {
          const pos = e.target.getStage().getPointerPosition();
          if (pos) setMousePos(pos);
        }}
      >
        <Layer>
          {/* Grid */}
          {renderGrid()}
          
          {/* Connections */}
          {circuitState.connections.map(renderConnection)}
          
          {/* Connecting line */}
          {renderConnectingLine()}
          
          {/* Components */}
          {circuitState.components.map(renderComponent)}
        </Layer>
      </Stage>
    </div>
  );
};