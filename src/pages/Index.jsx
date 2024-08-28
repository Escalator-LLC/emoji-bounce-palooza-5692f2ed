import React, { useState, useEffect, useRef } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState({ x: 2, y: 2 });
  const [speed, setSpeed] = useState(5);
  const [emoji, setEmoji] = useState('😊');
  const [isAnimating, setIsAnimating] = useState(false);
  const [score, setScore] = useState(0);
  const containerRef = useRef(null);
  const emojiRef = useRef(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current && emojiRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const emojiWidth = emojiRef.current.offsetWidth;
        const emojiHeight = emojiRef.current.offsetHeight;
        setPosition(prev => ({
          x: Math.min(prev.x, width - emojiWidth),
          y: Math.min(prev.y, height - emojiHeight)
        }));
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      if (containerRef.current && emojiRef.current) {
        const container = containerRef.current;
        const emojiElement = emojiRef.current;
        const { width, height } = container.getBoundingClientRect();
        const emojiWidth = emojiElement.offsetWidth;
        const emojiHeight = emojiElement.offsetHeight;

        setPosition(prevPos => {
          let newX = prevPos.x + velocity.x * speed;
          let newY = prevPos.y + velocity.y * speed;
          let newVelocityX = velocity.x;
          let newVelocityY = velocity.y;

          const hitLeftOrRight = newX <= 0 || newX >= width - emojiWidth;
          const hitTopOrBottom = newY <= 0 || newY >= height - emojiHeight;

          if (hitLeftOrRight) {
            newVelocityX = -newVelocityX;
            newX = hitLeftOrRight ? (newX <= 0 ? 0 : width - emojiWidth) : newX;
          }
          if (hitTopOrBottom) {
            newVelocityY = -newVelocityY;
            newY = hitTopOrBottom ? (newY <= 0 ? 0 : height - emojiHeight) : newY;
          }

          if ((newX === 0 || newX === width - emojiWidth) && (newY === 0 || newY === height - emojiHeight)) {
            setScore(prevScore => prevScore + 1);
          }

          setVelocity({ x: newVelocityX, y: newVelocityY });

          return { x: newX, y: newY };
        });
      }

      if (isAnimating) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (isAnimating) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isAnimating, velocity, speed]);

  const toggleAnimation = () => {
    setIsAnimating(prev => !prev);
  };

  const emojiOptions = ['😊', '🚀', '🌈', '🍕', '🎉', '🐱', '🌟', '🦄'];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="mb-4 flex space-x-4 items-center">
        <Select onValueChange={setEmoji} value={emoji}>
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
        <div className="ml-4 text-lg font-bold">
          Score: {score}
        </div>
      </div>
      <div
        ref={containerRef}
        className="w-full h-[calc(100vh-200px)] border-4 border-gray-300 relative bg-white overflow-hidden"
      >
        <div
          ref={emojiRef}
          className="absolute text-4xl"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transition: 'left 0.05s linear, top 0.05s linear',
          }}
        >
          {emoji}
        </div>
      </div>
      <div className="mt-4 w-64">
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
