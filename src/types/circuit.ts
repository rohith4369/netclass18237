export interface Point {
  x: number;
  y: number;
}

export interface Component {
  id: string;
  type: ComponentType;
  position: Point;
  rotation: number;
  properties: ComponentProperties;
  connections: Connection[];
  selected: boolean;
}

export interface Connection {
  id: string;
  from: { componentId: string; terminal: string };
  to: { componentId: string; terminal: string };
  selected: boolean;
}

export interface ComponentProperties {
  [key: string]: any;
}

export enum ComponentType {
  RESISTOR = 'resistor',
  CAPACITOR = 'capacitor',
  INDUCTOR = 'inductor',
  VOLTAGE_SOURCE = 'voltage_source',
  CURRENT_SOURCE = 'current_source',
  LED = 'led',
  SWITCH = 'switch',
  GROUND = 'ground',
  WIRE = 'wire',
  AMMETER = 'ammeter',
  VOLTMETER = 'voltmeter',
  TRANSISTOR_NPN = 'transistor_npn',
  TRANSISTOR_PNP = 'transistor_pnp',
  DIODE = 'diode',
  OP_AMP = 'op_amp'
}

export interface SimulationResult {
  voltages: { [nodeId: string]: number };
  currents: { [branchId: string]: number };
  power: { [componentId: string]: number };
}

export interface CircuitState {
  components: Component[];
  connections: Connection[];
  simulation: SimulationResult | null;
  selectedComponent: string | null;
  selectedConnection: string | null;
  gridSize: number;
  snapToGrid: boolean;
}

export interface ComponentTemplate {
  type: ComponentType;
  name: string;
  icon: string;
  category: string;
  defaultProperties: ComponentProperties;
  terminals: Terminal[];
}

export interface Terminal {
  id: string;
  name: string;
  position: Point;
  type: 'input' | 'output' | 'bidirectional';
}