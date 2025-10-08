# Stream Synth - Web Audio Loops

![Stream Synth](https://storage.googleapis.com/gpt-engineer-file-uploads/MeGALhDaU9M8WrfrR6D5v9Qgyz62/social-images/social-1759098551142-Screenshot%20from%202025-09-28%2015-28-47.png)

A browser-based music creation tool for crafting electronic music loops. Stream Synth combines vintage-inspired synthesizers with a modern sequencer interface, allowing you to create, mix, and share your tracks instantly - no installation required.

## Features

### 🎹 Music Production
- **Multi-track Sequencer**: Create patterns with up to 16 steps per track
- **Web Audio Synthesis**: Real-time audio generation using the Web Audio API
- **Vintage Sound Engine**: Multiple waveforms (sine, square, sawtooth, triangle) with ADSR envelopes
- **Drum Synthesis**: Built-in drum sounds with noise and pitch modulation

### 🎚️ Mixing & Effects
- **Per-Track Controls**: Individual volume, panning, and muting for each track
- **Master Effects**: Global filter and delay with adjustable parameters
- **Real-time Waveform Display**: Visual feedback of your audio output

### 🎵 Presets & Workflow
- **Extensive Preset Library**: Pre-configured setups for multiple genres including Acid Techno, Jungle, Dubstep, Trance, and Trap
- **Roland-Inspired Sounds**: Authentic 303, 808, 909 emulations with categorized presets (Drums, Bass, Synths, FX)
- **Custom Presets**: Save your own creations to local storage
- **Soundboard**: Quick access to your saved presets
- **Instant Sharing**: Generate shareable links to your compositions
- **Undo/Redo**: Full history tracking for all your edits
- **Keyboard Shortcuts**: Spacebar to play/pause, Ctrl+Z/Y for undo/redo, Ctrl+Arrow for BPM control

### 🎛️ Synthesis Controls
- **ADSR Envelope**: Attack, Decay, Sustain, Release parameters
- **Filter Section**: Adjustable cutoff frequency and resonance
- **Master Transport**: Play, stop, and tempo control (60-200 BPM)

## Technologies

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI framework
- **Web Audio API** - Real-time audio synthesis
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

4. Open your browser and navigate to the local development URL (typically `http://localhost:8080`)

### Building for Production

To create a production build:

```sh
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Select a Preset**: Choose from multiple genres (Acid Techno, Jungle, Dubstep, Trance, Trap) or start with a Basic 909 Kit
2. **Edit Tracks**: Click on individual steps in the sequencer to create your pattern
3. **Choose Sounds**: Select from categorized Roland-inspired presets (Drums, Bass, Synths, Percussion, FX)
4. **Adjust Sounds**: Use the synth controls to modify waveforms, envelopes, and filters
5. **Mix**: Balance your tracks using the mixer controls (volume, pan, solo, mute)
6. **Use Shortcuts**: Spacebar for play/pause, Ctrl+Z for undo, Ctrl+Arrow keys for BPM
7. **Save**: Store your custom presets to the soundboard for quick recall
8. **Share**: Generate a shareable link to send your creation to others

## License

This project is open source and available under the MIT License.
