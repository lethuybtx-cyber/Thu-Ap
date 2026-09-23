import React from 'react';

export const DiagramExam39VariationTable: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-2 overflow-x-auto">
      <div className="min-w-[400px] border border-slate-800 bg-white text-slate-900 font-serif text-sm">
        {/* Row 1: x */}
        <div className="flex border-b border-slate-800">
          <div className="w-12 flex items-center justify-center border-r border-slate-800 font-italic italic">x</div>
          <div className="flex-1 flex justify-between px-4 py-2">
            <span>−∞</span>
            <span>-3</span>
            <span>0</span>
            <span>3</span>
            <span>+∞</span>
          </div>
        </div>
        
        {/* Row 2: y' */}
        <div className="flex border-b border-slate-800">
          <div className="w-12 flex items-center justify-center border-r border-slate-800 font-italic italic">y'</div>
          <div className="flex-1 flex justify-between px-4 py-2 items-center relative">
            <span className="w-1/4 text-center">-</span>
            <span className="text-center">0</span>
            <span className="w-1/4 text-center">+</span>
            <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-r-2 border-slate-800 w-1 -translate-x-1/2" />
            <span className="w-1/4 text-center">+</span>
            <span className="text-center">0</span>
            <span className="w-1/4 text-center">-</span>
          </div>
        </div>

        {/* Row 3: y */}
        <div className="flex h-24 relative">
          <div className="w-12 flex items-center justify-center border-r border-slate-800 font-italic italic">y</div>
          <div className="flex-1 relative">
            {/* Double line at x=0 */}
            <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-r-2 border-slate-800 w-1 -translate-x-1/2" />
            
            {/* Values */}
            <div className="absolute top-1 left-4">+∞</div>
            <div className="absolute bottom-1" style={{ left: '25%', transform: 'translateX(-50%)' }}>-1</div>
            <div className="absolute top-1 right-[52%]">2</div>
            
            <div className="absolute bottom-1 left-[52%]">−∞</div>
            <div className="absolute top-1" style={{ right: '25%', transform: 'translateX(50%)' }}>2</div>
            <div className="absolute bottom-1 right-4">−∞</div>

            {/* Arrows */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 9 5 L 0 8.5 L 2.5 5 z" fill="currentColor" />
                </marker>
              </defs>
              <line x1="10%" y1="20%" x2="22%" y2="80%" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow)" />
              <line x1="28%" y1="80%" x2="45%" y2="20%" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow)" />
              
              <line x1="55%" y1="80%" x2="72%" y2="20%" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow)" />
              <line x1="78%" y1="20%" x2="90%" y2="80%" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow)" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
