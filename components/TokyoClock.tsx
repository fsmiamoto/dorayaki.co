"use client";

import { useEffect, useState } from "react";

export default function TokyoClock({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Tokyo",
      hour: "2-digit",
      minute: "2-digit",
    });
    const tick = () => setTime(formatter.format(new Date()));

    tick();
    const interval = window.setInterval(tick, 20_000);
    return () => window.clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <time className={className} aria-label={`Tokyo ${time} JST`}>
        {time}
      </time>
    );
  }

  return (
    <span className={className}>
      tokyo {time} <span className="text-app-faint">JST</span>
    </span>
  );
}
