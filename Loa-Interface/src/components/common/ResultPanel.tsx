import type { LoaResult } from "@/lib/loaClient";
import { Separator } from "@/components/ui/separator";
import { JsonViewer } from "@/components/common/JsonViewer";

type ResultPanelProps = {
  result: LoaResult<unknown> | null;
  hint?: string;
};

export function ResultPanel({ result, hint }: ResultPanelProps) {
  if (!result) {
    return (
      <div className="rounded border border-dashed bg-muted/40 p-3 text-xs text-muted-foreground">
        Result will appear here after running the tool.
      </div>
    );
  }

  if (!result.ok) {
    return (
      <div className="space-y-2 rounded border border-destructive/50 bg-destructive/10 p-3 text-xs">
        <div className="font-semibold text-destructive">Error</div>
        <div className="text-destructive">{result.error}</div>
      </div>
    );
  }

  const data = result.data;
  const isHslColorString =
    typeof data === "string" &&
    /^hsl\(\s*\d+(\.\d+)?\s*,\s*\d+%?\s*,\s*\d+%?\s*\)$/i.test(data);

  return (
    <div className="space-y-2 rounded border border-muted-foreground/30 bg-background p-3">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-muted-foreground">Result</span>
        {hint && (
          <span className="text-[11px] text-muted-foreground">{hint}</span>
        )}
      </div>
      <Separator />
      {isHslColorString && (
        <div className="flex items-center justify-between gap-3 rounded-md border border-muted-foreground/40 bg-muted/30 p-2">
          <div className="flex items-center gap-2">
            <div
              className="h-6 w-6 rounded-md border border-muted-foreground/50 shadow-sm"
              style={{ background: data as string }}
            />
            <span className="text-[11px] font-medium text-muted-foreground">
              Color preview
            </span>
          </div>
          <span className="truncate text-[11px] text-muted-foreground">
            {data as string}
          </span>
        </div>
      )}
      <JsonViewer value={data} />
    </div>
  );
}
