'use client';

import { useState, useEffect } from 'react';

interface LiveClockProps {
  className?: string;
  showSeconds?: boolean;
  stacked?: boolean;
}

export default function LiveClock({
  className = '',
  showSeconds = false,
  stacked = false
}: LiveClockProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) {
    return <span className={className}>--:--</span>;
  }

  // Format date: e.g. "06 October 2026"
  const day = String(now.getDate()).padStart(2, '0');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();
  const dateStr = `${day} ${month} ${year}`;

  // Format time: e.g. "06:09 PM IST"
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // '0' should be '12'
  const hoursStr = String(hours).padStart(2, '0');

  // Try to determine timezone abbr or IST
  const tzAbbr = 'IST'; // Default church timezone requested in specs
  const timeStr = showSeconds 
    ? `${hoursStr}:${minutes}:${seconds} ${ampm} ${tzAbbr}`
    : `${hoursStr}:${minutes} ${ampm} ${tzAbbr}`;

  if (stacked) {
    return (
      <div className={`flex flex-col text-right leading-tight ${className}`}>
        <span className="font-semibold tracking-wide">{dateStr}</span>
        <span className="text-amber-500 font-mono font-bold text-xs">{timeStr}</span>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center space-x-2 ${className}`}>
      <span>{dateStr}</span>
      <span>•</span>
      <span className="font-mono font-bold">{timeStr}</span>
    </span>
  );
}
