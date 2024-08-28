import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const DvdLogo = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState({ x: 2, y: 2 });
  const [emoji, setEmoji] = useState('😀');
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const { width, height } = container.getBoundingClientRect();

        setPosition((prevPos) => {
          let newX = prevPos.x + velocity.x;
          let newY = prevPos.y + velocity.y;
          let newVelocityX = velocity.x;
          let newVelocityY = velocity.y;

          if (newX <= 0 || newX >= width - 50) {
            newVelocityX = -newVelocityX;
          }
          if (newY <= 0 || newY >= height - 50) {
            newVelocityY = -newVelocityY;
          }

          setVelocity({ x: newVelocityX, y: newVelocityY });

          return {
            x: Math.max(0, Math.min(newX, width - 50)),
            y: Math.max(0, Math.min(newY, height - 50)),
          };
        });
      }

      if (isAnimating) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (isAnimating) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isAnimating, velocity]);

  const toggleAnimation = () => {
    setIsAnimating((prev) => !prev);
  };

  const emojiOptions = ['😀', '🚀', '🌈', '🍕', '🎉', '🐱', '🌟', '🦄'];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="mb-4 flex space-x-4">
        <Select onValueChange={(value) => setEmoji(value)} defaultValue={emoji}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select an emoji" />
          </SelectTrigger>
          <SelectContent>
            {emojiOptions.map((e) => (
              <SelectItem key={e} value={e}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={toggleAnimation}>
          {isAnimating ? 'Stop' : 'Start'}
        </Button>
      </div>
      <div
        ref={containerRef}
        className="w-[800px] h-[600px] border-4 border-gray-300 relative bg-white"
      >
        <div
          className="absolute text-4xl"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transition: 'left 0.1s linear, top 0.1s linear',
          }}
        >
          {emoji}
        </div>
      </div>
    </div>
  );
};

export default DvdLogo;