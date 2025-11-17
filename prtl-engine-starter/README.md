# PRTL Engine Starter (Single Canvas WebGL)

This is a tiny starter project for experimenting with a live-performance visuals engine.

## Features

- Plain HTML + ES modules (no bundler required)
- WebGL2 single-canvas renderer
- Fullscreen triangle setup
- Time + resolution uniforms
- Simple API:
  - `start()`, `stop()`
  - `resize(width, height)`
  - `setUniform(name, value)`
  - `setFragmentShader(source)`

## How to run

You need to serve this folder with a static file server (browsers dislike `file://` for modules).

Quick options:

- Python 3:

  ```bash
  cd prtl-engine-starter
  python -m http.server 4173
  ```

- Node (if you have it):

  ```bash
  npm install -g serve
  cd prtl-engine-starter
  serve .
  ```

Then open http://localhost:4173 (or whatever URL your server prints).

Edit `src/shaders.js` or swap shaders in `src/main.js` to start hacking visuals.
