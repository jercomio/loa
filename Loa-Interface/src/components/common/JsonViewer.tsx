type JsonViewerProps = {
  value: unknown;
};

export function JsonViewer({ value }: JsonViewerProps) {
  return (
    <pre className="max-h-64 w-full overflow-auto rounded border border-muted-foreground bg-muted/40 p-3 text-xs leading-relaxed">
      {value == null
        ? "null"
        : typeof value === "string"
          ? value
          : JSON.stringify(value, null, 2)}
    </pre>
  );
}
