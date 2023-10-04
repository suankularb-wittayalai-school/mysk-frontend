// Imports
import { useEffect, useState } from "react";

export default function useNow(updateFrequency?: number): Date {
  const [now, setNow] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(
      () => setNow(new Date()),
      updateFrequency || 1000,
    );
    return () => clearInterval(interval);
  }, []);
  return now;
}
