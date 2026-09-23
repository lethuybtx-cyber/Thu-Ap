import confetti from 'canvas-confetti';

/**
 * Fires a spectacular celebratory fireworks and confetti show
 * tailored for exam submission and test results
 */
export function fireSubmissionConfetti(score: number = 10) {
  try {
    const isHighScore = score >= 8.0;
    const isGoodScore = score >= 5.0;

    // Palette: Gold, Cyan, Emerald, Rose, Purple, Amber
    const colors = isHighScore
      ? ['#FFD700', '#FACC15', '#38BDF8', '#4ADE80', '#F43F5E', '#C084FC']
      : ['#38BDF8', '#FACC15', '#34D399', '#FB7185', '#A78BFA'];

    // 1. Initial Left & Right Cannon Blasts
    confetti({
      particleCount: isHighScore ? 70 : 50,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.75 },
      colors,
      zIndex: 10000,
    });

    confetti({
      particleCount: isHighScore ? 70 : 50,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.75 },
      colors,
      zIndex: 10000,
    });

    // 2. High-score golden star rain if score >= 8
    if (isHighScore) {
      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 360,
          ticks: 80,
          origin: { x: 0.5, y: 0.35 },
          shapes: ['star'],
          colors: ['#FFE843', '#FFD700', '#FFA500', '#FFFFFF'],
          scalar: 1.2,
          zIndex: 10000,
        });
      }, 300);
    }

    // 3. Realistic continuous fireworks show for ~2.5 seconds
    const duration = isHighScore ? 2800 : 1800;
    const end = Date.now() + duration;

    const interval: any = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }

      // Firework bursts from random sky coordinates
      const x = 0.2 + Math.random() * 0.6;
      const y = 0.15 + Math.random() * 0.35;

      confetti({
        particleCount: Math.floor(25 + Math.random() * 25),
        startVelocity: 25,
        spread: 360,
        ticks: 60,
        origin: { x, y },
        colors,
        disableForReducedMotion: true,
        zIndex: 10000,
      });
    }, 320);

    return () => clearInterval(interval);
  } catch (err) {
    console.warn('Canvas confetti execution error:', err);
  }
}
