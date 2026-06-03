import { useEffect, useState } from "react";

/** True on small / touch screens. Re-evaluates on resize & orientation. */
const query = "(max-width: 767px), (pointer: coarse)";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
};

export default useIsMobile;
