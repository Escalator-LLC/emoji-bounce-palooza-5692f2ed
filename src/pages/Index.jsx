import React, { useState, useEffect, useRef } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState({ x: 2, y: 2 });
  const [speed, setSpeed] = useState(5);
  const [emoji, setEmoji] = useState('😊');
  const [isAnimating, setIsAnimating] = useState(false);
  const [bounceCount, setBounceCount] = useState(0);
  const [cornerBounceCount, setCornerBounceCount] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [customImage, setCustomImage] = useState(null);
  const containerRef = useRef(null);
  const bouncingElementRef = useRef(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current && bouncingElementRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const elementWidth = bouncingElementRef.current.offsetWidth;
        const elementHeight = bouncingElementRef.current.offsetHeight;
        setPosition(prev => ({
          x: Math.min(prev.x, width - elementWidth),
          y: Math.min(prev.y, height - elementHeight)
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
      if (containerRef.current && bouncingElementRef.current) {
        const container = containerRef.current;
        const element = bouncingElementRef.current;
        const { width, height } = container.getBoundingClientRect();
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;

        setPosition(prevPos => {
          let newX = prevPos.x + velocity.x * speed;
          let newY = prevPos.y + velocity.y * speed;
          let newVelocityX = velocity.x;
          let newVelocityY = velocity.y;
          let bounced = false;
          let cornerBounce = false;

          const cornerThreshold = 10;

          if (newX <= 0 || newX >= width - elementWidth) {
            newVelocityX = -newVelocityX;
            newX = Math.max(0, Math.min(newX, width - elementWidth));
            bounced = true;
          }
          if (newY <= 0 || newY >= height - elementHeight) {
            newVelocityY = -newVelocityY;
            newY = Math.max(0, Math.min(newY, height - elementHeight));
            bounced = true;
          }

          if ((newX <= cornerThreshold && newY <= cornerThreshold) ||
              (newX <= cornerThreshold && newY >= height - elementHeight - cornerThreshold) ||
              (newX >= width - elementWidth - cornerThreshold && newY <= cornerThreshold) ||
              (newX >= width - elementWidth - cornerThreshold && newY >= height - elementHeight - cornerThreshold)) {
            cornerBounce = true;
          }

          if (bounced) {
            setBounceCount(prev => prev + 1);
            if (cornerBounce) {
              setCornerBounceCount(prev => prev + 1);
            }
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

  const emojiOptions = ['😊', '🚀', '🌈', '🍕', '🎉', '🐱', '🌟', '🦄', '🎨', '🎸', '🏀', '🌺', '🍦', '🐶', '🦋', '🌙'];

  const handleBackgroundUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setBackgroundImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCustomImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCustomImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="mb-4 flex space-x-4 flex-wrap justify-center">
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
        <Input
          type="file"
          onChange={handleBackgroundUpload}
          accept="image/*"
          className="w-64"
        />
        <Input
          type="file"
          onChange={handleCustomImageUpload}
          accept="image/*"
          className="w-64"
        />
      </div>
      <div
        ref={containerRef}
        className="w-full h-[calc(100vh-300px)] border-4 border-gray-300 relative overflow-hidden"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          ref={bouncingElementRef}
          className="absolute"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: customImage ? '50px' : 'auto',
            height: customImage ? '50px' : 'auto',
          }}
        >
          {customImage ? (
            <img src={customImage} alt="Custom" className="w-full h-full object-contain" />
          ) : (
            <span className="text-4xl">{emoji}</span>
          )}
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
      <div className="mt-4 text-center">
        <p>Total Bounces: {bounceCount}</p>
        <p>Corner Bounces: {cornerBounceCount}</p>
      </div>
    </div>
  );
};

export default Index;
