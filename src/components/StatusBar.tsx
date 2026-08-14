import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useTaskProgressStore } from "../store/taskProgressStore";

/** FN-2111. 오프라인 배지와 마지막 갱신 시각을 상단에 고정 노출한다. */
export function StatusBar({ lastUpdated }: { lastUpdated?: string | null }) {
  const { t } = useTranslation();
  const { online } = useNetworkStatus();
  const pending = useTaskProgressStore((s) => s.pendingSync.length);

  if (online && pending === 0) return null;

  return (
    <div
      className="border-app-line mb-5 flex flex-wrap items-center gap-2 rounded-[10px] border-2 bg-[#f5f5f5] px-4 py-3 text-[14px] text-[#303030]"
      role="status"
    >
      {!online && (
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <FontAwesomeIcon icon={faCircleExclamation} aria-hidden="true" /> {t("common.offline")}
        </span>
      )}
      {!online && (
        <span className="text-app-muted">
          {t("common.lastUpdated", {
            time: lastUpdated ? new Date(lastUpdated).toLocaleString() : "—",
          })}
        </span>
      )}
      {pending > 0 && <span className="text-app-muted">{t("timeline.pendingSync", { count: pending })}</span>}
    </div>
  );
}
