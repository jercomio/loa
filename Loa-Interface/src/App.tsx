import { useState } from "react";
import "./index.css";

import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { LoaExplorer } from "@/features/loa/LoaExplorer";
import { categories, type ToolCategoryId } from "@/features/loa/loaRegistry";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type CategoryDocItem = {
  name: string;
  summary: string;
  example?: string;
  badge?: string;
};

type CategoryDocConfig = {
  title: string;
  subtitle: string;
  items: CategoryDocItem[];
};

const CATEGORY_DOCS: Record<ToolCategoryId, CategoryDocConfig> = {
  strings: {
    title: "String helpers",
    subtitle:
      "Helpers to normalize, capitalize and update strings before sending them to your APIs or UI.",
    items: [
      {
        name: "capitalize(str)",
        badge: "Utility",
        summary:
          "Extracts and uppercases the first letter of a string. Useful for titles, labels or names.",
        example: `import loa from "loa.ts";

const title = "hello world";
const result = loa.capitalize(title);
// result => "Hello world"`,
      },
      {
        name: "stringToSlug(str)",
        badge: "Normalization",
        summary:
          "Converts a simple string to a URL-friendly slug: lowercase, accents stripped, spaces replaced by dashes.",
        example: `const raw = "Hôtel & Spa, all inclusive.";
const slug = loa.stringToSlug(raw);
// slug => "hotel-&-spa-all-inclusive"`,
      },
      {
        name: "updateString(a, value, b)",
        badge: "Search & replace",
        summary:
          "Replaces a pattern inside a string. The pattern can be a string or a regular expression.",
        example: `const source = "The quick brown fox jumps over the lazy dog.";
const result1 = loa.updateString(source, "fox", "cat");
// "The quick brown cat jumps over the lazy dog."

const result2 = loa.updateString(source, /brown\\s+fox/, "red fox");
// "The quick red fox jumps over the lazy dog."`,
      },
    ],
  },
  dates: {
    title: "Dates & timestamps",
    subtitle:
      "Convert JavaScript dates or ISO strings into timestamps that are easier to compare and persist.",
    items: [
      {
        name: "dateToTimestamp(date)",
        badge: "Time utilities",
        summary:
          "Converts a date (string or Date) into an array containing a single timestamp (number of milliseconds).",
        example: `const created = "2026-03-03T10:15:00Z";
const publish = "2026-03-04T08:00:00Z";

const [createdTs] = loa.dateToTimestamp(created) ?? [];
const [publishTs] = loa.dateToTimestamp(publish) ?? [];

if (createdTs < publishTs) {
  // content can be published
}`,
      },
    ],
  },
  permutation: {
    title: "Permutation engine",
    subtitle:
      "Reorder items using a numeric pattern such as [14, 23, 32, 41] for deterministic shuffles.",
    items: [
      {
        name: "permutation(a, b)",
        badge: "Reordering",
        summary:
          "Permutes items of an array using a numeric pattern. Each entry in the pattern controls which index is selected.",
        example: `const items = ["item1", "item2", "item3", "item4"];
const pattern = [14, 23, 32, 41];

const ordered = loa.permutation(items, pattern);
// ordered => ["item4", "item3", "item2", "item1"]`,
      },
    ],
  },
  ids: {
    title: "Identifiers",
    subtitle:
      "Compact identifiers generated from UUIDs, numbers or short strings with optional prefixes, plus deterministic passwords from email + image.",
    items: [
      {
        name: "splitUUIDAndPrefixed(uuid, prefix?)",
        badge: "ID shortening",
        summary:
          "Extracts a short id from a UUID or any string/number and optionally prefixes it.",
        example: `const uuid1 = "d3da48a57-18a805cb3dce-c9d52491401";
const uuid2 = 1234;
const uuid3 = "test";
const prefix = "jercom";

const id1 = loa.splitUUIDAndPrefixed(uuid1, prefix);
// "jercom_d3da48a57"

const id2 = loa.splitUUIDAndPrefixed(uuid2, prefix);
// "jercom_1234xxxx" (short id based on Date.now)

const id3 = loa.splitUUIDAndPrefixed(uuid3, prefix);
// "jercom_testxxxx"`,
      },
      {
        name: "generatePasswordFromEmailAndImage(email, imageBytes)",
        badge: "Password",
        summary:
          "Builds a deterministic password-like string from a user email and the binary content of a PNG/JPG image (limited to 10 MB).",
        example: `import loa from "loa.ts";

// In a browser context:
async function fromFile(email, file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const password = loa.generatePasswordFromEmailAndImage(email, bytes);
  // password is a 24-character deterministic string
}`,
      },
    ],
  },
  golden: {
    title: "Golden ratio",
    subtitle:
      "Explore phi (ϕ) and its rounded variant ϕ(r) using a dedicated helper with console output.",
    items: [
      {
        name: "goldenRatioRound()",
        badge: "Math / visualization",
        summary:
          "Returns an object describing the golden ratio and a rounded variant. Logs the derivation in the console.",
        example: `const phiObject = loa.goldenRatioRound();

// phiObject.phi[0]    -> { codeName: "ϕ", value: number }
// phiObject.phiRound[0] -> { codeName: "ϕ(r)", value, constant, formula }`,
      },
    ],
  },
  fibonacci: {
    title: "Fibonacci rectangle",
    subtitle:
      "Generate inline styles for golden rectangles usable directly inside React or Next.js components.",
    items: [
      {
        name: "fibonacciRectDraw(width, border?, radius?, background?, transform?)",
        badge: "Layout",
        summary:
          "Builds a style object for a Fibonacci rectangle, validating width and units with helpful console warnings.",
        example: `const rectStyle = loa.fibonacciRectDraw(300, "1px solid #999", "0", "#999");

// In React / Next.js:
// <div style={rectStyle} />`,
      },
    ],
  },
  markdown: {
    title: "Markdown & HTML tags",
    subtitle:
      "Wrap a substring between special markers (like ##text##) with a safe HTML tag, without injecting raw HTML directly.",
    items: [
      {
        name: "strBetweenSpecialChar(pattern, char, tagBoolean, tagName)",
        badge: "Formatting",
        summary:
          "Transforms markers into HTML tags and logs guidance to the console. Ideal for styling specific words in Markdown.",
        example: `const pattern =
  "Voici un ##texte## comprenant des ##mots en couleur##";

const result = loa.strBetweenSpecialChar(pattern, "##", true, "span");
// result => "Voici un <span>texte</span> comprenant des <span>mots en couleur</span>"

// In React:
// <div dangerouslySetInnerHTML={{ __html: result ?? "" }} />`,
      },
    ],
  },
  colors: {
    title: "Colors & visualization",
    subtitle:
      "Generate deterministic HSL colors from arbitrary strings to keep your UI palettes consistent.",
    items: [
      {
        name: "stringToHslColor(content, hueRange?, saturation?, lightness?)",
        badge: "Color",
        summary:
          "Maps any string to a stable HSL color. Optionally constrain the hue range and tweak saturation/lightness for different themes.",
        example: `const color = loa.stringToHslColor("User A", [120, 240], 65, 50);
// color => "hsl(178, 65%, 50%)" (example value)

// In React / Next.js:
// <div style={{ backgroundColor: color }}>User A</div>`,
      },
    ],
  },
};

