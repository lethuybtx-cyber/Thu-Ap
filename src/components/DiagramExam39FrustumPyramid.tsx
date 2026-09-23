import React from 'react';

export const DiagramExam39FrustumPyramid: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      <svg
        viewBox="0 0 420 230"
        className="w-full max-w-md h-auto bg-white rounded-xl border border-slate-300 shadow-sm"
        style={{ maxHeight: '220px' }}
      >
        {/*
          Truncated triangular pyramid:
          Bottom base ABC (larger triangle):
          A = (100, 190)
          B = (220, 220)
          C = (340, 190)

          Top base MNP (smaller triangle, parallel to ABC):
          M = (150, 70)
          N = (220, 85)
          P = (300, 70)

          Centroid G of MNP = ((150+220+300)/3, (70+85+70)/3) = (223.3, 75)
        */}

        {/* Base Fills */}
        <polygon points="150,70 220,85 300,70" fill="#e0f2fe" opacity="0.6" stroke="#0284c7" strokeWidth="1.8" />
        <polygon points="100,190 220,220 340,190" fill="#f1f5f9" opacity="0.4" />

        {/* Back Hidden Edge AC */}
        <line x1="100" y1="190" x2="340" y2="190" stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="4,4" />
        {/* Back Hidden Lateral Edge AM */}
        <line x1="100" y1="190" x2="150" y2="70" stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="4,4" />

        {/* Solid Visible Edges */}
        {/* Bottom base AB, BC */}
        <line x1="100" y1="190" x2="220" y2="220" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="220" y1="220" x2="340" y2="190" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />

        {/* Top base MN, NP, PM */}
        <line x1="150" y1="70" x2="220" y2="85" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        <line x1="220" y1="85" x2="300" y2="70" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        <line x1="300" y1="70" x2="150" y2="70" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />

        {/* Lateral Edges BN, CP */}
        <line x1="220" y1="220" x2="220" y2="85" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="340" y1="190" x2="300" y2="70" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />

        {/* Centroid G of MNP */}
        <circle cx="223.3" cy="75" r="4.5" fill="#dc2626" />
        <text x="223" y="62" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#dc2626">G</text>

        {/* Line AG (red) */}
        <line x1="100" y1="190" x2="223.3" y2="75" stroke="#dc2626" strokeWidth="2" strokeDasharray="4,3" />

        {/* Line BC (highlighted in blue) */}
        <line x1="220" y1="220" x2="340" y2="190" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />

        {/* Vertices & Labels */}
        <circle cx="100" cy="190" r="3.5" fill="#0f172a" />
        <text x="82" y="195" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">A</text>

        <circle cx="220" cy="220" r="3.5" fill="#0f172a" />
        <text x="215" y="238" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#2563eb">B</text>

        <circle cx="340" cy="190" r="3.5" fill="#0f172a" />
        <text x="350" y="195" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#2563eb">C</text>

        <circle cx="150" cy="70" r="3.5" fill="#0f172a" />
        <text x="135" y="68" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">M</text>

        <circle cx="220" cy="85" r="3.5" fill="#0f172a" />
        <text x="225" y="98" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">N</text>

        <circle cx="300" cy="70" r="3.5" fill="#0f172a" />
        <text x="310" y="68" fontSize="15" fontWeight="bold" fontFamily="serif" fontStyle="italic" fill="#0f172a">P</text>

        {/* Height label */}
        <line x1="70" y1="70" x2="70" y2="190" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3" />
        <text x="35" y="135" fontSize="12" fontWeight="bold" fill="#64748b" fontFamily="serif">h = 8</text>
        <text x="280" y="222" fontSize="12" fontWeight="bold" fill="#2563eb" fontFamily="serif">cạnh = 6</text>
      </svg>
    </div>
  );
};
