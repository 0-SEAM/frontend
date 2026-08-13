import { useTranslation } from "react-i18next";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useTaskProgressStore } from "../store/taskProgressStore";

/** FN-2111. 오프라인 배지와 마지막 갱신 시각을 상단에 고정 노출한다. */
export function StatusBar({ lastUpdated }: { lastUpdated?: string | null }) {
  const { t } = useTranslation();
  const { online } = useNetworkStatus();
  const pending = useTaskProgressStore((s) => s.pendingSync.length);

  if (online && pending === 0) return null;

  return (
    <div className="status-bar" role="status">
      {!online && <span className="badge badge--offline">◍ {t("common.offline")}</span>}
      {!online && (
        <span className="status-bar__meta">
          {t("common.lastUpdated", {
            time: lastUpdated ? new Date(lastUpdated).toLocaleString() : "—",
          })}
        </span>
      )}
      {pending > 0 && <span className="status-bar__meta">{t("timeline.pendingSync", { count: pending })}</span>}
    </div>
  );
}
