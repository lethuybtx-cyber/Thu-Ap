import React from 'react';

export const DiagramExam39StandModel: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      <svg
        viewBox="0 0 460 240"
        className="w-full max-w-md h-auto bg-white rounded-xl border border-slate-300 shadow-sm"
        style={{ maxHeight: '230px' }}
      >
        <defs>
          <marker id="tikz-arrow-axis2" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 9 5 L 0 8.5 L 2.5 5 z" fill="#0f172a" />
          </marker>
        </defs>

        {/* Axes Oxyz */}
        {/* Origin O = (180, 180) */}
        {/* Ox direction (down-left) */}
        <line x1="180" y1="180" x2="80" y2="220" stroke="#0f172a" strokeWidth="1.8" markerEnd="url(#tikz-arrow-axis2)" />
        {/* Oy direction (right) */}
        <line x1="180" y1="180" x2="380" y2="180" stroke="#0f172a" strokeWidth="1.8" markerEnd="url(#tikz-arrow-axis2)" />
        {/* Oz direction (up) */}
        <line x1="180" y1="180" x2="180" y2="20" stroke="#0f172a" strokeWidth="1.8" markerEnd="url(#tikz-arrow-axis2)" />

        <text x="70" y="228" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">x</text>
        <text x="390" y="184" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">y</text>
        <text x="176" y="15" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">z</text>
        <text x="165" y="195" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">O</text>

        {/* Points:
          A(1,0,0) = (130, 200)
          C(0,2,0) = (320, 180)
          B(1,2,0) = (270, 200)
          E(0,0,0.5) = (180, 120)
          D(0,2,0.5) = (320, 120)
        */}

        {/* Shaded Roof plane ABDE */}
        <polygon points="130,200 270,200 320,120 180,120" fill="#fef08a" opacity="0.6" stroke="#eab308" strokeWidth="2" />

        {/* Stand Prism Structure */}
        <line x1="180" y1="180" x2="130" y2="200" stroke="#0f172a" strokeWidth="2" strokeDasharray="4,4" />
        <line x1="180" y1="180" x2="320" y2="180" stroke="#0f172a" strokeWidth="2" strokeDasharray="4,4" />
        <line x1="180" y1="180" x2="180" y2="120" stroke="#0f172a" strokeWidth="2" strokeDasharray="4,4" />

        {/* Front Edges */}
        <line x1="130" y1="200" x2="270" y2="200" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="270" y1="200" x2="320" y2="180" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="320" y1="180" x2="320" y2="120" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="320" y1="120" x2="180" y2="120" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="180" y1="120" x2="130" y2="200" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="270" y1="200" x2="320" y2="120" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />

        {/* Screen on right (12x + 5y = d) */}
        <polygon points="350,70 410,70 410,190 350,190" fill="#38bdf8" opacity="0.4" stroke="#0284c7" strokeWidth="1.8" />
        <text x="360" y="130" fontSize="11" fontWeight="bold" fill="#0369a1" fontFamily="serif">Màn hình</text>

        {/* Dimension text */}
        <text x="200" y="215" fontSize="11" fontWeight="bold" fill="#2563eb">2 m</text>
        <text x="240" y="115" fontSize="11" fontWeight="bold" fill="#2563eb">1 m</text>
        <text x="185" y="150" fontSize="11" fontWeight="bold" fill="#dc2626">0.5 m</text>

        {/* Vertex Dots & Labels */}
        <circle cx="130" cy="200" r="3.5" fill="#0f172a" />
        <text x="120" y="215" fontSize="13" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">A</text>

        <circle cx="270" cy="200" r="3.5" fill="#0f172a" />
        <text x="275" y="215" fontSize="13" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">B</text>

        <circle cx="320" cy="180" r="3.5" fill="#0f172a" />
        <text x="328" y="190" fontSize="13" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">C</text>

        <circle cx="320" cy="120" r="3.5" fill="#0f172a" />
        <text x="328" y="115" fontSize="13" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">D</text>

        <circle cx="180" cy="120" r="3.5" fill="#0f172a" />
        <text x="168" y="115" fontSize="13" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">E</text>

        {/* Point M meeting light ray */}
        <circle cx="225" cy="160" r="4.5" fill="#dc2626" />
        <text x="232" y="160" fontSize="13" fontWeight="bold" fontFamily="serif" fill="#dc2626">M</text>
      </svg>
    </div>
  );
};
