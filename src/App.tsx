import React, { useState, useCallback } from 'react';
import { CircuitCanvas } from './components/CircuitCanvas';
import { ComponentLibrary } from './components/ComponentLibrary';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Toolbar } from './components/Toolbar';
import { CircuitState, Component, Connection, SimulationResult } from './types/circuit';
import { simulateCircuit } from './utils/simulation';
import { getComponentTemplate, ComponentType } from './data/componentLibrary';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const initialCircuitState: CircuitState = {
  components: [],
  connections: [],
  simulation: null,
  selectedComponent: null,
  selectedConnection: null,
  gridSize: 20,
  snapToGrid: true
};

function App() {
  const [circuitState, setCircuitState] = useState<CircuitState>(initialCircuitState);
  const [isSimulating, setIsSimulating] = useState(false);

  const addComponent = useCallback((type: ComponentType, position: { x: number; y: number }) => {
    const template = getComponentTemplate(type);
    if (!template) return;

    const newComponent: Component = {
      id: uuidv4(),
      type,
      position,
      rotation: 0,
      properties: { ...template.defaultProperties },
      connections: [],
      selected: false
    };

    setCircuitState(prev => ({
      ...prev,
      components: [...prev.components, newComponent]
    }));
  }, []);

  const updateComponent = useCallback((componentId: string, updates: Partial<Component>) => {
    setCircuitState(prev => ({
      ...prev,
      components: prev.components.map(comp =>
        comp.id === componentId ? { ...comp, ...updates } : comp
      )
    }));
  }, []);

  const deleteComponent = useCallback((componentId: string) => {
    setCircuitState(prev => ({
      ...prev,
      components: prev.components.filter(comp => comp.id !== componentId),
      connections: prev.connections.filter(conn => 
        conn.from.componentId !== componentId && conn.to.componentId !== componentId
      ),
      selectedComponent: prev.selectedComponent === componentId ? null : prev.selectedComponent
    }));
  }, []);

  const addConnection = useCallback((from: { componentId: string; terminal: string }, to: { componentId: string; terminal: string }) => {
    const newConnection: Connection = {
      id: uuidv4(),
      from,
      to,
      selected: false
    };

    setCircuitState(prev => ({
      ...prev,
      connections: [...prev.connections, newConnection]
    }));
  }, []);

  const deleteConnection = useCallback((connectionId: string) => {
    setCircuitState(prev => ({
      ...prev,
      connections: prev.connections.filter(conn => conn.id !== connectionId),
      selectedConnection: prev.selectedConnection === connectionId ? null : prev.selectedConnection
    }));
  }, []);

  const selectComponent = useCallback((componentId: string | null) => {
    setCircuitState(prev => ({
      ...prev,
      selectedComponent: componentId,
      selectedConnection: null,
      components: prev.components.map(comp => ({
        ...comp,
        selected: comp.id === componentId
      }))
    }));
  }, []);

  const selectConnection = useCallback((connectionId: string | null) => {
    setCircuitState(prev => ({
      ...prev,
      selectedConnection: connectionId,
      selectedComponent: null,
      connections: prev.connections.map(conn => ({
        ...conn,
        selected: conn.id === connectionId
      }))
    }));
  }, []);

  const runSimulation = useCallback(async () => {
    setIsSimulating(true);
    try {
      // Simulate in a web worker or timeout to avoid blocking UI
      setTimeout(() => {
        const result = simulateCircuit(circuitState.components, circuitState.connections);
        setCircuitState(prev => ({
          ...prev,
          simulation: result
        }));
        setIsSimulating(false);
      }, 100);
    } catch (error) {
      console.error('Simulation failed:', error);
      setIsSimulating(false);
    }
  }, [circuitState.components, circuitState.connections]);

  const clearCircuit = useCallback(() => {
    setCircuitState(initialCircuitState);
  }, []);

  const selectedComponent = circuitState.components.find(comp => comp.id === circuitState.selectedComponent);
  const selectedConnection = circuitState.connections.find(conn => conn.id === circuitState.selectedConnection);

  return (
    <div className="app">
      <Toolbar 
        onSimulate={runSimulation}
        onClear={clearCircuit}
        isSimulating={isSimulating}
        hasSimulation={!!circuitState.simulation}
      />
      
      <div className="main-content">
        <ComponentLibrary onComponentSelect={addComponent} />
        
        <CircuitCanvas
          circuitState={circuitState}
          onComponentUpdate={updateComponent}
          onComponentDelete={deleteComponent}
          onComponentSelect={selectComponent}
          onConnectionAdd={addConnection}
          onConnectionDelete={deleteConnection}
          onConnectionSelect={selectConnection}
        />
        
        <PropertiesPanel
          selectedComponent={selectedComponent}
          selectedConnection={selectedConnection}
          onComponentUpdate={updateComponent}
          onConnectionDelete={deleteConnection}
          simulation={circuitState.simulation}
        />
      </div>
    </div>
  );
}

export default App;