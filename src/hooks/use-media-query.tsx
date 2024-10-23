import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = () => setMatches(mediaQuery.matches);
    
    // Set the initial state
    setMatches(mediaQuery.matches);
    
    // Add the listener to update state on change
    mediaQuery.addEventListener("change", handler);
    
    // Cleanup listener on unmount
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
