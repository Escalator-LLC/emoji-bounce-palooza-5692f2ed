import React, { useState, useEffect, useRef } from 'react';
import { Slider } from "@/components/ui/slider";

const Index = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(5);
  const [emoji, setEmoji] = useState('😊');
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = (time) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      
      setPosition(prevPos => ({
        x: (prevPos.x + speed * deltaTime / 16) % window.innerWidth,
        y: (prevPos.y + speed * deltaTime / 16) % window.innerHeight
      }));
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [speed]);

  return (
    <div className="min-h-screen w-full overflow-hidden relative bg-gray-100">
      <div 
        className="absolute text-6xl"
        style={{ 
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {emoji}
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-64">
        <Slider
          value={[speed]}
          onValueChange={(value) => setSpeed(value[0])}
          min={1}
          max={10}
          step={0.1}
          className="w-full"
        />
        <p className="text-center mt-2">Speed: {speed.toFixed(1)}</p>
      </div>
    </div>
  );
};

export default Index;
