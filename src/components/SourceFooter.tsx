import { useTranslation } from "react-i18next";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useToday } from "../hooks/useToday";

interface SourceFooterProps {
  sourceUrl: string | null;
  verifiedAt: string | null;
  /** FN-5131. 이 기간을 넘기면 경고 상태로 전환한다. */
  staleAfterDays?: number;
}

/**
 * FN-1173·FN-1178·FN-5132.
 * 출처와 확인 시각을 병기하고, 확인 시각이 없거나 오래되면 경고로 표시한다.
 */
export function SourceFooter({ sourceUrl, verifiedAt, staleAfterDays = 90 }: SourceFooterProps) {
  const { t } = useTranslation();
  const { online } = useNetworkStatus();
  const now = useToday();

  // FN-5132. 확인 시각이 없으면 경고로 간주한다.
  const stale = !verifiedAt || now - new Date(verifiedAt).getTime() > staleAfterDays * 86_400_000;

  return (
    <footer className="source-footer">
      {sourceUrl ? (
        online ? (
          <a href={sourceUrl} target="_blank" rel="noreferrer noopener">
            {t("common.sourceOfficial")} ↗
          </a>
        ) : (
          // FN-2114. 오프라인에서는 눌러도 안 되는 링크를 비활성으로 보여준다.
          <span className="source-footer__disabled">
            {t("common.sourceOfficial")} · {t("common.linkDisabledOffline")}
          </span>
        )
      ) : null}
      <span className={stale ? "chip chip--warning" : "chip"}>
        {stale ? `⚠ ${t("common.unverified")}` : t("common.lastUpdated", { time: new Date(verifiedAt!).toLocaleDateString() })}
      </span>
      <p className="source-footer__disclaimer">{t("common.disclaimer")}</p>
    </footer>
  );
}
