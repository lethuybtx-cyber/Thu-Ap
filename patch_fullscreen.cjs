const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldFullscreen = `  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      appContainerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };`;

const newFullscreen = `  const handleToggleFullscreen = () => {
    try {
      const elem = appContainerRef.current as any;
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        if (elem?.requestFullscreen) {
          elem.requestFullscreen().catch(() => {});
        } else if (elem?.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        }
      }
    } catch (e) {
      console.warn('Fullscreen API not supported');
    }
  };`;

content = content.replace(oldFullscreen, newFullscreen);
fs.writeFileSync('src/App.tsx', content);
