import type { Loa } from "./loa.ts";
import loa from "./loa.ts";

export type LoaWarning = {
  color: string;
  messages: unknown[];
};

export type LoaResult<T> =
  | { ok: true; data: T; warnings?: LoaWarning[] }
  | { ok: false; error: string; warnings?: LoaWarning[] };

function wrapCall<T>(fn: () => T): LoaResult<T> {
  const capturedWarnings: LoaWarning[] = [];
  const originalLog = console.log;

  try {
    // Intercept console.log to capture LOA warnings
    // WARNING_PREFIX in core: "%cWarning from Lunar Orbiter Algorithms [jercom.io]:"
    console.log = (...args: unknown[]) => {
      const [first, second, ...rest] = args;

      if (
        typeof first === "string" &&
        first.startsWith("%cWarning from Lunar Orbiter Algorithms")
      ) {
        const color = typeof second === "string" ? second : "";
        capturedWarnings.push({
          color,
          messages: rest,
        });
      }

      originalLog(...args);
    };

    const data = fn();

    if (capturedWarnings.length > 0) {
      return { ok: true, data, warnings: capturedWarnings };
    }

    return { ok: true, data };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unexpected error while calling LOA API";

    if (capturedWarnings.length > 0) {
      return { ok: false, error: message, warnings: capturedWarnings };
    }

    return { ok: false, error: message };
  } finally {
    console.log = originalLog;
  }
}

const client = loa as Loa;

export const loaClient = {
  capitalize(params: { value?: string }): LoaResult<string | undefined> {
    return wrapCall(() => client.capitalize(params.value));
  },

  stringToSlug(params: { value: string }): LoaResult<string | undefined> {
    return wrapCall(() => client.stringToSlug(params.value));
  },

  dateToTimestamp(params: { value: string }): LoaResult<number[] | undefined> {
    return wrapCall(() => client.dateToTimestamp(params.value));
  },

  permutation(params: {
    items: string[];
    pattern: number[];
  }): LoaResult<string[] | undefined> {
    return wrapCall(() => client.permutation(params.items, params.pattern));
  },

  updateString(params: {
    source: string;
    pattern: string;
    replacement: string;
    useRegex?: boolean;
  }): LoaResult<string | undefined> {
    return wrapCall(() => {
      const value = params.useRegex
        ? new RegExp(params.pattern, "g")
        : params.pattern;
      return client.updateString(params.source, value, params.replacement);
    });
  },

  splitUUIDAndPrefixed(params: {
    uuid: string;
    prefix?: string;
  }): LoaResult<string | undefined> {
    return wrapCall(() =>
      client.splitUUIDAndPrefixed(params.uuid, params.prefix),
    );
  },

  goldenRatioRound(): LoaResult<ReturnType<Loa["goldenRatioRound"]>> {
    return wrapCall(() => client.goldenRatioRound());
  },

  fibonacciRectDraw(params: {
    width: string;
    borderStyle?: string;
    borderRadiusStyle?: string;
    bgStyle?: string;
    transformStyle?: string;
  }): LoaResult<ReturnType<Loa["fibonacciRectDraw"]>> {
    return wrapCall(() =>
      client.fibonacciRectDraw(
        params.width,
        params.borderStyle,
        params.borderRadiusStyle,
        params.bgStyle,
        params.transformStyle,
      ),
    );
  },

  strBetweenSpecialChar(params: {
    pattern: string;
    char: string;
    tagBoolean: boolean;
    tagName: string;
  }): LoaResult<string | void> {
    return wrapCall(() =>
      client.strBetweenSpecialChar(
        params.pattern,
        params.char,
        params.tagBoolean,
        params.tagName,
      ),
    );
  },
};
