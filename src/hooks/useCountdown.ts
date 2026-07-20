import { useEffect, useState } from "react";

export const useCountdown = (initialSeconds: number) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const reset = () => setSecondsLeft(initialSeconds);

  return { secondsLeft, isExpired: secondsLeft <= 0, reset };
};
