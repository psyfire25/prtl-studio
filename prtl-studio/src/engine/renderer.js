import { vertexShaderSource, defaultFragmentShader } from "../shaders.js";

/**
 * Renderer: owns WebGL2 context and draws a fullscreen triangle.
 */
export class Renderer {
  constructor(canvas) {
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      throw new Error("WebGL2 not supported in this browser.");
    }
    this.gl = gl;
    this.program = null;
    this.uniformLocations = new Map();
    this._initGeometry();
    // use default fragment shader on startup
    this.setFragmentShader(); 
  }

  _initGeometry() {
    const gl = this.gl;
    // Fullscreen triangle positions (covers entire screen)
    const positions = new Float32Array([
      -1, -1,
       3, -1,
      -1,  3,
    ]);

    this.vao = gl.createVertexArray();
    this.vbo = gl.createBuffer();

    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  _compileShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error("Shader compile error:\n" + log);
    }
    return shader;
  }

  _createProgram(fragmentSource) {
    const gl = this.gl;
    const vs = this._compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = this._compileShader(gl.FRAGMENT_SHADER, fragmentSource);

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, "a_position");
    gl.linkProgram(program);

    gl.deleteShader(vs);
    gl.deleteShader(fs);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error("Program link error:\n" + log);
    }

    return program;
  }

  _cacheUniformLocations() {
    const gl = this.gl;
    this.uniformLocations.clear();
    const numUniforms = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < numUniforms; i++) {
      const info = gl.getActiveUniform(this.program, i);
      if (!info) continue;
      const name = info.name.replace("[0]", ""); // strip array suffix
      const location = gl.getUniformLocation(this.program, name);
      this.uniformLocations.set(name, location);
    }
  }

  resize(width, height) {
    this.gl.viewport(0, 0, width, height);
  }

  setFragmentShader(fragmentSource) {
    const gl = this.gl;
    // fall back to default fragment shader if none is provided
    const src = fragmentSource || defaultFragmentShader;

    const newProgram = this._createProgram(src);
    if (this.program) {
      gl.deleteProgram(this.program);
    }
    this.program = newProgram;
    this._cacheUniformLocations();
  }

  _setUniform(name, value) {
    const gl = this.gl;
    const loc = this.uniformLocations.get(name);
    if (!loc) return;

    if (typeof value === "number") {
      gl.uniform1f(loc, value);
    } else if (Array.isArray(value)) {
      if (value.length === 2) {
        gl.uniform2f(loc, value[0], value[1]);
      } else if (value.length === 3) {
        gl.uniform3f(loc, value[0], value[1], value[2]);
      } else if (value.length === 4) {
        gl.uniform4f(loc, value[0], value[1], value[2], value[3]);
      }
    }
  }

  render(uniforms) {
    const gl = this.gl;
    if (!this.program) return;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.program);

    // Push uniforms
    for (const [name, value] of Object.entries(uniforms)) {
      this._setUniform(name, value);
    }

    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);
  }
}