import React from 'react';

export const DiagramPyramidSABCD: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      <svg
        viewBox="0 0 420 230"
        className="w-full max-w-md h-auto bg-white rounded-xl border border-slate-300 shadow-sm"
        style={{ maxHeight: '220px' }}
      >
        {/*
          Pyramid S.ABCD
          A = (120, 160)
          B = (220, 200)
          C = (350, 200)
          D = (250, 160)
          S = (120, 30) (Vertical above A since SA perpendicular to ABCD)
        */}

        {/* Base ABCD Shading */}
        <polygon points="120,160 220,200 350,200 250,160" fill="#f8fafc" stroke="#e2e8f0" opacity="0.8" />

        {/* Hidden / Dashed Lines */}
        {/* AD back base edge */}
        <line x1="120" y1="160" x2="250" y2="160" stroke="#475569" strokeWidth="1.8" strokeDasharray="4,4" />
        {/* CD back right base edge */}
        <line x1="350" y1="200" x2="250" y2="160" stroke="#475569" strokeWidth="1.8" strokeDasharray="4,4" />
        {/* SA height line (perpendicular to base) */}
        <line x1="120" y1="30" x2="120" y2="160" stroke="#dc2626" strokeWidth="2.2" strokeDasharray="4,4" />

        {/* Solid Lines */}
        {/* Base edges: AB, BC */}
        <line x1="120" y1="160" x2="220" y2="200" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="220" y1="200" x2="350" y2="200" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />

        {/* Slanted edges: SB, SC, SD */}
        <line x1="120" y1="30" x2="220" y2="200" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="120" y1="30" x2="350" y2="200" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="120" y1="30" x2="250" y2="160" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />

        {/* Right Angle Symbol at A (SA perp AD & SA perp AB) */}
        <path d="M 120 148 L 132 148 L 132 160" fill="none" stroke="#dc2626" strokeWidth="1.2" />
        <path d="M 120 148 L 128 152 L 128 160" fill="none" stroke="#dc2626" strokeWidth="1.2" />

        {/* Arc for Angle SDA (60 deg) */}
        <path d="M 220 160 A 30 30 0 0 0 225 142" fill="none" stroke="#0284c7" strokeWidth="2" />
        <text x="200" y="148" fontSize="12" fontWeight="bold" fill="#0284c7" fontFamily="serif">60°</text>

        {/* Height label SA */}
        <text x="92" y="95" fontSize="13" fontWeight="bold" fill="#dc2626" fontFamily="serif">
          <tspan fontStyle="italic">a</tspan>√3
        </text>
        <text x="180" y="175" fontSize="12" fontWeight="bold" fill="#0f172a" fontFamily="serif">
          <tspan fontStyle="italic">a</tspan>
        </text>

        {/* Vertices */}
        <circle cx="120" cy="30" r="3.5" fill="#0f172a" />
        <circle cx="120" cy="160" r="3.5" fill="#dc2626" />
        <circle cx="220" cy="200" r="3.5" fill="#0f172a" />
        <circle cx="350" cy="200" r="3.5" fill="#0f172a" />
        <circle cx="250" cy="160" r="3.5" fill="#0f172a" />

        {/* Vertex Labels */}
        <text x="115" y="20" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">S</text>
        <text x="100" y="170" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#dc2626">A</text>
        <text x="215" y="218" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">B</text>
        <text x="360" y="208" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">C</text>
        <text x="260" y="165" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">D</text>
      </svg>
    </div>
  );
};

export const DiagramPyramidSABC: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      <svg
        viewBox="0 0 420 230"
        className="w-full max-w-md h-auto bg-white rounded-xl border border-slate-300 shadow-sm"
        style={{ maxHeight: '220px' }}
      >
        {/*
          S.ABC pyramid with M midpoint SA, N midpoint SB
          S = (210, 30)
          A = (100, 190)
          B = (220, 220)
          C = (340, 180)
          M = midpoint(SA) = (155, 110)
          N = midpoint(SB) = (215, 125)
        */}

        {/* Shaded plane MNC */}
        <polygon points="155,110 215,125 340,180" fill="#fef08a" opacity="0.6" stroke="#eab308" strokeWidth="1.5" />

        {/* Hidden back line AC */}
        <line x1="100" y1="190" x2="340" y2="180" stroke="#475569" strokeWidth="1.8" strokeDasharray="4,4" />

        {/* Base lines AB, BC */}
        <line x1="100" y1="190" x2="220" y2="220" stroke="#0f172a" strokeWidth="2.2" />
        <line x1="220" y1="220" x2="340" y2="180" stroke="#0f172a" strokeWidth="2.2" />

        {/* Slanted edges SA, SB, SC */}
        <line x1="210" y1="30" x2="100" y2="190" stroke="#0f172a" strokeWidth="2.2" />
        <line x1="210" y1="30" x2="220" y2="220" stroke="#0f172a" strokeWidth="2.2" />
        <line x1="210" y1="30" x2="340" y2="180" stroke="#0f172a" strokeWidth="2.2" />

        {/* Midpoint line MN */}
        <line x1="155" y1="110" x2="215" y2="125" stroke="#2563eb" strokeWidth="2" />
        <line x1="155" y1="110" x2="340" y2="180" stroke="#2563eb" strokeWidth="1.8" />

        {/* Midpoint markers */}
        <circle cx="155" cy="110" r="4" fill="#2563eb" />
        <circle cx="215" cy="125" r="4" fill="#2563eb" />

        <text x="135" y="110" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#2563eb">M</text>
        <text x="225" y="128" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#2563eb">N</text>

        {/* Vertices */}
        <circle cx="210" cy="30" r="3.5" fill="#0f172a" />
        <circle cx="100" cy="190" r="3.5" fill="#0f172a" />
        <circle cx="220" cy="220" r="3.5" fill="#0f172a" />
        <circle cx="340" cy="180" r="3.5" fill="#0f172a" />

        {/* Labels */}
        <text x="205" y="20" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">S</text>
        <text x="82" y="195" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">A</text>
        <text x="215" y="238" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">B</text>
        <text x="350" y="185" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">C</text>

        {/* Volume note */}
        <text x="30" y="40" fontSize="11" fontWeight="bold" fill="#0284c7" fontFamily="serif">
          V<tspan dy="3" fontSize="8.5">S.ABC</tspan><tspan dy="-3"> = 36</tspan>
        </text>
        <text x="30" y="56" fontSize="11" fontWeight="bold" fill="#2563eb" fontFamily="serif">
          V<tspan dy="3" fontSize="8.5">S.MNC</tspan><tspan dy="-3"> = 9</tspan>
        </text>
      </svg>
    </div>
  );
};
