import { Renderer } from "./renderer.js";

/**
 * Engine: manages render loop, uniforms, and resize.
 */
export function createEngine({ canvas }) {
  const renderer = new Renderer(canvas);

  let running = false;
  let lastTime = performance.now();
  const uniforms = {
    time: 0,
    resolution: [canvas.width, canvas.height],
    brightness: 1.0,
    audioLevel: 0.0,
  };

  function frame(now) {
    if (!running) return;
    const dt = (now - lastTime) / 1000;
    lastTime = now;
    uniforms.time += dt;

    renderer.render(uniforms);
    requestAnimationFrame(frame);
  }

  return {
    start() {
      if (running) return;
      running = true;
      lastTime = performance.now();
      requestAnimationFrame(frame);
    },
    stop() {
      running = false;
    },
    resize(width, height) {
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      uniforms.resolution = [width, height];
      renderer.resize(width, height);
    },
    setUniform(name, value) {
      uniforms[name] = value;
    },
    setFragmentShader(source) {
      renderer.setFragmentShader(source);
    },
  };
}