type CategoryDocsContentProps = {
  category: ToolCategoryId;
};

function CategoryDocsContent({ category }: CategoryDocsContentProps) {
  const config = CATEGORY_DOCS[category];

  if (!config) return null;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-primary/70">
          Lunar Orbiter Algorithms
        </p>
        <p className="text-sm text-muted-foreground">{config.subtitle}</p>
      </div>
      <div className="space-y-3">
        {config.items.map((item) => (
          <div
            key={item.name}
            className="rounded-md border bg-muted/50 p-3 text-xs"
          >
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span className="font-semibold text-foreground">{item.name}</span>
              {item.badge ? (
                <span className="inline-flex shrink-0 items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {item.summary}
            </p>
            {item.example ? (
              <pre className="mt-2 max-h-40 overflow-auto rounded-md border border-border bg-muted px-3 py-2 text-[11px] leading-relaxed text-foreground shadow-sm">
                <code>{item.example}</code>
              </pre>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

const MD_BREAKPOINT = "(min-width: 768px)";

function App() {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ToolCategoryId | null>(
    null,
  );
  const isDesktop = useMediaQuery(MD_BREAKPOINT);

  const handleOpenDocs = (categoryId: ToolCategoryId) => {
    setActiveCategory(categoryId);
    setOpen(true);
  };

  const handleCloseDocs = () => {
    setOpen(false);
  };

  const activeCategoryLabel =
    categories.find((c) => c.id === activeCategory)?.label ?? "";

  return (
    <>
      <AppShell
        header={<TopBar />}
        sidebar={
          <nav className="flex flex-col gap-1 text-sm">
            <span className="px-2 text-sm font-semibold text-muted-foreground mb-4">
              Documentation
            </span>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleOpenDocs(category.id)}
                className={`rounded-md px-2 py-1 text-left text-foreground/70 transition hover:bg-accent hover:text-accent-foreground ${
                  activeCategory === category.id
                    ? "bg-accent text-accent-foreground"
                    : ""
                }`}
              >
                {category.label}
              </button>
            ))}
          </nav>
        }
      >
        <LoaExplorer />
      </AppShell>

      {activeCategory ? (
        isDesktop ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-fit">
              <DialogHeader>
                <DialogTitle>{CATEGORY_DOCS[activeCategory].title}</DialogTitle>
                <DialogDescription>
                  Documentation for the{" "}
                  <span className="font-semibold">{activeCategoryLabel}</span>{" "}
                  category based on the core <code>loa.ts</code> library.
                </DialogDescription>
              </DialogHeader>
              <CategoryDocsContent category={activeCategory} />
              <DialogFooter className="mt-4">
                <Button
                  variant="outline"
                  className="text-foreground"
                  onClick={handleCloseDocs}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{CATEGORY_DOCS[activeCategory].title}</DrawerTitle>
                <DrawerDescription>
                  Documentation for the{" "}
                  <span className="font-semibold">{activeCategoryLabel}</span>{" "}
                  category powered by <code>loa.ts</code>.
                </DrawerDescription>
              </DrawerHeader>
              <div className="mt-3">
                <CategoryDocsContent category={activeCategory} />
              </div>
              <DrawerFooter>
                <Button
                  variant="outline"
                  className="text-foreground"
                  onClick={handleCloseDocs}
                >
                  Close
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )
      ) : null}
    </>
  );
}

export default App;
