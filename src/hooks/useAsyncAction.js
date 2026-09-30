import { useRef, useState } from "react";

export default function useAsyncAction(message) {
  const running = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const run = async (action) => {
    if (running.current) return;
    running.current = true;
    setPending(true);
    setError("");
    try {
      await action();
    } catch {
      setError(message);
    } finally {
      running.current = false;
      setPending(false);
    }
  };
  return { run, pending, error };
}
