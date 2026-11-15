"use client";

import { useEffect, useState } from "react";

export default function TokyoClock({ className }: { className?: string }) {
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

  return (
    <span className={className}>
      tokyo {time} <span className="text-app-faint">JST</span>
    </span>
  );
}
