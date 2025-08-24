import { Component, Connection, SimulationResult, ComponentType } from '../types/circuit';

interface Node {
  id: string;
  components: string[];
  voltage: number;
}

interface Branch {
  id: string;
  from: string;
  to: string;
  componentId: string;
  current: number;
}

export class CircuitSimulator {
  private nodes: Map<string, Node> = new Map();
  private branches: Branch[] = [];
  private components: Map<string, Component> = new Map();

  constructor(components: Component[], connections: Connection[]) {
    this.buildCircuit(components, connections);
  }

  private buildCircuit(components: Component[], connections: Connection[]) {
    // Clear previous circuit
    this.nodes.clear();
    this.branches = [];
    this.components.clear();

    // Add components
    components.forEach(comp => {
      this.components.set(comp.id, comp);
    });

    // Create nodes from connections
    connections.forEach(conn => {
      const fromNode = this.getOrCreateNode(conn.from.componentId, conn.from.terminal);
      const toNode = this.getOrCreateNode(conn.to.componentId, conn.to.terminal);
      
      // Create branch
      this.branches.push({
        id: conn.id,
        from: fromNode.id,
        to: toNode.id,
        componentId: conn.from.componentId,
        current: 0
      });
    });

    // Merge nodes that are connected by wires
    this.mergeConnectedNodes();
  }

  private getOrCreateNode(componentId: string, terminal: string): Node {
    const nodeId = `${componentId}_${terminal}`;
    
    if (!this.nodes.has(nodeId)) {
      this.nodes.set(nodeId, {
        id: nodeId,
        components: [componentId],
        voltage: 0
      });
    }
    
    return this.nodes.get(nodeId)!;
  }

  private mergeConnectedNodes() {
    // Simple node merging - in a real implementation, this would be more sophisticated
    // For now, we'll just ensure ground nodes are at 0V
    this.nodes.forEach(node => {
      const component = this.components.get(node.components[0]);
      if (component?.type === ComponentType.GROUND) {
        node.voltage = 0;
      }
    });
  }

  public simulate(): SimulationResult {
    try {
      // Perform DC analysis using nodal analysis
      const voltages = this.solveNodalAnalysis();
      const currents = this.calculateCurrents(voltages);
      const power = this.calculatePower(voltages, currents);

      return {
        voltages,
        currents,
        power
      };
    } catch (error) {
      console.error('Simulation error:', error);
      return {
        voltages: {},
        currents: {},
        power: {}
      };
    }
  }

  private solveNodalAnalysis(): { [nodeId: string]: number } {
    const nodeIds = Array.from(this.nodes.keys());
    const voltages: { [nodeId: string]: number } = {};

    // Initialize voltages
    nodeIds.forEach(nodeId => {
      const node = this.nodes.get(nodeId)!;
      voltages[nodeId] = node.voltage;
    });

    // Simple iterative solver (Gauss-Seidel method)
    const maxIterations = 100;
    const tolerance = 1e-6;

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      let maxChange = 0;

      nodeIds.forEach(nodeId => {
        const node = this.nodes.get(nodeId)!;
        if (node.voltage === 0) return; // Skip ground nodes

        const oldVoltage = voltages[nodeId];
        const newVoltage = this.calculateNodeVoltage(nodeId, voltages);
        const change = Math.abs(newVoltage - oldVoltage);
        
        if (change > maxChange) {
          maxChange = change;
        }

        voltages[nodeId] = newVoltage;
      });

      if (maxChange < tolerance) {
        break;
      }
    }

    return voltages;
  }

  private calculateNodeVoltage(nodeId: string, voltages: { [nodeId: string]: number }): number {
    const node = this.nodes.get(nodeId)!;
    let sumConductance = 0;
    let sumCurrent = 0;

    // Find all branches connected to this node
    this.branches.forEach(branch => {
      if (branch.from === nodeId || branch.to === nodeId) {
        const component = this.components.get(branch.componentId);
        if (!component) return;

        const conductance = this.getComponentConductance(component);
        const sourceCurrent = this.getComponentSourceCurrent(component);

        if (branch.from === nodeId) {
          sumConductance += conductance;
          sumCurrent += conductance * voltages[branch.to] + sourceCurrent;
        } else {
          sumConductance += conductance;
          sumCurrent += conductance * voltages[branch.from] - sourceCurrent;
        }
      }
    });

    return sumConductance > 0 ? sumCurrent / sumConductance : 0;
  }

  private getComponentConductance(component: Component): number {
    switch (component.type) {
      case ComponentType.RESISTOR:
        return 1 / (component.properties.resistance || 1000);
      case ComponentType.VOLTAGE_SOURCE:
        return 1 / (component.properties.internalResistance || 0.1);
      case ComponentType.CURRENT_SOURCE:
        return 1 / (component.properties.internalResistance || 1e6);
      case ComponentType.SWITCH:
        return component.properties.isClosed ? 
          1 / (component.properties.contactResistance || 0.01) : 0;
      default:
        return 0.001; // Default small conductance
    }
  }

  private getComponentSourceCurrent(component: Component): number {
    switch (component.type) {
      case ComponentType.VOLTAGE_SOURCE:
        return (component.properties.voltage || 5) / (component.properties.internalResistance || 0.1);
      case ComponentType.CURRENT_SOURCE:
        return component.properties.current || 1;
      default:
        return 0;
    }
  }

  private calculateCurrents(voltages: { [nodeId: string]: number }): { [branchId: string]: number } {
    const currents: { [branchId: string]: number } = {};

    this.branches.forEach(branch => {
      const component = this.components.get(branch.componentId);
      if (!component) return;

      const voltageDiff = voltages[branch.to] - voltages[branch.from];
      const conductance = this.getComponentConductance(component);
      const sourceCurrent = this.getComponentSourceCurrent(component);

      currents[branch.id] = conductance * voltageDiff + sourceCurrent;
    });

    return currents;
  }

  private calculatePower(voltages: { [nodeId: string]: number }, currents: { [branchId: string]: number }): { [componentId: string]: number } {
    const power: { [componentId: string]: number } = {};

    this.branches.forEach(branch => {
      const component = this.components.get(branch.componentId);
      if (!component) return;

      const voltageDiff = Math.abs(voltages[branch.to] - voltages[branch.from]);
      const current = Math.abs(currents[branch.id]);
      
      power[branch.componentId] = voltageDiff * current;
    });

    return power;
  }
}

export const simulateCircuit = (components: Component[], connections: Connection[]): SimulationResult => {
  const simulator = new CircuitSimulator(components, connections);
  return simulator.simulate();
};