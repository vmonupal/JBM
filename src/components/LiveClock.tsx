'use client';

import { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';

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
  const { settings } = useSettings();
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

  const dtSettings = settings.dateTime;
  const is24h = dtSettings.timeFormat === '24h';
  const shouldShowDate = dtSettings.showBoth || dtSettings.showDate;
  const shouldShowTime = dtSettings.showBoth || dtSettings.showTime;

  // Format date: e.g. "09 October 2026"
  const day = String(now.getDate()).padStart(2, '0');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();
  const dateStr = `${day} ${month} ${year}`;

  // Format time based on 12h vs 24h
  let timeStr = '';
  const tzAbbr = dtSettings.timezone || 'IST';

  if (is24h) {
    const hours24 = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeStr = showSeconds 
      ? `${hours24}:${minutes}:${seconds} ${tzAbbr}`
      : `${hours24}:${minutes} ${tzAbbr}`;
  } else {
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = String(hours).padStart(2, '0');
    timeStr = showSeconds 
      ? `${hoursStr}:${minutes}:${seconds} ${ampm} ${tzAbbr}`
      : `${hoursStr}:${minutes} ${ampm} ${tzAbbr}`;
  }

  if (!shouldShowDate && !shouldShowTime) {
    return null;
  }

  if (stacked) {
    return (
      <div className={`flex flex-col text-right leading-tight ${className}`}>
        {shouldShowDate && <span className="font-semibold tracking-wide">{dateStr}</span>}
        {shouldShowTime && <span className="text-amber-500 font-mono font-bold text-xs">{timeStr}</span>}
      </div>
    );
  }

  if (shouldShowDate && shouldShowTime) {
    return (
      <span className={`inline-flex items-center space-x-2 ${className}`}>
        <span>{dateStr}</span>
        <span>•</span>
        <span className="font-mono font-bold">{timeStr}</span>
      </span>
    );
  }

  if (shouldShowDate) {
    return <span className={className}>{dateStr}</span>;
  }

  return <span className={`font-mono font-bold ${className}`}>{timeStr}</span>;
}
