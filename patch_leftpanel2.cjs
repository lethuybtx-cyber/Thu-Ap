const fs = require('fs');
let content = fs.readFileSync('src/components/LeftPanel.tsx', 'utf8');

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
content = content.replace("  const [showHistory, setShowHistory] = useState(false);", "  const [showHistory, setShowHistory] = useState(false);\n" + hook);

fs.writeFileSync('src/components/LeftPanel.tsx', content);
