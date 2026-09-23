import React from 'react';

export const DiagramExam39CubePyramid: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      <svg
        viewBox="0 0 420 230"
        className="w-full max-w-md h-auto bg-white rounded-xl border border-slate-300 shadow-sm"
        style={{ maxHeight: '220px' }}
      >
        {/*
          Isometric 3D Cube coordinates:
          Bottom face (Square base of pyramid):
          A_bottom_left = (120, 200)
          B_bottom_right = (260, 200)
          C_top_right = (330, 150)
          D_top_left = (190, 150)

          Top face of cube:
          A' = (120, 80)
          B' = (260, 80)
          C' = (330, 30)
          D' = (190, 30)

          Apex S (Center of top face A'B'C'D'):
          Center = ((120+260+330+190)/4, (80+80+30+30)/4) = (225, 55)
        */}

        {/* Cube Back Hidden Edges (dashed) */}
        <line x1="190" y1="150" x2="120" y2="200" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" />
        <line x1="190" y1="150" x2="330" y2="150" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" />
        <line x1="190" y1="150" x2="190" y2="30" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" />

        {/* Cube Solid Edges */}
        {/* Bottom base visible edges */}
        <line x1="120" y1="200" x2="260" y2="200" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        <line x1="260" y1="200" x2="330" y2="150" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />

        {/* Top base edges */}
        <line x1="120" y1="80" x2="260" y2="80" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        <line x1="260" y1="80" x2="330" y2="30" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        <line x1="330" y1="30" x2="190" y2="30" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        <line x1="190" y1="30" x2="120" y2="80" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />

        {/* Vertical front edges */}
        <line x1="120" y1="200" x2="120" y2="80" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        <line x1="260" y1="200" x2="260" y2="80" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        <line x1="330" y1="150" x2="330" y2="30" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />

        {/* Pyramid Shading (Transparent blue fill) */}
        <polygon points="225,55 120,200 260,200" fill="#38bdf8" opacity="0.25" />
        <polygon points="225,55 260,200 330,150" fill="#0284c7" opacity="0.2" />

        {/* Pyramid Edges from Apex S(225, 55) to base vertices */}
        <line x1="225" y1="55" x2="120" y2="200" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
        <line x1="225" y1="55" x2="260" y2="200" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
        <line x1="225" y1="55" x2="330" y2="150" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
        <line x1="225" y1="55" x2="190" y2="150" stroke="#2563eb" strokeWidth="2" strokeDasharray="4,4" />

        {/* Height line SO from S to center of bottom base (225, 175) */}
        <line x1="225" y1="55" x2="225" y2="175" stroke="#dc2626" strokeWidth="1.8" strokeDasharray="4,4" />
        <circle cx="225" cy="175" r="3" fill="#dc2626" />

        {/* Apex Point S */}
        <circle cx="225" cy="55" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />

        {/* Labels */}
        <text x="225" y="42" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" textAnchor="middle" fill="#2563eb">
          S (Tâm)
        </text>
        <text x="235" y="180" fontSize="12" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#dc2626">
          O
        </text>
        <text x="50" y="140" fontSize="13" fontWeight="bold" fontFamily="serif" fill="#0f172a">
          Cạnh = 30cm = 3dm
        </text>
      </svg>
    </div>
  );
};
