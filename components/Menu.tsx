import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Category } from '../types';
import { CATEGORIES } from '../constants';

interface MenuProps {
  onSelectCategory: (category: Category) => void;
  isProcessing: boolean;
}

const Menu: React.FC<MenuProps> = ({ onSelectCategory, isProcessing }) => {
  const [offset, setOffset] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const lastOffset = useRef(0);

  // Reduced button size by ~10% (from 88 to 80)
  const BTN_SIZE = 80; 
  const PADDING = 20;  // Safe distance from screen edge

  useLayoutEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // --- Perimeter Math (Safe Track) ---
  const safeWidth = Math.max(0, dimensions.width - (2 * PADDING) - BTN_SIZE);
  const safeHeight = Math.max(0, dimensions.height - (2 * PADDING) - BTN_SIZE);
  const totalPerimeter = (safeWidth * 2) + (safeHeight * 2);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || totalPerimeter === 0) return;

    const handleStart = (clientX: number, clientY: number) => {
      isDragging.current = true;
      startPos.current = { x: clientX, y: clientY };
      lastOffset.current = offset;
    };

    const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging.current) return;

      const deltaX = clientX - startPos.current.x;
      const deltaY = clientY - startPos.current.y;

      // Dragging Right or Down = Positive (Clockwise)
      const movement = deltaX + deltaY; 
      
      let newOffset = lastOffset.current + movement;
      
      // Loop logic
      newOffset = newOffset % totalPerimeter;
      if (newOffset < 0) newOffset += totalPerimeter;

      setOffset(newOffset);
    };

    const handleEnd = () => {
      isDragging.current = false;
    };

    // Events
    const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY);
    
    const onMouseDown = (e: MouseEvent) => handleStart(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);

    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', handleEnd);
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', handleEnd);

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', handleEnd);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', handleEnd);
    };
  }, [offset, totalPerimeter]);

  const getPositionByDistance = (dist: number) => {
    let top = 0;
    let left = 0;

    if (dist < safeWidth) {
      // TOP EDGE
      left = PADDING + dist;
      top = PADDING;
    } else if (dist < safeWidth + safeHeight) {
      // RIGHT EDGE
      left = dimensions.width - PADDING - BTN_SIZE;
      top = PADDING + (dist - safeWidth);
    } else if (dist < (safeWidth * 2) + safeHeight) {
      // BOTTOM EDGE
      const bottomDist = dist - (safeWidth + safeHeight);
      left = (dimensions.width - PADDING - BTN_SIZE) - bottomDist;
      top = dimensions.height - PADDING - BTN_SIZE;
    } else {
      // LEFT EDGE
      const leftDist = dist - ((safeWidth * 2) + safeHeight);
      left = PADDING;
      top = (dimensions.height - PADDING - BTN_SIZE) - leftDist;
    }

    return { top: `${top}px`, left: `${left}px` };
  };

  if (totalPerimeter === 0) return null;

  const itemGapPixels = totalPerimeter / CATEGORIES.length;

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing overflow-hidden"
    >
      {CATEGORIES.map((cat, index) => {
        let itemDistance = (offset + (index * itemGapPixels)) % totalPerimeter;
        if (itemDistance < 0) itemDistance += totalPerimeter;

        const style = getPositionByDistance(itemDistance);
        
        // Unique ID for the SVG text path
        const curveId = `curve_${cat.id}`;

        return (
          <button
            key={cat.id}
            onClick={(e) => {
              e.stopPropagation();
              if (!isProcessing) onSelectCategory(cat);
            }}
            style={{ 
              position: 'absolute',
              top: style.top,
              left: style.left,
              width: `${BTN_SIZE}px`,
              height: `${BTN_SIZE}px`,
            }}
            disabled={isProcessing}
            className={`
              relative
              rounded-full
              backdrop-blur-md bg-black/30 border border-white/20 shadow-xl
              transition-transform duration-100 ease-out
              flex items-center justify-center
              ${isProcessing ? 'opacity-40 grayscale' : 'active:scale-95 active:bg-white/20'}
            `}
          >
             {/* Center Icon */}
            <span className="text-3xl mb-2 drop-shadow-md select-none z-10">{cat.icon}</span>

            {/* SVG Text Curved Around Bottom */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
              viewBox="0 0 100 100"
            >
              <defs>
                {/* 
                  Path Definition:
                  A semi-circle arc at the bottom.
                  Starts at 10,50 (Left Middle).
                  Sweeps down to 90,50 (Right Middle).
                  Radius 40 (Fit inside 100x100).
                  This creates a "Smile" shape for the text to sit IN.
                */}
                <path 
                  id={curveId} 
                  d="M 10,50 A 40,40 0 0,0 90,50"
                  fill="none"
                />
              </defs>
              <text fontSize="10.5" fontWeight="bold" fill="white" textAnchor="middle" style={{ filter: 'drop-shadow(1px 1px 1px black)' }}>
                <textPath href={`#${curveId}`} startOffset="50%">
                  {cat.title}
                </textPath>
              </text>
            </svg>
          </button>
        );
      })}
    </div>
  );
};

export default Menu;