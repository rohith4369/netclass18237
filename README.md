# Circuit Simulator

A modern, interactive web-based circuit simulator inspired by EveryCircuit.com. Built with React, TypeScript, and Konva.js for smooth canvas-based interactions.

## Features

### 🎯 Core Functionality
- **Interactive Circuit Design**: Drag and drop components onto the canvas
- **Real-time Simulation**: DC analysis with nodal analysis algorithm
- **Component Library**: 15+ electronic components organized by category
- **Visual Feedback**: Live voltage and current indicators
- **Grid Snapping**: Precise component placement with optional grid alignment

### 🔧 Components Available
- **Passive Components**: Resistors, Capacitors, Inductors
- **Power Sources**: Voltage Sources, Current Sources
- **Active Components**: LEDs, Diodes, NPN/PNP Transistors, Op-Amps
- **Controls**: Switches
- **Measurement**: Ammeters, Voltmeters
- **Reference**: Ground connections

### 🎨 User Interface
- **Modern Dark Theme**: Professional dark UI with accent colors
- **Responsive Design**: Works on desktop and tablet devices
- **Component Properties Panel**: Edit component values in real-time
- **Simulation Results**: View voltages, currents, and power dissipation
- **Keyboard Shortcuts**: Delete key to remove selected components/connections

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd circuit-simulator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## How to Use

### Creating a Circuit

1. **Add Components**: Click on components in the left sidebar to add them to the canvas
2. **Position Components**: Drag components around the canvas to position them
3. **Connect Components**: Click on component terminals to create connections
4. **Edit Properties**: Select a component and modify its properties in the right panel

### Running Simulation

1. **Build Your Circuit**: Add components and connect them properly
2. **Run Simulation**: Click the "Run Simulation" button in the toolbar
3. **View Results**: Select components or connections to see simulation results

### Example Circuits

#### Simple LED Circuit
1. Add a Voltage Source (5V)
2. Add a Resistor (1kΩ)
3. Add an LED
4. Add a Ground connection
5. Connect: Voltage Source (+) → Resistor → LED → Ground
6. Connect: Voltage Source (-) → Ground
7. Run simulation to see LED current and voltage drops

#### Voltage Divider
1. Add a Voltage Source (10V)
2. Add two Resistors (1kΩ each)
3. Add a Ground connection
4. Connect: Voltage Source (+) → Resistor 1 → Resistor 2 → Ground
5. Connect: Voltage Source (-) → Ground
6. Run simulation to see voltage division

## Technical Details

### Architecture
- **Frontend**: React 18 with TypeScript
- **Canvas**: Konva.js for 2D graphics and interactions
- **Styling**: CSS with CSS custom properties for theming
- **Build Tool**: Vite for fast development and optimized builds

### Simulation Engine
- **Algorithm**: Nodal analysis with Gauss-Seidel iteration
- **Analysis Type**: DC analysis (steady-state)
- **Components**: Linear and non-linear component models
- **Accuracy**: Configurable tolerance for convergence

### Component Models
- **Resistors**: Linear resistance model
- **Voltage Sources**: Ideal sources with optional internal resistance
- **Current Sources**: Ideal sources with optional internal resistance
- **Switches**: Binary on/off states
- **Diodes**: Simplified forward voltage model
- **Transistors**: Basic BJT models with beta and threshold voltages

## Customization

### Adding New Components
1. Define component in `src/data/componentLibrary.ts`
2. Add component type to `ComponentType` enum
3. Implement component rendering in `CircuitCanvas`
4. Add simulation model in `simulation.ts`

### Styling
- Modify CSS custom properties in `src/index.css`
- Component-specific styles in `src/App.css`
- Responsive breakpoints for different screen sizes

## Browser Support
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Performance
- Canvas-based rendering for smooth interactions
- Efficient component state management
- Optimized simulation algorithms
- Lazy loading of component libraries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by EveryCircuit.com
- Built with modern web technologies
- Uses Konva.js for canvas interactions
- Lucide React for beautiful icons

## Roadmap

- [ ] AC analysis and frequency response
- [ ] Transient analysis
- [ ] More component types (MOSFETs, IGBTs, etc.)
- [ ] Circuit export/import (SPICE format)
- [ ] Waveform visualization
- [ ] Multi-sheet designs
- [ ] Component libraries and templates
- [ ] Collaborative editing
- [ ] Mobile app version