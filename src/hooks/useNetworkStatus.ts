import { useEffect, useState } from "react";

/**
 * FN-2101·FN-2102. 상태 확인에 실패하면 오프라인으로 간주해 안전하게 동작한다.
 */
export function useNetworkStatus(): { online: boolean } {
  const [online, setOnline] = useState<boolean>(() => {
    try {
      return navigator.onLine;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return { online };
}
