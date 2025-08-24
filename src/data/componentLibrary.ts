import { ComponentTemplate, ComponentType } from '../types/circuit';

export const componentLibrary: ComponentTemplate[] = [
  {
    type: ComponentType.RESISTOR,
    name: 'Resistor',
    icon: '⚡',
    category: 'Passive',
    defaultProperties: {
      resistance: 1000,
      tolerance: 5,
      powerRating: 0.25
    },
    terminals: [
      { id: '1', name: 'Terminal 1', position: { x: -20, y: 0 }, type: 'bidirectional' },
      { id: '2', name: 'Terminal 2', position: { x: 20, y: 0 }, type: 'bidirectional' }
    ]
  },
  {
    type: ComponentType.CAPACITOR,
    name: 'Capacitor',
    icon: '⚡',
    category: 'Passive',
    defaultProperties: {
      capacitance: 1e-6,
      voltageRating: 50,
      tolerance: 10
    },
    terminals: [
      { id: '1', name: 'Positive', position: { x: -20, y: 0 }, type: 'bidirectional' },
      { id: '2', name: 'Negative', position: { x: 20, y: 0 }, type: 'bidirectional' }
    ]
  },
  {
    type: ComponentType.INDUCTOR,
    name: 'Inductor',
    icon: '⚡',
    category: 'Passive',
    defaultProperties: {
      inductance: 1e-3,
      currentRating: 1,
      resistance: 0.1
    },
    terminals: [
      { id: '1', name: 'Terminal 1', position: { x: -20, y: 0 }, type: 'bidirectional' },
      { id: '2', name: 'Terminal 2', position: { x: 20, y: 0 }, type: 'bidirectional' }
    ]
  },
  {
    type: ComponentType.VOLTAGE_SOURCE,
    name: 'Voltage Source',
    icon: '🔋',
    category: 'Sources',
    defaultProperties: {
      voltage: 5,
      internalResistance: 0.1,
      frequency: 0
    },
    terminals: [
      { id: '1', name: 'Positive', position: { x: -20, y: 0 }, type: 'output' },
      { id: '2', name: 'Negative', position: { x: 20, y: 0 }, type: 'output' }
    ]
  },
  {
    type: ComponentType.CURRENT_SOURCE,
    name: 'Current Source',
    icon: '🔋',
    category: 'Sources',
    defaultProperties: {
      current: 1,
      internalResistance: 1e6,
      frequency: 0
    },
    terminals: [
      { id: '1', name: 'Positive', position: { x: -20, y: 0 }, type: 'output' },
      { id: '2', name: 'Negative', position: { x: 20, y: 0 }, type: 'output' }
    ]
  },
  {
    type: ComponentType.LED,
    name: 'LED',
    icon: '💡',
    category: 'Active',
    defaultProperties: {
      forwardVoltage: 2,
      forwardCurrent: 0.02,
      color: 'red'
    },
    terminals: [
      { id: '1', name: 'Anode', position: { x: -20, y: 0 }, type: 'bidirectional' },
      { id: '2', name: 'Cathode', position: { x: 20, y: 0 }, type: 'bidirectional' }
    ]
  },
  {
    type: ComponentType.SWITCH,
    name: 'Switch',
    icon: '🔘',
    category: 'Controls',
    defaultProperties: {
      isClosed: false,
      contactResistance: 0.01
    },
    terminals: [
      { id: '1', name: 'Terminal 1', position: { x: -20, y: 0 }, type: 'bidirectional' },
      { id: '2', name: 'Terminal 2', position: { x: 20, y: 0 }, type: 'bidirectional' }
    ]
  },
  {
    type: ComponentType.GROUND,
    name: 'Ground',
    icon: '🌍',
    category: 'Reference',
    defaultProperties: {},
    terminals: [
      { id: '1', name: 'Ground', position: { x: 0, y: 20 }, type: 'bidirectional' }
    ]
  },
  {
    type: ComponentType.AMMETER,
    name: 'Ammeter',
    icon: '📊',
    category: 'Measurement',
    defaultProperties: {
      internalResistance: 0.01,
      maxCurrent: 10
    },
    terminals: [
      { id: '1', name: 'Input', position: { x: -20, y: 0 }, type: 'bidirectional' },
      { id: '2', name: 'Output', position: { x: 20, y: 0 }, type: 'bidirectional' }
    ]
  },
  {
    type: ComponentType.VOLTMETER,
    name: 'Voltmeter',
    icon: '📊',
    category: 'Measurement',
    defaultProperties: {
      internalResistance: 1e6,
      maxVoltage: 100
    },
    terminals: [
      { id: '1', name: 'Positive', position: { x: -20, y: 0 }, type: 'input' },
      { id: '2', name: 'Negative', position: { x: 20, y: 0 }, type: 'input' }
    ]
  },
  {
    type: ComponentType.DIODE,
    name: 'Diode',
    icon: '🔸',
    category: 'Active',
    defaultProperties: {
      forwardVoltage: 0.7,
      reverseBreakdown: 50,
      reverseLeakage: 1e-9
    },
    terminals: [
      { id: '1', name: 'Anode', position: { x: -20, y: 0 }, type: 'bidirectional' },
      { id: '2', name: 'Cathode', position: { x: 20, y: 0 }, type: 'bidirectional' }
    ]
  },
  {
    type: ComponentType.TRANSISTOR_NPN,
    name: 'NPN Transistor',
    icon: '🔸',
    category: 'Active',
    defaultProperties: {
      beta: 100,
      vbe: 0.7,
      vce: 0.2
    },
    terminals: [
      { id: '1', name: 'Base', position: { x: 0, y: -20 }, type: 'bidirectional' },
      { id: '2', name: 'Collector', position: { x: -20, y: 0 }, type: 'bidirectional' },
      { id: '3', name: 'Emitter', position: { x: 20, y: 0 }, type: 'bidirectional' }
    ]
  },
  {
    type: ComponentType.TRANSISTOR_PNP,
    name: 'PNP Transistor',
    icon: '🔸',
    category: 'Active',
    defaultProperties: {
      beta: 100,
      vbe: -0.7,
      vce: -0.2
    },
    terminals: [
      { id: '1', name: 'Base', position: { x: 0, y: -20 }, type: 'bidirectional' },
      { id: '2', name: 'Collector', position: { x: -20, y: 0 }, type: 'bidirectional' },
      { id: '3', name: 'Emitter', position: { x: 20, y: 0 }, type: 'bidirectional' }
    ]
  },
  {
    type: ComponentType.OP_AMP,
    name: 'Op-Amp',
    icon: '🔸',
    category: 'Active',
    defaultProperties: {
      gain: 1e5,
      inputImpedance: 1e6,
      outputImpedance: 75
    },
    terminals: [
      { id: '1', name: 'Inverting', position: { x: -20, y: -10 }, type: 'input' },
      { id: '2', name: 'Non-inverting', position: { x: -20, y: 10 }, type: 'input' },
      { id: '3', name: 'Output', position: { x: 20, y: 0 }, type: 'output' },
      { id: '4', name: 'V+', position: { x: 0, y: -20 }, type: 'input' },
      { id: '5', name: 'V-', position: { x: 0, y: 20 }, type: 'input' }
    ]
  }
];

export const getComponentTemplate = (type: ComponentType): ComponentTemplate | undefined => {
  return componentLibrary.find(comp => comp.type === type);
};

export const getComponentsByCategory = (category: string): ComponentTemplate[] => {
  return componentLibrary.filter(comp => comp.category === category);
};

export const getCategories = (): string[] => {
  return [...new Set(componentLibrary.map(comp => comp.category))];
};