import React from 'react';

export const DiagramExam39DerivativeGraph: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      <svg
        viewBox="0 0 400 220"
        className="w-full max-w-md h-auto bg-white rounded-xl border border-slate-300 shadow-sm"
        style={{ maxHeight: '210px' }}
      >
        <defs>
          <marker
            id="tikz-arrow-dark"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 L 2.5 5 z" fill="#1e293b" />
          </marker>
        </defs>

        {/* Axes */}
        {/* Ox */}
        <line x1="20" y1="120" x2="380" y2="120" stroke="#1e293b" strokeWidth="1.8" markerEnd="url(#tikz-arrow-dark)" />
        {/* Oy */}
        <line x1="200" y1="205" x2="200" y2="15" stroke="#1e293b" strokeWidth="1.8" markerEnd="url(#tikz-arrow-dark)" />

        {/* Axis Labels */}
        <text x="382" y="138" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#1e293b">x</text>
        <text x="182" y="24" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#1e293b">y</text>
        <text x="182" y="138" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#1e293b">O</text>

        {/* Curve y = f'(x) */}
        {/* Passes through: 
            (110, 120) - root 1
            (155, 190) - min 1
            (200, 120) - root 2 (origin)
            (245, 50)  - max
            (290, 120) - root 3
            (335, 190) - min 2
            (370, 120) - root 4
        */}
        <path
          d="M 80 20
             C 90 20, 100 70, 110 120
             C 120 170, 140 190, 155 190
             C 170 190, 185 150, 200 120
             C 215 90, 230 50, 245 50
             C 260 50, 275 90, 290 120
             C 305 150, 320 190, 335 190
             C 350 190, 360 160, 370 120
             C 375 100, 380 50, 385 20"
          fill="none"
          stroke="#dc2626"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Intersection dots with Ox (Roots of f'(x) = 0) */}
        <circle cx="110" cy="120" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="200" cy="120" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="290" cy="120" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />

        {/* Curve Label */}
        <text x="320" y="55" fontSize="13" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#dc2626">
          y = f'(x)
        </text>

        {/* Sign indicators (- / +) */}
        <text x="80" y="140" fontSize="13" fontWeight="bold" fill="#64748b">-</text>
        <text x="150" y="105" fontSize="13" fontWeight="bold" fill="#2563eb">+</text>
        <text x="245" y="140" fontSize="13" fontWeight="bold" fill="#64748b">-</text>
        <text x="320" y="105" fontSize="13" fontWeight="bold" fill="#2563eb">+</text>
      </svg>
    </div>
  );
};

