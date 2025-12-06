import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Category } from '../types';
import { CATEGORIES } from '../constants';

interface MenuProps {
  onSelectCategory: (category: Category) => void;
  isProcessing: boolean;
}

const Menu: React.FC<MenuProps> = ({ onSelectCategory, isProcessing }) => {
  const [offset, setOffset] = useState(0); // 0 to TotalPerimeter (in pixels)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const lastOffset = useRef(0);

  // Update dimensions on mount and resize
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

  // Calculate Total Perimeter
  // P = 2*W + 2*H
  const totalPerimeter = (dimensions.width * 2) + (dimensions.height * 2);

  // Handle Dragging Logic
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

      // Determine movement direction logic
      // We want a natural "spin". 
      // Top edge: dragging right (+)
      // Right edge: dragging down (+)
      // Bottom edge: dragging left (-) -> we invert logic for unified scalar
      // Left edge: dragging up (-)
      
      // Simplified: Just use X+Y sum for a generic "spin" feel, or more complex vector logic.
      // For mobile "swiping", keeping it simple (Drag Right/Down = Forward) works best intuitively.
      const movement = deltaX + deltaY; 
      
      // Sensitivity factor
      const sensitivity = 1.5; // Pixels 1:1ish
      
      let newOffset = lastOffset.current + (movement * sensitivity);
      
      // Normalize to 0 - totalPerimeter
      newOffset = newOffset % totalPerimeter;
      if (newOffset < 0) newOffset += totalPerimeter;

      setOffset(newOffset);
    };

    const handleEnd = () => {
      isDragging.current = false;
    };

    // Touch Events
    const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY);
    
    // Mouse Events
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

  // Calculate absolute X,Y based on distance along perimeter
  const getPositionByDistance = (distance: number) => {
    const { width, height } = dimensions;
    const padding = 12; // Wall padding
    const buttonSize = 72; // Button size reference
    const halfBtn = buttonSize / 2;

    let top = 0;
    let left = 0;

    // Defined Edges by distance:
    // 0 -> W : TOP Edge (moving left to right)
    // W -> W+H : RIGHT Edge (moving top to bottom)
    // W+H -> 2W+H : BOTTOM Edge (moving right to left)
    // 2W+H -> 2W+2H : LEFT Edge (moving bottom to top)

    if (distance < width) {
      // TOP EDGE
      left = distance;
      top = padding;
      
      // Constrain corners
      if (left < padding) left = padding;
      if (left > width - buttonSize - padding) left = width - buttonSize - padding;

    } else if (distance < width + height) {
      // RIGHT EDGE
      const localDist = distance - width;
      left = width - buttonSize - padding;
      top = localDist;

      if (top < padding) top = padding;
      if (top > height - buttonSize - padding) top = height - buttonSize - padding;

    } else if (distance < (width * 2) + height) {
      // BOTTOM EDGE
      const localDist = distance - (width + height);
      // Moving right to left means: width -> 0
      left = width - localDist - buttonSize; 
      top = height - buttonSize - padding;

      if (left < padding) left = padding;
      if (left > width - buttonSize - padding) left = width - buttonSize - padding;

    } else {
      // LEFT EDGE
      const localDist = distance - ((width * 2) + height);
      // Moving bottom to top means: height -> 0
      left = padding;
      top = height - localDist - buttonSize;

      if (top < padding) top = padding;
      if (top > height - buttonSize - padding) top = height - buttonSize - padding;
    }

    return { top: `${top}px`, left: `${left}px` };
  };

  if (totalPerimeter === 0) return null;

  // Calculate gap based on Pixel Distance, not Percentage
  // This ensures equal spacing regardless of screen aspect ratio
  const itemGapPixels = totalPerimeter / CATEGORIES.length;

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing overflow-hidden"
    >
      {CATEGORIES.map((cat, index) => {
        // Calculate exact pixel position along the loop
        let itemDistance = (offset + (index * itemGapPixels)) % totalPerimeter;
        if (itemDistance < 0) itemDistance += totalPerimeter;

        const style = getPositionByDistance(itemDistance);

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
              width: '72px',
              height: '72px',
            }}
            disabled={isProcessing}
            className={`
              flex flex-col items-center justify-center
              rounded-2xl
              backdrop-blur-md bg-black/20 border border-white/10 shadow-lg
              transition-transform duration-100 ease-out
              ${isProcessing ? 'opacity-40 grayscale' : 'active:scale-95 active:bg-white/10'}
            `}
          >
            <span className="text-2xl mb-0.5 drop-shadow-md filter select-none">{cat.icon}</span>
            <span className="text-[8px] font-medium text-center text-white/90 leading-none px-1 drop-shadow-sm select-none truncate w-full">
              {cat.title}
            </span>
          </button>
        );
      })}
      
      {/* Visual Guide Center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <div className="w-48 h-48 border border-dashed border-white/10 rounded-full animate-[spin_20s_linear_infinite]" />
      </div>
    </div>
  );
};

export default Menu;