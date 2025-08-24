import React from 'react';
import { Trash2 } from 'lucide-react';
import { Component, Connection, SimulationResult } from '../types/circuit';
import { getComponentTemplate } from '../data/componentLibrary';

interface PropertiesPanelProps {
  selectedComponent: Component | null;
  selectedConnection: Connection | null;
  onComponentUpdate: (componentId: string, updates: Partial<Component>) => void;
  onConnectionDelete: (connectionId: string) => void;
  simulation: SimulationResult | null;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponent,
  selectedConnection,
  onComponentUpdate,
  onConnectionDelete,
  simulation
}) => {
  const formatValue = (value: number, unit: string = ''): string => {
    if (Math.abs(value) >= 1e6) {
      return `${(value / 1e6).toFixed(3)}M${unit}`;
    } else if (Math.abs(value) >= 1e3) {
      return `${(value / 1e3).toFixed(3)}k${unit}`;
    } else if (Math.abs(value) >= 1e-3) {
      return `${value.toFixed(3)}${unit}`;
    } else if (Math.abs(value) >= 1e-6) {
      return `${(value * 1e6).toFixed(3)}μ${unit}`;
    } else if (Math.abs(value) >= 1e-9) {
      return `${(value * 1e9).toFixed(3)}n${unit}`;
    } else {
      return `${(value * 1e12).toFixed(3)}p${unit}`;
    }
  };

  const renderComponentProperties = () => {
    if (!selectedComponent) return null;

    const template = getComponentTemplate(selectedComponent.type);
    if (!template) return null;

    return (
      <div className="property-group">
        <div className="property-group-title">Component Properties</div>
        
        <div className="property-item">
          <label className="property-label">Type</label>
          <div className="property-input" style={{ backgroundColor: 'var(--secondary-bg)' }}>
            {template.name}
          </div>
        </div>

        {Object.entries(selectedComponent.properties).map(([key, value]) => (
          <div key={key} className="property-item">
            <label className="property-label">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            
            {typeof value === 'boolean' ? (
              <label className="property-checkbox">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => onComponentUpdate(selectedComponent.id, {
                    properties: { ...selectedComponent.properties, [key]: e.target.checked }
                  })}
                />
                {value ? 'Enabled' : 'Disabled'}
              </label>
            ) : typeof value === 'string' && key === 'color' ? (
              <select
                className="property-select"
                value={value}
                onChange={(e) => onComponentUpdate(selectedComponent.id, {
                  properties: { ...selectedComponent.properties, [key]: e.target.value }
                })}
              >
                <option value="red">Red</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
                <option value="yellow">Yellow</option>
                <option value="white">White</option>
              </select>
            ) : (
              <input
                type="number"
                className="property-input"
                value={value}
                onChange={(e) => onComponentUpdate(selectedComponent.id, {
                  properties: { ...selectedComponent.properties, [key]: parseFloat(e.target.value) || 0 }
                })}
                step="any"
              />
            )}
          </div>
        ))}

        <div className="property-item">
          <label className="property-label">Position</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="number"
              className="property-input"
              value={Math.round(selectedComponent.position.x)}
              onChange={(e) => onComponentUpdate(selectedComponent.id, {
                position: { ...selectedComponent.position, x: parseFloat(e.target.value) || 0 }
              })}
              placeholder="X"
            />
            <input
              type="number"
              className="property-input"
              value={Math.round(selectedComponent.position.y)}
              onChange={(e) => onComponentUpdate(selectedComponent.id, {
                position: { ...selectedComponent.position, y: parseFloat(e.target.value) || 0 }
              })}
              placeholder="Y"
            />
          </div>
        </div>

        <div className="property-item">
          <label className="property-label">Rotation</label>
          <input
            type="number"
            className="property-input"
            value={selectedComponent.rotation}
            onChange={(e) => onComponentUpdate(selectedComponent.id, {
              rotation: parseFloat(e.target.value) || 0
            })}
            min="0"
            max="360"
            step="15"
          />
        </div>
      </div>
    );
  };

  const renderConnectionProperties = () => {
    if (!selectedConnection) return null;

    return (
      <div className="property-group">
        <div className="property-group-title">Connection</div>
        
        <div className="property-item">
          <label className="property-label">From</label>
          <div className="property-input" style={{ backgroundColor: 'var(--secondary-bg)' }}>
            {selectedConnection.from.componentId} - {selectedConnection.from.terminal}
          </div>
        </div>

        <div className="property-item">
          <label className="property-label">To</label>
          <div className="property-input" style={{ backgroundColor: 'var(--secondary-bg)' }}>
            {selectedConnection.to.componentId} - {selectedConnection.to.terminal}
          </div>
        </div>

        <button
          className="toolbar-button danger"
          onClick={() => onConnectionDelete(selectedConnection.id)}
          style={{ width: '100%', marginTop: '16px' }}
        >
          <Trash2 size={16} />
          Delete Connection
        </button>
      </div>
    );
  };

  const renderSimulationResults = () => {
    if (!simulation || (!selectedComponent && !selectedConnection)) return null;

    const results = [];

    if (selectedComponent) {
      // Show component-specific simulation results
      const componentVoltages = Object.entries(simulation.voltages)
        .filter(([nodeId]) => nodeId.startsWith(selectedComponent.id))
        .map(([nodeId, voltage]) => ({
          label: `Voltage (${nodeId.split('_')[1]})`,
          value: voltage,
          unit: 'V'
        }));

      const componentPower = simulation.power[selectedComponent.id];
      if (componentPower !== undefined) {
        results.push({
          label: 'Power Dissipation',
          value: componentPower,
          unit: 'W'
        });
      }

      results.push(...componentVoltages);
    }

    if (selectedConnection) {
      // Show connection-specific simulation results
      const connectionCurrent = simulation.currents[selectedConnection.id];
      if (connectionCurrent !== undefined) {
        results.push({
          label: 'Current',
          value: connectionCurrent,
          unit: 'A'
        });
      }
    }

    if (results.length === 0) return null;

    return (
      <div className="property-group">
        <div className="property-group-title">Simulation Results</div>
        
        <div className="simulation-results">
          {results.map((result, index) => (
            <div key={index} className="simulation-value">
              <span className="simulation-label">{result.label}</span>
              <span className="simulation-number">
                {formatValue(result.value, result.unit)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!selectedComponent && !selectedConnection) {
    return (
      <div className="properties-panel">
        <div className="properties-header">
          Properties
        </div>
        <div className="properties-content">
          <div className="no-selection">
            Select a component or connection to view its properties
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="properties-panel">
      <div className="properties-header">
        Properties
      </div>
      <div className="properties-content">
        {renderComponentProperties()}
        {renderConnectionProperties()}
        {renderSimulationResults()}
      </div>
    </div>
  );
};