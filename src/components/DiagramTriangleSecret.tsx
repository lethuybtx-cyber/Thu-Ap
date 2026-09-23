import React from 'react';

export const DiagramTriangleSecret: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      <svg
        viewBox="0 0 420 230"
        className="w-full max-w-md h-auto bg-white rounded-xl border border-slate-300 shadow-sm"
        style={{ maxHeight: '220px' }}
      >
        {/*
          Triangle A(210, 35), B(80, 190), C(340, 190)
          M = midpoint(AB) = (145, 112.5)
          N = midpoint(BC) = (210, 190)
          P = midpoint(CA) = (275, 112.5)
        */}

        {/* Shaded inner medial triangle MNP */}
        <polygon points="145,112.5 210,190 275,112.5" fill="#fef08a" opacity="0.6" stroke="#eab308" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Outer Triangle Edges */}
        <line x1="210" y1="35" x2="80" y2="190" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="80" y1="190" x2="340" y2="190" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="340" y1="190" x2="210" y2="35" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

        {/* Vertices & Midpoint Nodes (TikZ Node style) */}
        {/* Node A */}
        <circle cx="210" cy="35" r="16" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
        <text x="210" y="40" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" textAnchor="middle" fill="#0f172a">
          A
        </text>

        {/* Node B */}
        <circle cx="80" cy="190" r="16" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
        <text x="80" y="195" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" textAnchor="middle" fill="#0f172a">
          B
        </text>

        {/* Node C */}
        <circle cx="340" cy="190" r="16" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
        <text x="340" y="195" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" textAnchor="middle" fill="#0f172a">
          C
        </text>

        {/* Midpoint M */}
        <circle cx="145" cy="112.5" r="14" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
        <text x="145" y="117.5" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" textAnchor="middle" fill="#0f172a">
          M
        </text>

        {/* Midpoint N */}
        <circle cx="210" cy="190" r="14" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
        <text x="210" y="195" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" textAnchor="middle" fill="#0f172a">
          N
        </text>

        {/* Midpoint P */}
        <circle cx="275" cy="112.5" r="14" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
        <text x="275" y="117.5" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" textAnchor="middle" fill="#0f172a">
          P
        </text>

        {/* Side Progression Arrows or Labels */}
        <text x="110" y="70" fontSize="11" fontWeight="bold" fill="#0284c7" fontFamily="serif">
          (A, M, B) AP
        </text>
        <text x="210" y="218" fontSize="11" fontWeight="bold" fill="#0284c7" fontFamily="serif" textAnchor="middle">
          (B, N, C) AP
        </text>
        <text x="310" y="70" fontSize="11" fontWeight="bold" fill="#0284c7" fontFamily="serif" textAnchor="middle">
          (C, P, A) AP
        </text>
      </svg>
    </div>
  );
};
