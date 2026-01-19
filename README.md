# Virtual Rubik 3D 🎮

An interactive 3D Rubik's Cube simulator built with React Three Fiber and Three.js.

## ✨ Features

- **Interactive 3D Rubik's Cube** with realistic animations
- **Standard notation support** (R, L, U, D, F, B with modifiers ', 2)
- **Algorithm input** for executing move sequences
- **Scramble function** for random 20-move scrambles
- **Auto-resolve** to undo all moves in reverse order
- **Queue-based animation system** for smooth sequential moves
- **Orbit controls** for 360° viewing

## 🎯 Controls

### Basic Moves
- Click buttons for individual moves (R, L, U, D, F, B)
- Add `'` for counter-clockwise rotations (e.g., R')
- Add `2` for 180° rotations (e.g., R2)

### Algorithm Input
- Enter move sequences like: `R U R' U'`
- Multiple moves separated by spaces
- Click Execute to run the algorithm

### Utility Functions
- **Scramble**: Generate random 20-move scramble
- **Resolve**: Automatically undo all moves
- **Reset**: Reset cube to solved state

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Three.js** - 3D graphics engine
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Helper components
- **Vite** - Build tool

## 📝 License

MIT License

## 👤 Author

**itzBaowy**

- GitHub: [@itzBaowy](https://github.com/itzBaowy)
- Project: [Virtual-Rubik-3D](https://github.com/itzBaowy/Virtual-Rubik-3D)
