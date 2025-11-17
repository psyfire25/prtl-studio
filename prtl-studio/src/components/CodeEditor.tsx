import { useState } from 'react';

export function CodeEditor() {
  const [code, setCode] = useState(`precision mediump float;

uniform float time;
uniform vec2 resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float d = length(uv - 0.5);
  
  vec3 col = vec3(
    sin(time + d * 10.0),
    sin(time + d * 10.0 + 2.0),
    sin(time + d * 10.0 + 4.0)
  );
  
  gl_FragColor = vec4(col, 1.0);
}`);

  return (
    <div className="h-full flex bg-black">
      {/* Code Editor */}
      <div className="flex-1 flex">
        {/* Line Numbers */}
        <div className="bg-black px-4 py-6 text-white/20 select-none text-right border-r border-white/5 text-xs font-mono">
          {code.split('\n').map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>
        {/* Code */}
        <div className="flex-1">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full bg-black text-white/80 px-6 py-6 outline-none resize-none font-mono text-xs leading-6"
            spellCheck={false}
            style={{ tabSize: 2 }}
          />
        </div>
      </div>

      {/* Minimal Preview */}
      <div className="w-80 bg-black border-l border-white/5 p-6">
        <div className="aspect-video bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}