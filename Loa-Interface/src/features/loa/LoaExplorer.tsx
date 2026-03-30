import { FormField } from "@/components/common/FormField";
import { LoaWarningTerminal } from "@/components/common/LoaWarningTerminal";
import { ResultPanel } from "@/components/common/ResultPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LoaResult } from "@/lib/loaClient";
import { loaClient } from "@/lib/loaClient";
import { Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { categories, tools, type ToolCategoryId } from "./loaRegistry";

type ValuesState = Record<string, Record<string, unknown>>;
type ResultsState = Record<string, LoaResult<unknown> | null>;
const LIVE_ALPHANUM =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function LoaExplorer() {
  const [activeCategory, setActiveCategory] =
    useState<ToolCategoryId>("strings");
  const [values, setValues] = useState<ValuesState>({});
  const [results, setResults] = useState<ResultsState>({});
  const [liveRunning, setLiveRunning] = useState<Record<string, boolean>>({});
  const [uuidEmail, setUuidEmail] = useState<string>("");
  const [uuidImageFile, setUuidImageFile] = useState<File | null>(null);
  const [uuidImageResult, setUuidImageResult] = useState<LoaResult<
    string | undefined
  > | null>(null);
  const [uuidImageInputKey, setUuidImageInputKey] = useState<number>(0);
  const liveIntervalsRef = useRef<Record<string, number>>({});

  const categoryTools = tools.filter(
    (tool) => tool.category === activeCategory,
  );

  const stopLiveResult = (toolId: string) => {
    const intervalId = liveIntervalsRef.current[toolId];
    if (intervalId !== undefined) {
      window.clearInterval(intervalId);
      delete liveIntervalsRef.current[toolId];
    }
    setLiveRunning((current) => ({ ...current, [toolId]: false }));
  };

  const startLiveResult = (toolId: string, length: number) => {
    stopLiveResult(toolId);

    const safeLength = Math.max(1, Math.floor(length || 16));
    const intervalId = window.setInterval(() => {
      const liveValue = Array.from({ length: safeLength }, () => {
        const index = Math.floor(Math.random() * LIVE_ALPHANUM.length);
        return LIVE_ALPHANUM.charAt(index);
      }).join("");

      setResults((current) => {
        const existing = current[toolId];
        if (!existing || !existing.ok) {
          return current;
        }
        return {
          ...current,
          [toolId]: {
            ok: true,
            data: liveValue,
            warnings: existing.warnings,
          },
        };
      });
    }, 90);

    liveIntervalsRef.current[toolId] = intervalId;
    setLiveRunning((current) => ({ ...current, [toolId]: true }));
  };

  const copyResultString = async (toolId: string) => {
    const result = results[toolId];
    if (!result || !result.ok || typeof result.data !== "string") return;

    const text = result.data;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
      }
    } catch {
      // fallback below
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  useEffect(() => {
    return () => {
      Object.values(liveIntervalsRef.current).forEach((intervalId) => {
        window.clearInterval(intervalId);
      });
      liveIntervalsRef.current = {};
    };
  }, []);

  const handleChange = (toolId: string, fieldName: string, next: unknown) => {
    setValues((current) => ({
      ...current,
      [toolId]: {
        ...(current[toolId] ?? {}),
        [fieldName]: next,
      },
    }));
  };

  const handleReset = (toolId: string) => {
    stopLiveResult(toolId);

    setValues((current) => {
      const next = { ...current };
      delete next[toolId];
      return next;
    });

    setResults((current) => {
      const next = { ...current };
      delete next[toolId];
      return next;
    });
  };

  const handleResetUuidFromImage = () => {
    setUuidEmail("");
    setUuidImageFile(null);
    setUuidImageResult(null);
    setUuidImageInputKey((current) => current + 1);
  };

  const handleRunUuidFromImage = async () => {
    const email = uuidEmail.trim();
    const file = uuidImageFile;

    if (!email || !file) {
      setUuidImageResult({
        ok: false,
        error: "Email and image file are both required.",
      });
      return;
    }

    const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setUuidImageResult({
        ok: false,
        error: "Image is too large. Maximum allowed size is 10 MB.",
      });
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const result = loaClient.generatePasswordFromEmailAndImage({
        email,
        imageBytes: bytes,
      }) as LoaResult<string | undefined>;
      setUuidImageResult(result);
    } catch (error) {
      setUuidImageResult({
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while processing image.",
      });
    }
  };

  const handleRun = (toolId: string) => {
    const tool = tools.find((t) => t.id === toolId);
    if (!tool) return;
    const toolValues = values[toolId] ?? {};

    // Special validation for strBetweenSpecialChar:
    // the marker (char) must be present in the pattern, otherwise it's inconsistent.
    if (toolId === "strBetweenSpecialChar") {
      const pattern = String((toolValues.pattern as string) ?? "");
      const marker = String((toolValues.char as string) || "##");

      if (pattern && marker && !pattern.includes(marker)) {
        setResults((current) => ({
          ...current,
          [toolId]: {
            ok: false,
            error: `Marker "${marker}" is not used inside the pattern. Please use the same marker in the pattern (e.g. ${marker}text${marker}).`,
            warnings: [
              {
                color: "color:red",
                messages: [
                  "UI validation: marker mismatch between Pattern and Marker fields.",
                  `Marker: "${marker}"`,
                  `Pattern: "${pattern}"`,
                ],
              },
            ],
          },
        }));
        return;
      }
    }

    const result = tool.run(toolValues);
    setResults((current) => ({ ...current, [toolId]: result }));

    if (
      toolId === "timeBasedRandomString" &&
      result.ok &&
      typeof result.data === "string"
    ) {
      startLiveResult(toolId, result.data.length);
    } else {
      stopLiveResult(toolId);
    }
  };

  return (
    <Tabs
      value={activeCategory}
      onValueChange={(next) => setActiveCategory(next as ToolCategoryId)}
      className="flex h-full flex-col"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold tracking-tight md:text-2xl">
            LOA playground
          </h1>
          <p className="text-xs text-muted-foreground md:text-sm">
            Try Lunar Orbiter Algorithms functions with real-time results.
          </p>
        </div>
        <TabsList
          variant="default"
          className="w-full justify-start overflow-x-auto md:w-auto"
        >
          {categories.map((cat) => (
            <TabsTrigger
              key={cat.id}
              value={cat.id}
              className="whitespace-nowrap"
            >
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <ScrollArea className="mt-4 h-full rounded-2xl border bg-card border-muted-foreground">
        <TabsContent value={activeCategory} className="m-0">
          <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
            {categoryTools.map((tool) => (
              <Card
                key={tool.id}
                className="flex h-full flex-col border-muted-foreground border-dashed"
              >
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    {tool.label}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    {tool.description}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3">
                  {tool.fields.length > 0 && (
                    <div className="space-y-3">
                      {tool.fields.map((field) => (
                        <FormField
                          key={field.name}
                          field={field}
                          value={
                            (values[tool.id] ?? {})[field.name] ??
                            field.defaultValue
                          }
                          onChange={(next) =>
                            handleChange(tool.id, field.name, next)
                          }
                        />
                      ))}
                    </div>
                  )}
                  <div className="mt-2 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full md:w-auto"
                      onClick={() => handleReset(tool.id)}
                    >
                      Reset
                    </Button>
                    <Button
                      size="sm"
                      className="w-full md:w-auto"
                      onClick={() => handleRun(tool.id)}
                    >
                      Run
                    </Button>
                    {tool.id === "timeBasedRandomString" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full md:w-auto"
                        onClick={() => stopLiveResult(tool.id)}
                        disabled={!liveRunning[tool.id]}
                      >
                        Stop
                      </Button>
                    )}
                  </div>
                  {(() => {
                    const r = results[tool.id];
                    const canCopyStoppedString =
                      tool.id === "timeBasedRandomString" &&
                      !liveRunning[tool.id] &&
                      r !== null &&
                      r !== undefined &&
                      r.ok &&
                      typeof r.data === "string";

                    return (
                      <ResultPanel
                        result={r ?? null}
                        hint={
                          tool.id === "goldenRatioRound" ||
                          tool.id === "strBetweenSpecialChar" ||
                          tool.id === "fibonacciRectDraw"
                            ? "Check browser console for extra LOA logs."
                            : tool.id === "timeBasedRandomString"
                              ? "Live mode enabled: value mutates in real time until Reset."
                              : tool.id === "stringToHslColor"
                                ? "Result is both a raw HSL string and a live color preview."
                                : undefined
                        }
                        action={
                          canCopyStoppedString ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2"
                              onClick={() => void copyResultString(tool.id)}
                            >
                              <Copy className="size-2" />
                            </Button>
                          ) : undefined
                        }
                      />
                    );
                  })()}
                  <LoaWarningTerminal warnings={results[tool.id]?.warnings} />
                </CardContent>
              </Card>
            ))}
            {activeCategory === "ids" && (
              <Card className="flex h-full flex-col border-muted-foreground border-dashed">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    Password from email + image
                  </CardTitle>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    Generate a deterministic password from an email address and
                    a PNG/JPG image (limited to 10 MB).
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3">
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="uuid-email"
                        className="text-sm font-medium text-foreground"
                      >
                        Email
                      </label>
                      <Input
                        id="uuid-email"
                        type="email"
                        placeholder="user@example.com"
                        value={uuidEmail}
                        onChange={(event) => setUuidEmail(event.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="uuid-image"
                        className="text-sm font-medium text-foreground"
                      >
                        Image (PNG or JPG, ≤ 10 MB)
                      </label>
                      <Input
                        key={uuidImageInputKey}
                        id="uuid-image"
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={(event) => {
                          const file =
                            event.target.files && event.target.files[0]
                              ? event.target.files[0]
                              : null;
                          setUuidImageFile(file);
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full md:w-auto"
                      onClick={handleResetUuidFromImage}
                    >
                      Reset
                    </Button>
                    <Button
                      size="sm"
                      className="w-full md:w-auto"
                      onClick={handleRunUuidFromImage}
                    >
                      Run
                    </Button>
                  </div>
                  <ResultPanel
                    result={uuidImageResult}
                    hint="Result is a deterministic password based on email + image bytes."
                  />
                  <LoaWarningTerminal warnings={uuidImageResult?.warnings} />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
}
