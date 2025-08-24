import React from 'react';
import { Play, Square, Trash2, RotateCcw, Settings } from 'lucide-react';

interface ToolbarProps {
  onSimulate: () => void;
  onClear: () => void;
  isSimulating: boolean;
  hasSimulation: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onSimulate,
  onClear,
  isSimulating,
  hasSimulation
}) => {
  return (
    <div className="toolbar">
      <button
        className={`toolbar-button primary ${isSimulating ? 'disabled' : ''}`}
        onClick={onSimulate}
        disabled={isSimulating}
      >
        {isSimulating ? <Square size={16} /> : <Play size={16} />}
        {isSimulating ? 'Simulating...' : 'Run Simulation'}
      </button>

      <div className="toolbar-separator" />

      <button
        className="toolbar-button"
        onClick={() => {
          // TODO: Implement undo functionality
          console.log('Undo clicked');
        }}
      >
        <RotateCcw size={16} />
        Undo
      </button>

      <button
        className="toolbar-button"
        onClick={() => {
          // TODO: Implement redo functionality
          console.log('Redo clicked');
        }}
      >
        <RotateCcw size={16} style={{ transform: 'scaleX(-1)' }} />
        Redo
      </button>

      <div className="toolbar-separator" />

      <button
        className="toolbar-button"
        onClick={() => {
          // TODO: Implement settings panel
          console.log('Settings clicked');
        }}
      >
        <Settings size={16} />
        Settings
      </button>

      <div style={{ flex: 1 }} />

      <button
        className="toolbar-button danger"
        onClick={onClear}
      >
        <Trash2 size={16} />
        Clear Circuit
      </button>
    </div>
  );
};