import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { ToolField } from "@/features/loa/loaRegistry";
import React from "react";

type FormFieldProps = {
  field: ToolField;
  value: unknown;
  onChange: (value: unknown) => void;
};

export function FormField({ field, value, onChange }: FormFieldProps) {
  const { label, helperText, type, name, placeholder } = field;

  let control: React.ReactNode;

  if (type === "textarea") {
    control = (
      <Textarea
        id={name}
        value={(value as string) ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  } else if (type === "boolean") {
    control = (
      <div className="flex items-center gap-2">
        <Switch
          id={name}
          checked={Boolean(value)}
          onCheckedChange={(next) => onChange(next)}
        />
        <span className="text-xs text-muted-foreground">
          {helperText ?? "Toggle option"}
        </span>
      </div>
    );
  } else {
    control = (
      <Input
        id={name}
        value={(value as string | number | undefined) ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      {type !== "boolean" && control}
      {type === "boolean" && control}
      {helperText && type !== "boolean" && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
