const fs = require('fs');
let content = fs.readFileSync('src/components/LeftPanel.tsx', 'utf8');

// Add Maximize, Minimize imports
content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { Maximize, Minimize } from 'lucide-react';");

// Add state for fullscreen inside LeftPanel
const hook = `
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
`;
content = content.replace("  const hasAnswered = (id: number) => {", hook + "\n  const hasAnswered = (id: number) => {");

// Replace Gemini logo with Fullscreen button
const geminiLogoRegex = /\{\/\* Top Left Gemini Logo & Star Icon \*\/\}[\s\S]*?<\/div>/;
const fullscreenBtn = `
        {/* Top Left Fullscreen Button */}
        <div className="flex items-center text-slate-300 mb-1">
          <button 
            onClick={onToggleFullscreen} 
            className="p-1.5 rounded-lg bg-[#0f172a] border border-[#1e345e] hover:bg-[#1e345e] hover:text-amber-400 transition-colors shadow-sm cursor-pointer"
            title={isFullscreen ? "Thu nhỏ màn hình" : "Toàn màn hình"}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
`;
content = content.replace(geminiLogoRegex, fullscreenBtn.trim());

// Remove TOAN MAN HINH button
const toanManHinhRegex = /[ \t]*\{\/\* Button 2: TOÀN MÀN HÌNH \*\/\}[\s\S]*?<\/button>\n/;
content = content.replace(toanManHinhRegex, '');

fs.writeFileSync('src/components/LeftPanel.tsx', content);
