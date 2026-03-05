import { FormField } from "@/components/common/FormField";
import { ResultPanel } from "@/components/common/ResultPanel";
import { LoaWarningTerminal } from "@/components/common/LoaWarningTerminal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LoaResult } from "@/lib/loaClient";
import { useState } from "react";
import { categories, tools, type ToolCategoryId } from "./loaRegistry";

type ValuesState = Record<string, Record<string, unknown>>;
type ResultsState = Record<string, LoaResult<unknown> | null>;

export function LoaExplorer() {
  const [activeCategory, setActiveCategory] =
    useState<ToolCategoryId>("strings");
  const [values, setValues] = useState<ValuesState>({});
  const [results, setResults] = useState<ResultsState>({});

  const categoryTools = tools.filter(
    (tool) => tool.category === activeCategory,
  );

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
                  </div>
                  <ResultPanel
                    result={results[tool.id] ?? null}
                    hint={
                      tool.id === "goldenRatioRound" ||
                      tool.id === "strBetweenSpecialChar" ||
                      tool.id === "fibonacciRectDraw"
                        ? "Check browser console for extra LOA logs."
                        : undefined
                    }
                  />
                  <LoaWarningTerminal warnings={results[tool.id]?.warnings} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
}
