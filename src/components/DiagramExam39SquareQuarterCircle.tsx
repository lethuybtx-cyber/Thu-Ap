import React from 'react';

export const DiagramExam39SquareQuarterCircle: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      <svg
        viewBox="0 0 420 230"
        className="w-full max-w-md h-auto bg-white rounded-xl border border-slate-300 shadow-sm"
        style={{ maxHeight: '220px' }}
      >
        {/*
          Square ABCD:
          A = (90, 190)
          B = (310, 190)  (length = 220px representing 100cm)
          C = (310, 30)
          D = (90, 30)

          Quarter circle with center A(90, 190), radius R = 220 * 0.9 = 198px
          M on AB = (90 + 198, 190) = (288, 190)
          N on AD = (90, 190 - 198) = (90, -8) -> on screen (90, 30+22=52)
        */}

        {/* Corroded Quarter Circle Sector Shading */}
        <path
          d="M 90 190 L 288 190 A 198 198 0 0 0 90 -8 Z"
          fill="#cbd5e1"
          opacity="0.4"
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeDasharray="4,3"
        />

        {/* Intact Rectangle PQCR Shading (Yellow) */}
        {/*
          Point P on arc MPN: angle ~ 45deg
          P = (90 + 198*cos(55°), 190 - 198*sin(55°)) = (90 + 113.5, 190 - 162.2) = (203.5, 27.8)
          Let's adjust P to be inside the square:
          P = (210, 70)
          Q on BC = (310, 70)
          R on CD = (210, 30)
          C = (310, 30)
        */}
        <polygon points="210,70 310,70 310,30 210,30" fill="#fef08a" stroke="#eab308" strokeWidth="2" />

        {/* Square ABCD Outline */}
        <rect x="90" y="30" width="220" height="160" fill="none" stroke="#0f172a" strokeWidth="2.5" />

        {/* Arc MPN */}
        <path
          d="M 288 190 A 198 198 0 0 0 90 -8"
          fill="none"
          stroke="#2563eb"
          strokeWidth="2.5"
        />

        {/* Points & Labels */}
        {/* Square Vertices */}
        <circle cx="90" cy="190" r="4" fill="#0f172a" />
        <text x="75" y="202" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">A</text>

        <circle cx="310" cy="190" r="4" fill="#0f172a" />
        <text x="318" y="202" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">B</text>

        <circle cx="310" cy="30" r="4" fill="#0f172a" />
        <text x="318" y="25" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">C</text>

        <circle cx="90" cy="30" r="4" fill="#0f172a" />
        <text x="75" y="25" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">D</text>

        {/* Arc Points M, N, P */}
        <circle cx="288" cy="190" r="4" fill="#2563eb" />
        <text x="285" y="208" fontSize="13" fontWeight="bold" fontFamily="serif" fill="#2563eb">M</text>

        <circle cx="90" cy="42" r="4" fill="#2563eb" />
        <text x="72" y="48" fontSize="13" fontWeight="bold" fontFamily="serif" fill="#2563eb">N</text>

        <circle cx="210" cy="70" r="5" fill="#dc2626" />
        <text x="198" y="85" fontSize="14" fontWeight="bold" fontFamily="serif" fill="#dc2626">P</text>

        <circle cx="310" cy="70" r="4" fill="#eab308" />
        <text x="318" y="75" fontSize="13" fontWeight="bold" fontFamily="serif" fill="#0f172a">Q</text>

        <circle cx="210" cy="30" r="4" fill="#eab308" />
        <text x="208" y="20" fontSize="13" fontWeight="bold" fontFamily="serif" fill="#0f172a">R</text>

        {/* Radius Line AP (90 cm) */}
        <line x1="90" y1="190" x2="210" y2="70" stroke="#2563eb" strokeWidth="1.8" strokeDasharray="4,4" />
        <text x="120" y="125" fontSize="12" fontWeight="bold" fill="#2563eb" fontFamily="serif">90 cm</text>

        {/* Side dimension 100 cm */}
        <text x="180" y="210" fontSize="13" fontWeight="bold" fill="#0f172a" fontFamily="serif">100 cm</text>

        {/* Shading Label */}
        <text x="235" y="52" fontSize="12" fontWeight="bold" fill="#ca8a04" fontFamily="serif">PQCR (Max S)</text>
      </svg>
    </div>
  );
};
