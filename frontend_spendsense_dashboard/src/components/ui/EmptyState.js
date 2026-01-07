import React from "react";
import { theme } from "../../theme";
import { Button } from "./Button";

/**
 * PUBLIC_INTERFACE
 */
export function EmptyState({
  title = "No results",
  description = "Try adjusting your filters or search query.",
  primaryActionLabel = "Reset",
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  icon = "◎",
}) {
  return (
    <div className="ss-empty" role="status" aria-live="polite">
      <div className="ss-empty__icon" aria-hidden="true">
        {icon}
      </div>
      <div className="ss-empty__title">{title}</div>
      <div className="ss-empty__desc">{description}</div>

      <div className="ss-empty__actions">
        {onPrimaryAction && (
          <Button variant="primary" size="sm" onClick={onPrimaryAction}>
            {primaryActionLabel}
          </Button>
        )}
        {onSecondaryAction && (
          <Button variant="ghost" size="sm" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>

      <style>{`
        .ss-empty{
          border: 1px dashed ${theme.colors.border};
          background: rgba(255,255,255,0.62);
          border-radius: ${theme.radii.lg}px;
          padding: ${theme.spacing["2xl"]}px ${theme.spacing.xl}px;
          display:flex;
          flex-direction:column;
          align-items:center;
          text-align:center;
          gap:${theme.spacing.sm}px;
        }
        .ss-empty__icon{
          width: 54px;
          height: 54px;
          border-radius: ${theme.radii.lg}px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-weight: 900;
          font-size: 20px;
          color: ${theme.colors.text};
          background: ${theme.gradients.primarySoft};
          border: 1px solid rgba(99,102,241,0.20);
          box-shadow: ${theme.colors.shadowSm};
        }
        .ss-empty__title{
          margin-top:${theme.spacing.sm}px;
          font-size: 14px;
          font-weight: 900;
          color: ${theme.colors.text};
          letter-spacing: 0.2px;
        }
        .ss-empty__desc{
          max-width: 520px;
          font-size: 12.5px;
          color: ${theme.colors.mutedText};
          font-weight: 700;
          line-height: 1.6;
        }
        .ss-empty__actions{
          margin-top:${theme.spacing.md}px;
          display:flex;
          gap:${theme.spacing.md}px;
          flex-wrap:wrap;
          justify-content:center;
        }
      `}</style>
    </div>
  );
}
