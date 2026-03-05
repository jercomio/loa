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

  return (
    <div className="space-y-2 rounded border border-muted-foreground/30 bg-background p-3">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-muted-foreground">Result</span>
        {hint && (
          <span className="text-[11px] text-muted-foreground">{hint}</span>
        )}
      </div>
      <Separator />
      <JsonViewer value={result.data} />
    </div>
  );
}
