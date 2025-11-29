"use client";

import { useEffect } from 'react';

export default function StarfieldBackground() {
  useEffect(() => {
    // Optional: Add any client-side enhancements here
    // For now, the CSS animations handle everything
  }, []);

  return (
    <div className="starfield-container">
      {/* Layer 1: Fast-moving small stars */}
      <div className="stars layer-1"></div>

      {/* Layer 2: Medium stars, slower movement */}
      <div className="stars layer-2"></div>

      {/* Layer 3: Large twinkling stars, slowest movement */}
      <div className="twinkling layer-3"></div>

      <style jsx>{`
        .starfield-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: -1;
          background: var(--cyber-black);
          overflow: hidden;
        }

        .stars {
          position: absolute;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(1px 1px at 10px 20px, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 50px 80px, rgba(0, 229, 255, 0.6), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(255, 230, 0, 0.4), transparent),
            radial-gradient(1px 1px at 130px 90px, rgba(255, 255, 255, 0.7), transparent),
            radial-gradient(1px 1px at 170px 60px, rgba(0, 229, 255, 0.5), transparent),
            radial-gradient(1px 1px at 210px 100px, rgba(255, 230, 0, 0.3), transparent),
            radial-gradient(1px 1px at 250px 30px, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 290px 70px, rgba(0, 229, 255, 0.4), transparent);
          background-size: 300px 200px;
        }

        .layer-1 {
          animation: move-stars-layer1 80s linear infinite;
          opacity: 0.6;
        }

        .layer-2 {
          animation: move-stars-layer2 120s linear infinite;
          opacity: 0.4;
        }

        .twinkling {
          position: absolute;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(2px 2px at 30px 50px, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(2px 2px at 70px 120px, rgba(0, 229, 255, 0.7), transparent),
            radial-gradient(2px 2px at 110px 80px, rgba(255, 230, 0, 0.5), transparent),
            radial-gradient(2px 2px at 150px 30px, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(3px 3px at 190px 90px, rgba(0, 229, 255, 0.6), transparent);
          background-size: 250px 180px;
          animation: move-twinkling 200s linear infinite;
          opacity: 0.3;
        }

        .layer-3 {
          opacity: 0.8;
        }

        @keyframes move-stars-layer1 {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(-300px) translateY(-200px); }
        }

        @keyframes move-stars-layer2 {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(300px) translateY(-200px); }
        }

        @keyframes move-twinkling {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(-250px) translateY(-180px); }
        }

        /* Add some additional random stars for richness */
        .starfield-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(1px 1px at 45% 25%, rgba(255, 255, 255, 0.3), transparent),
            radial-gradient(1px 1px at 75% 60%, rgba(0, 229, 255, 0.2), transparent),
            radial-gradient(1px 1px at 25% 75%, rgba(255, 230, 0, 0.25), transparent),
            radial-gradient(1px 1px at 85% 15%, rgba(255, 255, 255, 0.4), transparent);
          animation: twinkle 4s ease-in-out infinite alternate;
        }

        @keyframes twinkle {
          0% { opacity: 0.3; }
          100% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
