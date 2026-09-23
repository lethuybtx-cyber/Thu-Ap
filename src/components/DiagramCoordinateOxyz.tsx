import React from 'react';

export const DiagramCoordinateOxyz: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      <svg
        viewBox="0 0 420 230"
        className="w-full max-w-md h-auto bg-white rounded-xl border border-slate-300 shadow-sm"
        style={{ maxHeight: '220px' }}
      >
        <defs>
          <marker id="tikz-arrow-axis" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 9 5 L 0 8.5 L 2.5 5 z" fill="#0f172a" />
          </marker>
        </defs>

        {/* Oxy plane shadow grid */}
        <polygon points="180,150 100,195 280,195 360,150" fill="#f1f5f9" opacity="0.6" stroke="#e2e8f0" strokeDasharray="3,3" />

        {/* Oxyz Coordinate Axes */}
        {/* x-axis: O(180, 150) -> (90, 200) */}
        <line x1="180" y1="150" x2="80" y2="205" stroke="#0f172a" strokeWidth="2" markerEnd="url(#tikz-arrow-axis)" />
        {/* y-axis: O(180, 150) -> (370, 150) */}
        <line x1="180" y1="150" x2="380" y2="150" stroke="#0f172a" strokeWidth="2" markerEnd="url(#tikz-arrow-axis)" />
        {/* z-axis: O(180, 150) -> (180, 15) */}
        <line x1="180" y1="150" x2="180" y2="15" stroke="#0f172a" strokeWidth="2" markerEnd="url(#tikz-arrow-axis)" />

        {/* Axis Labels */}
        <text x="165" y="168" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">O</text>
        <text x="65" y="212" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">x</text>
        <text x="390" y="155" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">y</text>
        <text x="176" y="12" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">z</text>

        {/* Coordinates ticks */}
        <line x1="140" y1="172.5" x2="140" y2="172.5" stroke="#0f172a" strokeWidth="3" />
        <text x="125" y="168" fontSize="11" fontFamily="serif" fill="#0f172a"><tspan fontStyle="italic">x</tspan>=2</text>

        <text x="260" y="165" fontSize="11" fontFamily="serif" fill="#0f172a"><tspan fontStyle="italic">y</tspan>=3</text>
        <text x="155" y="65" fontSize="11" fontFamily="serif" fill="#0f172a"><tspan fontStyle="italic">z</tspan>=4</text>

        {/* Projection Box Lines */}
        {/* O -> Mx on x-axis */}
        <line x1="180" y1="150" x2="130" y2="178" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4,3" />
        {/* O -> My on y-axis */}
        <line x1="180" y1="150" x2="270" y2="150" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4,3" />
        {/* Mx -> M' on Oxy */}
        <line x1="130" y1="178" x2="220" y2="178" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4,3" />
        {/* My -> M' on Oxy */}
        <line x1="270" y1="150" x2="220" y2="178" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Projection M'(2, 3, 0) */}
        <circle cx="220" cy="178" r="4" fill="#0284c7" />
        <text x="228" y="192" fontSize="13" fontWeight="bold" fontFamily="serif" fill="#0284c7">M'(2; 3; 0)</text>

        {/* Vertical line M' -> M */}
        <line x1="220" y1="178" x2="220" y2="65" stroke="#dc2626" strokeWidth="2" strokeDasharray="4,3" />
        <line x1="180" y1="65" x2="220" y2="65" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Point M(2, 3, 4) */}
        <circle cx="220" cy="65" r="5" fill="#dc2626" />
        <text x="230" y="62" fontSize="14" fontWeight="bold" fontFamily="serif" fill="#dc2626">M(2; 3; 4)</text>

        {/* Right angle sign at M' */}
        <path d="M 220 170 L 212 170 L 212 178" fill="none" stroke="#0284c7" strokeWidth="1" />
      </svg>
    </div>
  );
};

export const DiagramFunctionGraph: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      <svg
        viewBox="0 0 420 220"
        className="w-full max-w-md h-auto bg-white rounded-xl border border-slate-300 shadow-sm"
        style={{ maxHeight: '210px' }}
      >
        <defs>
          <marker id="tikz-arrow-g" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 9 5 L 0 8.5 L 2.5 5 z" fill="#334155" />
          </marker>
        </defs>

        {/* Grid lines (TikZ grid) */}
        <line x1="40" y1="50" x2="380" y2="50" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="40" y1="110" x2="380" y2="110" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="40" y1="170" x2="380" y2="170" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="130" y1="20" x2="130" y2="200" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="280" y1="20" x2="280" y2="200" stroke="#f1f5f9" strokeWidth="1" />

        {/* Coordinate Axes */}
        <line x1="30" y1="110" x2="390" y2="110" stroke="#334155" strokeWidth="1.8" markerEnd="url(#tikz-arrow-g)" />
        <line x1="210" y1="205" x2="210" y2="15" stroke="#334155" strokeWidth="1.8" markerEnd="url(#tikz-arrow-g)" />

        <text x="395" y="114" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#334155">x</text>
        <text x="215" y="14" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#334155">y</text>
        <text x="196" y="125" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#334155">O</text>

        {/* Smooth Cubic Curve */}
        {/* Local Max at (-1, 2) -> (130, 50), Local Min at (1, -2) -> (290, 170) */}
        <path
          d="M 60 195 C 90 20, 100 50, 130 50 C 170 50, 180 170, 290 170 C 330 170, 340 30, 360 15"
          fill="none"
          stroke="#2563eb"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Dashed projections for Local Maximum */}
        <line x1="130" y1="110" x2="130" y2="50" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3,3" />
        <line x1="210" y1="50" x2="130" y2="50" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3,3" />
        <circle cx="130" cy="50" r="4.5" fill="#2563eb" />
        <circle cx="130" cy="110" r="2.5" fill="#334155" />
        <circle cx="210" cy="50" r="2.5" fill="#334155" />

        <text x="118" y="128" fontSize="13" fontWeight="bold" fontFamily="serif" fill="#334155">-1</text>
        <text x="218" y="54" fontSize="13" fontWeight="bold" fontFamily="serif" fill="#dc2626">
          y<tspan dy="3" fontSize="10">CĐ</tspan><tspan dy="-3"> = 2</tspan>
        </text>

        {/* Dashed projections for Local Minimum */}
        <line x1="290" y1="110" x2="290" y2="170" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,3" />
        <line x1="210" y1="170" x2="290" y2="170" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,3" />
        <circle cx="290" cy="170" r="4.5" fill="#2563eb" />

        <text x="286" y="100" fontSize="13" fontWeight="bold" fontFamily="serif" fill="#334155">1</text>
        <text x="190" y="175" fontSize="13" fontWeight="bold" fontFamily="serif" fill="#334155">-2</text>
      </svg>
    </div>
  );
};
