import { useMemo, type CSSProperties } from "react";

export type BorderRadiusPairInput = {
  outerRadius: number;
  distance: number;
  unit?: string;
};

export type BorderRadiusPair = {
  outerRadius: number;
  innerRadius: number;
  distance: number;
  unit: string;
  outerStyle: CSSProperties;
  innerStyle: CSSProperties;
};

/**
 * Enforce R1 (outer) + D (distance) = R2 (inner).
 */
export function useBorderRadiusPair(
  input: BorderRadiusPairInput,
): BorderRadiusPair {
  const { outerRadius, distance, unit = "px" } = input;

  return useMemo(() => {
    const innerRadius = outerRadius + distance;
    const outerValue = `${outerRadius}${unit}`;
    const innerValue = `${innerRadius}${unit}`;

    const outerStyle: CSSProperties = { borderRadius: outerValue };
    const innerStyle: CSSProperties = { borderRadius: innerValue };

    return {
      outerRadius,
      innerRadius,
      distance,
      unit,
      outerStyle,
      innerStyle,
    };
  }, [outerRadius, distance, unit]);
}
