import type { FC } from "react";
import type { LoaWarning } from "@/lib/loaClient";

type LoaWarningTerminalProps = {
  warnings?: LoaWarning[];
};

const colorToClassName = (color: string): string => {
  if (color.includes("red")) return "text-red-400 border-red-500/60";
  if (color.includes("orange")) return "text-orange-300 border-orange-400/60";
  if (color.includes("green")) return "text-emerald-300 border-emerald-400/60";
  return "text-emerald-300 border-emerald-400/40";
};

export const LoaWarningTerminal: FC<LoaWarningTerminalProps> = ({
  warnings,
}) => {
  if (!warnings || warnings.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 rounded-md bg-black px-3 py-2 text-[10px] font-mono leading-relaxed text-emerald-300 shadow-inner">
      <div className="mb-1 text-[9px] uppercase tracking-wide text-emerald-500">
        loa warning (console)
      </div>
      <div className="space-y-1">
        {warnings.map((w, index) => {
          const className = colorToClassName(w.color);
          const textColor = w.color.replace("color:", "");

          return (
            <div
              key={index}
              className={`rounded border-l-2 pl-2 ${className}`}
            >
              <div className="whitespace-pre-wrap">
                <span className={textColor ? "" : undefined}>
                  %cWarning from Lunar Orbiter Algorithms [jercom.io]:
                </span>
              </div>
              {w.messages.map((m, i) => (
                <div
                  key={i}
                  className="whitespace-pre-wrap"
                  style={textColor ? { color: textColor } : undefined}
                >
                  {String(m)}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

