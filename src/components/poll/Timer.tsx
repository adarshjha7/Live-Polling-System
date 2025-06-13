import React, { useState, useEffect } from "react";
import { usePoll } from "@/context/PollContext";

interface TimerProps {
  onTimeout?: () => void;
}

export function Timer({ onTimeout }: TimerProps) {
  const { getTimeRemaining } = usePoll();
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining();
      setTimeLeft(remaining);

      if (remaining === 0 && onTimeout) {
        onTimeout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [getTimeRemaining, onTimeout]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const getTimerColor = () => {
    if (timeLeft <= 10) return "text-red-500";
    if (timeLeft <= 30) return "text-yellow-500";
    return "text-green-500";
  };

  if (timeLeft === 0) {
    return (
      <div className="text-center p-4">
        <div className="text-2xl font-bold text-red-500">Time's Up!</div>
      </div>
    );
  }

  return (
    <div className="text-center p-4">
      <div className="text-sm text-gray-600 mb-1">Time Remaining</div>
      <div className={`text-3xl font-bold ${getTimerColor()}`}>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ${
            timeLeft <= 10
              ? "bg-red-500"
              : timeLeft <= 30
                ? "bg-yellow-500"
                : "bg-green-500"
          }`}
          style={{ width: `${(timeLeft / 60) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
