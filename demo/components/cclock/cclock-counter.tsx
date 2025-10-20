'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useHydration } from '@/hooks/use-hydration';
import { cn } from '@/lib/utils';

const H  = { a: 0,   b: 180 },  
      V  = { a: 270, b: 90 },   
      TL = { a: 180, b: 270 },
      TR = { a: 0,   b: 270 },
      BL = { a: 180, b: 90 },
      BR = { a: 0,   b: 90 },   
      E  = { a: 135, b: 135 }; 

const digits = [
  [
    BR, H,  H,  BL,
    V,  BR, BL, V,
    V,  V,  V,  V,
    V,  V,  V,  V,
    V,  TR, TL, V,
    TR, H,  H,  TL,
  ],
  [
    BR, H,  BL, E,
    TR, BL, V,  E,
    E,  V,  V,  E,
    E,  V,  V,  E,
    BR, TL, TR, BL,
    TR, H,  H,  TL,
  ],
  [
    BR, H,  H,  BL,
    TR, H,  BL, V,
    BR, H,  TL, V,
    V,  BR, H,  TL,
    V,  TR, H,  BL,
    TR, H,  H,  TL,
  ],
  [
    BR, H,  H,  BL,
    TR, H,  BL, V,
    E,  BR, TL, V,
    E,  TR, BL, V,
    BR, H,  TL, V,
    TR, H,  H,  TL,
  ],
  [
    BR, BL, BR, BL,
    V,  V,  V,  V,
    V,  TR, TL, V,
    TR, H,  BL, V,
    E,  E,  V,  V,
    E,  E,  TR, TL,
  ],
  [
    BR, H,  H,  BL,
    V,  BR, H,  TL,
    V,  TR, H,  BL,
    TR, H,  BL, V,
    BR, H,  TL, V,
    TR, H,  H,  TL,
  ],
  [
    BR, H,  H,  BL,
    V,  BR, H,  TL,
    V,  TR, H,  BL,
    V,  BR, BL, V,
    V,  TR, TL, V,
    TR, H,  H,  TL,
  ],
  [
    BR, H,  H,  BL,
    TR, H,  BL, V,
    E,  E,  V,  V,
    E,  E,  V,  V,
    E,  E,  V,  V,
    E,  E,  TR, TL,
  ],
  [
    BR, H,  H,  BL,
    V,  BR, BL, V,
    V,  TR, TL, V,
    V,  BR, BL, V,
    V,  TR, TL, V,
    TR, H,  H,  TL,
  ],
  [
    BR, H,  H,  BL,
    V,  BR, BL, V,
    V,  TR, TL, V,
    TR, H,  BL, V,
    BR, H,  TL, V,
    TR, H,  H,  TL,
  ],
];

const normalizeAngle = (next: number, prev: number) => {
  const delta = (((next - prev) % 360) + 360) % 360;
  return prev + delta;
};

interface DialProps {
  angle1: number;
  angle2: number;
}

const Dial: React.FC<DialProps> = ({ angle1, angle2 }) => {
  const prev = useRef({ angle1: 0, angle2: 0 });
  const normalizedAngle1 = normalizeAngle(angle1, prev.current.angle1);
  const normalizedAngle2 = normalizeAngle(angle2, prev.current.angle2);
  prev.current = { angle1: normalizedAngle1, angle2: normalizedAngle2 };

  const handStyle = {
    width: "47%",
    height: "3px",
  };

  return (
    <div
      className={cn(
        "size-[var(--dial-size)] relative rounded-full flex-shrink-0 border-2 max-[700px]:border max-[500px]:border",
        "border-white bg-gradient-to-br from-[#d0d0d0] via-white to-white",
        "dark:border-black dark:from-[#111111] dark:via-[#222222] dark:to-[#222222]",
        "shadow-[-2px_2px_6px_#d0d0d0,_2px_-2px_6px_#ffffff] dark:shadow-[-2px_2px_6px_#111111,_2px_-2px_6px_#222222]",
      )}
    >
      {/* First hand */}
      <div
        className="absolute bg-black dark:bg-white rounded-full transition-transform ease-in-out max-[500px]:w-1/2"
        style={{
          ...handStyle,
          top: "calc(50% - 1.5px)",
          left: "50%",
          transformOrigin: "0% 50%",
          transform: `rotate(${normalizedAngle1}deg)`,
          transitionDuration: `0.4s`,
        }}
      />
      {/* Second hand */}
      <div
        className="absolute bg-black dark:bg-white rounded-full transition-transform ease-in-out max-[500px]:w-1/2"
        style={{
          ...handStyle,
          top: "calc(50% - 1.5px)",
          left: "50%",
          transformOrigin: "0% 50%",
          transform: `rotate(${normalizedAngle2}deg)`,
          transitionDuration: `0.4s`,
        }}
      />
    </div>
  );
};

interface ClockCounterProps {
  value: number;
  className?: string;
}

const ClockCounter: React.FC<ClockCounterProps> = ({
  value,
  className,
}) => {
  const convertToDigits = (num: number) => {
    const absValue = Math.abs(Math.floor(num));
    const str = String(absValue);
    const targetLength = Math.max(1, str.length);
    return str.padStart(targetLength, "0").split("").map(Number);
  };

  const [displayValue, setDisplayValue] = useState(() =>
    convertToDigits(value)
  );

  useEffect(() => {
    setDisplayValue(convertToDigits(value));
  }, [value]);

  const isMounted = useHydration();

  if (!isMounted) return null;

  return (
    <div
      className={cn(`flex items-center justify-center font-sans text-center`, className)}
      style={
        {
          "--dial-size": "3vw",
          "--gap": "calc(var(--dial-size) * 0.05)",
          "--segment-w": "calc(var(--dial-size) * 4 + var(--gap) * 5)",
          "--segment-h": "calc(var(--dial-size) * 6 + var(--gap) * 5)",
          gap: "var(--gap)",
        } as React.CSSProperties
      }
    >
      {displayValue.map((digit, i) => (
        <div
          key={i}
          className="flex flex-wrap"
          style={
            {
              gap: "var(--gap)",
              width: "var(--segment-w)",
              height: "var(--segment-h)",
            } as React.CSSProperties
          }
        >
          {digits[digit].map(({ a, b }, j) => (
            <Dial key={j} angle1={a} angle2={b} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ClockCounter;