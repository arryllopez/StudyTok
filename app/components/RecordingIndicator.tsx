import React, { useEffect, useState } from "react";

interface RecordingIndicatorProps {
  isRecording: boolean;
}

export default function RecordingIndicator({ isRecording }: RecordingIndicatorProps) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (isRecording) {
      console.log("RecordingIndicator activated. Starting countdown.");
      setCountdown(3);
      console.log("Countdown started: 3 seconds remaining");
      const timer = setInterval(() => {
        setCountdown((prev) => {
          const newCountdown = prev - 1;
          if (newCountdown > 0) {
            console.log(`${newCountdown} seconds remaining`);
          } else {
            console.log("Speak Now!");
            clearInterval(timer);
          }
          return newCountdown;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRecording]);

  if (!isRecording) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="text-4xl text-white font-bold">
        {countdown > 0 ? countdown : "Speak Now!"}
      </div>
    </div>
  );
}