import React from 'react';

export const DiagramPrism: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      <svg
        viewBox="0 0 460 250"
        className="w-full max-w-md h-auto bg-white rounded-xl border border-slate-300 shadow-sm"
        style={{ maxHeight: '240px' }}
      >
        <defs>
          {/* TikZ style arrow marker */}
          <marker
            id="tikz-arrow-blue"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 L 2.5 5 z" fill="#2563eb" />
          </marker>
          <marker
            id="tikz-arrow-red"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 L 2.5 5 z" fill="#dc2626" />
          </marker>
        </defs>

        {/* Top & Bottom Face Fills (TikZ opacity fill) */}
        <polygon points="180,45 240,85 340,45" fill="#f1f5f9" opacity="0.6" />
        <polygon points="140,185 200,225 300,185" fill="#f8fafc" opacity="0.4" />

        {/* Hidden / Back dashed lines (TikZ dash pattern) */}
        {/* A'C' top back edge */}
        <line x1="180" y1="45" x2="340" y2="45" stroke="#475569" strokeWidth="1.8" strokeDasharray="4,4" />
        {/* AC bottom back edge */}
        <line x1="140" y1="185" x2="300" y2="185" stroke="#475569" strokeWidth="1.8" strokeDasharray="4,4" />
        {/* AA' back lateral edge */}
        <line x1="180" y1="45" x2="140" y2="185" stroke="#475569" strokeWidth="1.8" strokeDasharray="4,4" />

        {/* Solid Visible Edges */}
        {/* Top base: A'B', B'C' */}
        <line x1="180" y1="45" x2="240" y2="85" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="240" y1="85" x2="340" y2="45" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />

        {/* Bottom base: AB, BC */}
        <line x1="140" y1="185" x2="200" y2="225" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="200" y1="225" x2="300" y2="185" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />

        {/* Lateral Edges: BB', CC' */}
        <line x1="240" y1="85" x2="200" y2="225" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="340" y1="45" x2="300" y2="185" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />

        {/* Vector BA (blue) */}
        <line
          x1="200"
          y1="225"
          x2="140"
          y2="185"
          stroke="#2563eb"
          strokeWidth="2.5"
          markerEnd="url(#tikz-arrow-blue)"
        />

        {/* Vector A'C' (blue) */}
        <line
          x1="180"
          y1="45"
          x2="340"
          y2="45"
          stroke="#2563eb"
          strokeWidth="2.5"
          strokeDasharray="5,4"
          markerEnd="url(#tikz-arrow-blue)"
        />

        {/* Vector B'C' (red highlight vector) */}
        <line
          x1="240"
          y1="85"
          x2="340"
          y2="45"
          stroke="#dc2626"
          strokeWidth="2.5"
          markerEnd="url(#tikz-arrow-red)"
        />

        {/* Vertex Points (TikZ dot style) */}
        <circle cx="180" cy="45" r="3.5" fill="#0f172a" />
        <circle cx="240" cy="85" r="3.5" fill="#0f172a" />
        <circle cx="340" cy="45" r="3.5" fill="#0f172a" />
        <circle cx="140" cy="185" r="3.5" fill="#0f172a" />
        <circle cx="200" cy="225" r="3.5" fill="#0f172a" />
        <circle cx="300" cy="185" r="3.5" fill="#0f172a" />

        {/* LaTeX Math Vertex Labels */}
        <text x="168" y="38" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">
          A'
        </text>
        <text x="246" y="98" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">
          B'
        </text>
        <text x="348" y="48" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">
          C'
        </text>

        <text x="122" y="192" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">
          A
        </text>
        <text x="195" y="242" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">
          B
        </text>
        <text x="308" y="192" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">
          C
        </text>

        {/* Vector Legend / TikZ caption */}
        <text x="30" y="30" fontSize="11" fontWeight="bold" fill="#2563eb" fontFamily="serif">
          <tspan fontStyle="italic">BA</tspan> &amp; <tspan fontStyle="italic">A'C'</tspan>
        </text>
        {/* Draw vector arrows manually above the text since tspan overline doesn't look like arrows */}
        <path d="M 30 20 L 44 20 L 41 17 M 44 20 L 41 23" fill="none" stroke="#2563eb" strokeWidth="1" />
        <path d="M 58 20 L 76 20 L 73 17 M 76 20 L 73 23" fill="none" stroke="#2563eb" strokeWidth="1" />

        <text x="30" y="46" fontSize="11" fontWeight="bold" fill="#dc2626" fontFamily="serif">
          <tspan fontStyle="italic">B'C'</tspan> (Tổng)
        </text>
        <path d="M 30 36 L 48 36 L 45 33 M 48 36 L 45 39" fill="none" stroke="#dc2626" strokeWidth="1" />
      </svg>
    </div>
  );
};
