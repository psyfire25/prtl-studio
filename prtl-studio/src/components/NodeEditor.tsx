import { useState, useCallback } from 'react';

type NodeType = 'source' | 'effect' | 'output';

interface Node {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  inputs?: number;
  outputs?: number;
}

export function NodeEditor() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', type: 'source', label: 'Input', x: 100, y: 200, outputs: 1 },
    { id: '2', type: 'effect', label: 'Effect', x: 350, y: 200, inputs: 1, outputs: 1 },
    { id: '3', type: 'output', label: 'Output', x: 600, y: 200, inputs: 1 },
  ]);

  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    setDraggingNode(nodeId);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggingNode) return;
    
    const containerRect = e.currentTarget.getBoundingClientRect();
    setNodes(prev => prev.map(node => 
      node.id === draggingNode
        ? { ...node, x: e.clientX - containerRect.left - dragOffset.x, y: e.clientY - containerRect.top - dragOffset.y }
        : node
    ));
  }, [draggingNode, dragOffset]);

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  return (
    <div className="h-full bg-black relative">
      <div 
        className="h-full relative overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Connection Lines */}
        <svg className="absolute inset-0 pointer-events-none">
          <defs>
            <linearGradient id="conn1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="conn2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <path
            d={`M ${nodes[0].x + 120} ${nodes[0].y + 25} L ${nodes[1].x} ${nodes[1].y + 25}`}
            stroke="url(#conn1)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d={`M ${nodes[1].x + 120} ${nodes[1].y + 25} L ${nodes[2].x} ${nodes[2].y + 25}`}
            stroke="url(#conn2)"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute cursor-move"
            style={{ left: node.x, top: node.y }}
            onMouseDown={(e) => handleMouseDown(node.id, e)}
          >
            <div className="w-30 bg-white/5 border border-white/10 rounded px-4 py-3 backdrop-blur-sm">
              <div className="text-white/60 text-xs">{node.label}</div>
              
              {/* Ports */}
              <div className="flex items-center justify-between mt-2">
                {node.inputs && (
                  <div className="w-2 h-2 rounded-full bg-white/30 -ml-5" />
                )}
                {node.outputs && (
                  <div className="w-2 h-2 rounded-full bg-white/30 -mr-5 ml-auto" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}