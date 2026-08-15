import { useEffect, useRef, useState } from "react";
import type { BankBranch } from "../domain/branches";

type KakaoMapInstance = {
  setBounds: (bounds: KakaoLatLngBounds) => void;
  setLevel: (level: number, options?: { animate?: boolean }) => void;
  panTo: (position: KakaoLatLng) => void;
};

type KakaoLatLng = object;
type KakaoLatLngBounds = { extend: (position: KakaoLatLng) => void };

type KakaoMaps = {
  load: (callback: () => void) => void;
  Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMapInstance;
  LatLng: new (latitude: number, longitude: number) => KakaoLatLng;
  LatLngBounds: new () => KakaoLatLngBounds;
  Marker: new (options: { map: KakaoMapInstance; position: KakaoLatLng; title: string; clickable: boolean }) => object;
  event: { addListener: (target: object, type: "click", handler: () => void) => void };
};

declare global {
  interface Window {
    kakao?: { maps: KakaoMaps };
  }
}

let sdkPromise: Promise<KakaoMaps> | undefined;

function loadKakaoMaps(appKey: string) {
  if (window.kakao?.maps) return Promise.resolve(window.kakao.maps);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<KakaoMaps>((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&autoload=false`;
    script.onload = () => {
      if (!window.kakao?.maps) {
        reject(new Error("Kakao Maps SDK was unavailable after loading."));
        return;
      }
      window.kakao.maps.load(() => resolve(window.kakao!.maps));
    };
    script.onerror = () => reject(new Error("Kakao Maps SDK could not be loaded."));
    document.head.append(script);
  });

  return sdkPromise;
}

interface KakaoMapProps {
  branches: BankBranch[];
  selectedBranchId: string;
  onSelectBranch: (branchId: string) => void;
  labels: {
    loading: string;
    unconfigured: string;
    failed: string;
  };
}

/** FN-3102, FN-3112, FN-3119. Interactive map with a configuration/error fallback. */
export function KakaoMap({ branches, selectedBranchId, onSelectBranch, labels }: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMapInstance | null>(null);
  const mappableBranchesRef = useRef<(BankBranch & { latitude: number; longitude: number })[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "unconfigured" | "failed">("loading");
  const appKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY;
  const displayStatus = appKey ? status : "unconfigured";

  useEffect(() => {
    if (!appKey) {
      return;
    }

    let disposed = false;

    void loadKakaoMaps(appKey)
      .then((maps) => {
        if (disposed || !containerRef.current) return;

        const mappableBranches = branches.filter(
          (branch): branch is BankBranch & { latitude: number; longitude: number } =>
            branch.latitude !== null && branch.longitude !== null,
        );
        mappableBranchesRef.current = mappableBranches;
        if (mappableBranches.length === 0) {
          setStatus("ready");
          return;
        }

        const firstBranch = mappableBranches[0];
        const map = new maps.Map(containerRef.current, {
          center: new maps.LatLng(firstBranch.latitude, firstBranch.longitude),
          level: 6,
        });
        mapRef.current = map;
        const bounds = new maps.LatLngBounds();

        mappableBranches.forEach((branch) => {
          const position = new maps.LatLng(branch.latitude, branch.longitude);
          bounds.extend(position);
          const marker = new maps.Marker({
            map,
            position,
            title: branch.id,
            clickable: true,
          });
          maps.event.addListener(marker, "click", () => onSelectBranch(branch.id));
        });

        if (mappableBranches.length > 1) {
          map.setBounds(bounds);
        }
        setStatus("ready");
      })
      .catch(() => {
        if (!disposed) setStatus("failed");
      });

    return () => {
      disposed = true;
    };
  }, [appKey, branches, onSelectBranch]);

  useEffect(() => {
    const map = mapRef.current;
    const selectedBranch = mappableBranchesRef.current.find((branch) => branch.id === selectedBranchId);
    if (!map || !selectedBranch) return;

    map.setLevel(3, { animate: true });
    map.panTo(new window.kakao!.maps.LatLng(selectedBranch.latitude, selectedBranch.longitude));
  }, [selectedBranchId]);

  return (
    <div className="bank-map" aria-label="Recommended bank branch map">
      <div className="bank-map-canvas" ref={containerRef} />
      {displayStatus !== "ready" && (
        <div className="bank-map-fallback" role={displayStatus === "failed" ? "alert" : "status"}>
          {displayStatus === "loading" && labels.loading}
          {displayStatus === "unconfigured" && labels.unconfigured}
          {displayStatus === "failed" && labels.failed}
        </div>
      )}
    </div>
  );
}
