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
      className="flex flex-wrap items-center gap-2 rounded-[10px] bg-[#1a1a1a] px-3 py-2 text-[13px] text-white"
      role="status"
    >
      {!online && (
        <span className="badge badge--offline">
          <FontAwesomeIcon icon={faCircleExclamation} aria-hidden="true" /> {t("common.offline")}
        </span>
      )}
      {!online && (
        <span className="text-[#d4d4d4]">
          {t("common.lastUpdated", {
            time: lastUpdated ? new Date(lastUpdated).toLocaleString() : "—",
          })}
        </span>
      )}
      {pending > 0 && <span className="text-[#d4d4d4]">{t("timeline.pendingSync", { count: pending })}</span>}
    </div>
  );
}
