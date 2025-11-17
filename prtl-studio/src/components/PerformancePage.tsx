import { useState } from 'react';
import { Slider } from './ui/slider';

export function PerformancePage() {
  const [brightness, setBrightness] = useState([75]);
  const [saturation, setSaturation] = useState([60]);
  const [speed, setSpeed] = useState([50]);

  return (
    <div className="h-full flex">
      {/* Main Canvas */}
      <div className="flex-1 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 relative">
        {/* Minimal animated visual */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 animate-spin-slow">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
            </div>
            <div className="absolute inset-0 animate-spin-reverse">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Controls */}
      <div className="w-64 bg-black border-l border-white/5 p-6 space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-white/40 text-xs">Brightness</div>
            <Slider value={brightness} onValueChange={setBrightness} max={100} step={1} />
          </div>
          <div className="space-y-2">
            <div className="text-white/40 text-xs">Saturation</div>
            <Slider value={saturation} onValueChange={setSaturation} max={100} step={1} />
          </div>
          <div className="space-y-2">
            <div className="text-white/40 text-xs">Speed</div>
            <Slider value={speed} onValueChange={setSpeed} max={100} step={1} />
          </div>
        </div>
      </div>
    </div>
  );
}