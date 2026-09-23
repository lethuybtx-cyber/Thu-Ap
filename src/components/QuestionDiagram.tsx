import React, { useState, useEffect } from 'react';
import { DiagramPrism } from './DiagramPrism';
import { DiagramTriangleSecret } from './DiagramTriangleSecret';
import { DiagramCoordinateOxyz, DiagramFunctionGraph } from './DiagramCoordinateOxyz';
import { DiagramPyramidSABCD, DiagramPyramidSABC } from './DiagramPyramidSABCD';
import { DiagramExam39DerivativeGraph } from './DiagramExam39DerivativeGraph';
import { DiagramExam39CubePyramid } from './DiagramExam39CubePyramid';
import { DiagramExam39StandModel } from './DiagramExam39StandModel';
import { DiagramExam39SquareQuarterCircle } from './DiagramExam39SquareQuarterCircle';
import { DiagramExam39FrustumPyramid } from './DiagramExam39FrustumPyramid';
import { DiagramExam39VariationTable } from './DiagramExam39VariationTable';

interface QuestionDiagramProps {
  type?: string;
  imageUrl?: string;
}

export const QuestionDiagram: React.FC<QuestionDiagramProps> = ({ type, imageUrl }) => {
  const [imageError, setImageError] = useState(false);

  // Determine if valid image source exists
  let validSrc: string | null = null;
  const candidate = imageUrl || type;

  if (candidate) {
    const trimmed = candidate.trim();
    if (
      trimmed.startsWith('data:image/') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('blob:')
    ) {
      validSrc = trimmed;
    }
  }

  // Reset error state when src changes
  useEffect(() => {
    setImageError(false);
  }, [validSrc, type, imageUrl]);

  if (validSrc && !imageError) {
    return (
      <div className="w-full bg-[#f8fafc] p-1.5 sm:p-2 rounded-xl border border-slate-300 shadow flex justify-center items-center overflow-x-auto max-h-[240px] sm:max-h-[340px]">
        <img
          src={validSrc}
          alt="Hình minh họa"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="max-w-full max-h-[220px] sm:max-h-[320px] object-contain rounded-lg mx-auto"
        />
      </div>
    );
  }

  if (!type) return null;

  // Check if type is an inline raw SVG string
  if (type.trim().startsWith('<svg') && type.trim().endsWith('</svg>')) {
    return (
      <div className="w-full bg-[#f8fafc] p-1.5 sm:p-2 rounded-xl border border-slate-300 shadow flex justify-center items-center overflow-x-auto max-h-[240px] sm:max-h-[340px]">
        <div
          className="max-w-full overflow-x-auto text-slate-900 flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: type }}
        />
      </div>
    );
  }

  const normalized = type.toUpperCase().trim();
  let diagramComponent: React.ReactNode = null;

  switch (normalized) {
    case 'PRISM':
    case 'HINH_LANG_TRU':
    case 'LANG_TRU':
      diagramComponent = <DiagramPrism />;
      break;

    case 'TRIANGLE_SECRET':
      diagramComponent = <DiagramTriangleSecret />;
      break;

    case 'OXYZ':
    case 'TOA_DO_OXYZ':
    case 'OXYZ_COORDINATES':
      diagramComponent = <DiagramCoordinateOxyz />;
      break;

    case 'GRAPH':
    case 'DO_THI':
    case 'FUNCTION_GRAPH':
      diagramComponent = <DiagramFunctionGraph />;
      break;

    case 'PYRAMID_SABCD':
    case 'CHOP_SABCD':
    case 'HINH_CHOP_SABCD':
      diagramComponent = <DiagramPyramidSABCD />;
      break;

    case 'PYRAMID_SABC':
    case 'CHOP_SABC':
    case 'HINH_CHOP_SABC':
      diagramComponent = <DiagramPyramidSABC />;
      break;

    case 'EXAM39_DERIVATIVE_GRAPH':
      diagramComponent = <DiagramExam39DerivativeGraph />;
      break;

    case 'EXAM39_CUBE_PYRAMID':
    case 'CUBE_PYRAMID':
      diagramComponent = <DiagramExam39CubePyramid />;
      break;

    case 'EXAM39_STAND_MODEL':
      diagramComponent = <DiagramExam39StandModel />;
      break;

    case 'EXAM39_SQUARE_QUARTER_CIRCLE':
      diagramComponent = <DiagramExam39SquareQuarterCircle />;
      break;

    case 'EXAM39_FRUSTUM_PYRAMID':
    case 'FRUSTUM':
      diagramComponent = <DiagramExam39FrustumPyramid />;
      break;

    case 'EXAM39_VARIATION_TABLE':
    case 'BANG_BIEN_THIEN':
    case 'VARIATION_TABLE':
      diagramComponent = <DiagramExam39VariationTable />;
      break;

    default:
      return null;
  }

  if (!diagramComponent) return null;

  return (
    <div className="w-full bg-[#f8fafc] p-1.5 sm:p-2 rounded-xl border border-slate-300 shadow flex justify-center items-center overflow-x-auto max-h-[240px] sm:max-h-[340px]">
      {diagramComponent}
    </div>
  );
};


