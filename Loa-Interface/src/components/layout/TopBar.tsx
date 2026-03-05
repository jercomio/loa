import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function TopBar() {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </div>
  );
}
