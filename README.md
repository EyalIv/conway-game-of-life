# Conway's Game of Life

A modern, interactive implementation of John Conway's famous cellular automaton. Built as a portfolio piece and educational tool to demonstrate emergent complexity from simple rules.

![Conway's Game of Life Demo](./demo.gif)

## 🎮 [Live Demo](https://eyaliv.github.io/conway-game-of-life/)

## Features

- **Interactive Grid** – Click cells to toggle them on/off
- **Pattern Library** – Load classic patterns (Glider, Blinker, Gosper Gun, etc.)
- **Adjustable Speed** – Control simulation speed with a slider
- **Generation & Population Stats** – Track evolution in real-time
- **Responsive Design** – Works on desktop and mobile
- **Clean UI** – Minimalist design with smooth animations

## The Rules

1. Any live cell with **fewer than 2** neighbors dies (underpopulation)
2. Any live cell with **2 or 3** neighbors survives
3. Any live cell with **more than 3** neighbors dies (overpopulation)
4. Any dead cell with **exactly 3** neighbors becomes alive (reproduction)

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** – Build tool
- **Tailwind CSS** – Styling
- **Framer Motion** – Animations
- **Radix UI** – Accessible components
- **Shadcn/ui** – UI component library

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## License

MIT © [Eyal Ivri](https://github.com/EyalIv)

## Credits

- Design created with [Figma](https://www.figma.com/)

---

Made with ❤️ by [Eyal Ivri](https://github.com/EyalIv)