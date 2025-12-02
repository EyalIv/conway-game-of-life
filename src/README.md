# Conway's Game of Life - Independent Setup Guide

A modern, interactive implementation of Conway's Game of Life built with React, TypeScript, and Tailwind CSS, featuring an elegant e-ink aesthetic inspired by Kindle/e-reader devices.

## 🚀 Features

- **Interactive Grid**: Click and drag to toggle cells, with smart paint/erase modes
- **Game Controls**: Play/pause, step-by-step simulation, speed adjustment
- **Pattern Library**: Pre-loaded famous patterns (Glider, Gosper Gun, etc.)
- **Smart Detection**: Automatic detection of static patterns and oscillators
- **Responsive Design**: Works on desktop and mobile devices
- **E-ink Aesthetic**: Clean black and white contrast with paper-like backgrounds
- **Figma-inspired UI**: Modern design principles with smooth animations

## 🛠 Technologies Used

### Core Technologies
- **React 18+** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **Motion** (formerly Framer Motion) - Animation library
- **shadcn/ui** - Pre-built UI components

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 📦 Required Dependencies

### Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "motion": "^10.16.0",
  "lucide-react": "^0.263.1",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^1.14.0"
}
```

### Development Dependencies
```json
{
  "@types/react": "^18.2.15",
  "@types/react-dom": "^18.2.7",
  "@typescript-eslint/eslint-plugin": "^6.0.0",
  "@typescript-eslint/parser": "^6.0.0",
  "@vitejs/plugin-react": "^4.0.3",
  "eslint": "^8.45.0",
  "eslint-plugin-react-hooks": "^4.6.0",
  "eslint-plugin-react-refresh": "^0.4.3",
  "postcss": "^8.4.24",
  "tailwindcss": "^4.0.0",
  "typescript": "^5.0.2",
  "vite": "^4.4.5"
}
```

## 🏗 Setting Up the Project

### 1. Initialize a New Vite + React + TypeScript Project

```bash
npm create vite@latest conways-game-of-life -- --template react-ts
cd conways-game-of-life
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install motion lucide-react class-variance-authority clsx tailwind-merge

# Install Tailwind CSS v4
npm install tailwindcss@next @tailwindcss/vite@next
```

### 3. Configure Vite

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
```

### 4. Set Up Tailwind CSS

Create `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
```

### 5. Copy Project Files

Copy all the files from the Figma project to your new Vite project:

```
src/
├── App.tsx                    # Main application component
├── main.tsx                   # Vite entry point
├── index.css                  # Import the globals.css
├── components/
│   ├── GameControls.tsx       # Game control panel
│   ├── GameGrid.tsx          # Interactive game grid
│   ├── GameStats.tsx         # Statistics display
│   └── ui/                   # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── select.tsx
│       ├── slider.tsx
│       └── ... (other UI components)
├── utils/
│   └── gameOfLife.ts         # Game logic and patterns
└── styles/
    └── globals.css           # Global styles and Tailwind config
```

### 6. Update Entry Files

Update `src/main.tsx`:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

Create `src/index.css`:

```css
@import './styles/globals.css';
```

### 7. Update Import Paths

Since Vite uses a different structure than Figma Make, you'll need to update import paths:

- Change `'./components/...'` to `'@/components/...'` (if using the alias)
- Or keep relative imports but adjust paths based on your file structure

### 8. Install shadcn/ui Components

If you want to use the shadcn/ui components, you'll need to set them up:

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card select slider
```

Follow the shadcn/ui setup wizard and choose your preferences.

## 🚦 Running the Project

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
conways-game-of-life/
├── public/                   # Static assets
├── src/
│   ├── components/          # React components
│   │   ├── GameControls.tsx
│   │   ├── GameGrid.tsx
│   │   ├── GameStats.tsx
│   │   └── ui/             # shadcn/ui components
│   ├── utils/              # Utility functions
│   │   └── gameOfLife.ts   # Game logic
│   ├── styles/             # CSS files
│   │   └── globals.css     # Global styles
│   ├── App.tsx             # Main component
│   ├── main.tsx            # Entry point
│   └── index.css           # CSS imports
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

## 🎮 Game Features

### Core Functionality
- **Cell Interaction**: Click individual cells or drag to paint/erase multiple cells
- **Simulation Controls**: Play/pause, step-by-step execution, speed adjustment
- **Pattern Loading**: Load famous Conway's Game of Life patterns
- **Grid Customization**: Adjustable grid size (10x10 to 50x50)
- **Statistics**: Live tracking of generation count and population

### Pre-loaded Patterns
- **Glider**: A simple moving pattern
- **Gosper Gun**: A pattern that creates gliders
- **Pulsar**: A period-3 oscillator
- **Beacon**: A period-2 oscillator
- **Block**: A static pattern

### Smart Detection
- **Static Patterns**: Automatically detects when the grid reaches a stable state
- **Oscillators**: Detects repeating patterns and stops infinite loops
- **Population Tracking**: Real-time count of living cells

## 🔧 Customization

### Modifying Game Rules
Edit `src/utils/gameOfLife.ts` to modify the cellular automaton rules or add new patterns.

### Styling Changes
The app uses a custom e-ink aesthetic defined in `src/styles/globals.css`. You can modify colors, typography, and spacing there.

### Adding New Features
The modular component structure makes it easy to add new features:
- Add new patterns to the `patterns` object in `gameOfLife.ts`
- Extend the controls in `GameControls.tsx`
- Modify the grid rendering in `GameGrid.tsx`

## 🐛 Troubleshooting

### Common Issues

1. **Motion/Framer Motion Import Errors**: Make sure you're using `motion/react` not `framer-motion`
2. **Tailwind Classes Not Working**: Ensure Tailwind CSS v4 is properly configured
3. **TypeScript Errors**: Make sure all type definitions are installed
4. **Build Errors**: Check that all imports are correctly resolved

### Performance Tips

- The app is optimized for grids up to 50x50
- For larger grids, consider implementing virtualization
- Animation performance can be improved by reducing the `transition` duration

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues and pull requests to improve the game!

## 🙏 Acknowledgments

- John Conway for creating the original Game of Life
- The React and Tailwind CSS communities
- shadcn for the beautiful UI components