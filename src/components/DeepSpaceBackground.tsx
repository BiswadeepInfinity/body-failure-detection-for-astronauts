import React from 'react';

// Static, calm deep-space background without cartoonish nebulas, spinning objects or neon flares
export const DeepSpaceBackground: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#090d16',
        backgroundImage: `
          radial-gradient(1px 1px at 30px 50px, rgba(255, 255, 255, 0.25), transparent),
          radial-gradient(1px 1px at 150px 180px, rgba(255, 255, 255, 0.2), transparent),
          radial-gradient(1px 1px at 320px 90px, rgba(255, 255, 255, 0.2), transparent),
          radial-gradient(1px 1px at 580px 240px, rgba(255, 255, 255, 0.15), transparent),
          radial-gradient(1px 1px at 750px 80px, rgba(255, 255, 255, 0.2), transparent),
          radial-gradient(1px 1px at 920px 290px, rgba(255, 255, 255, 0.15), transparent),
          radial-gradient(1px 1px at 1100px 140px, rgba(255, 255, 255, 0.2), transparent),
          radial-gradient(1px 1px at 1350px 210px, rgba(255, 255, 255, 0.2), transparent)
        `,
        backgroundSize: '500px 500px',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};
