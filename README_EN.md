## Lunar Orbiter Algorithms (Loa)

Lunar Orbiter Algorithms (Loa) is a small TypeScript/JavaScript library that groups together several generic algorithms:

- **String helpers**: capitalization, slug generation, pattern replacement
- **Date helper**: timestamp conversion for comparisons
- **Array helper**: controlled permutation of items using a numeric pattern
- **Identifier helper**: UUID/ID shortening with optional prefix
- **Mathematical helper**: golden ratio and a custom rounded golden ratio expression
- **Layout helper**: Fibonacci rectangle style generator for UI components
- **HTML/Markdown helper**: safe extraction of text between special markers with an HTML tag wrapper

An optional **Playground UI** (React + Vite) is provided in the `Loa-Interface` folder to experiment with the functions without writing any code.

---

## 1. Installation & basic usage

### 1.1. Library only

If you use this repository as a library in a Node.js/TypeScript project, the typical workflow is:

```bash
git clone https://github.com/jercom/lunar-orbiter-algorithms.git
cd lunar-orbiter-algorithms
npm install
npm run build
```

Then, in your TypeScript / JavaScript code (assuming you point your bundler/tsconfig to the built output or to `src/loa.ts` directly):

```ts
import loa from "lunar-orbiter-algorithms"; // or from "./src/loa"

const title = loa.capitalize("hello world");
console.log(title); // "Hello world"
```

> **Note**  
> The exact import path depends on how you integrate this repository into your toolchain (published package vs local source).  
> If used locally, a direct relative import such as `import loa from "./src/loa";` is perfectly fine.

### 1.2. Library + Playground interface

The root project contains the algorithms in `src/loa.ts`.  
The `Loa-Interface` subfolder contains a React + Vite application that acts as a **Playground** for the algorithms.

To run the Playground:

```bash
cd Loa-Interface
npm install
npm run dev
```

Then open the URL printed by Vite (typically `http://localhost:5173`) in your browser.  
You will find UI components to test the main Loa functions (inputs, options, live preview, and console warnings).

To build the Playground for production:

```bash
cd Loa-Interface
npm run build
```

---

## 2. API reference – `Loa` interface

All algorithms are exposed through a single object that implements the `Loa` interface:

```ts
export interface Loa {
  capitalize(str?: string): string | undefined;
  stringToSlug(str: string): string | undefined;
  dateToTimestamp(date: string | Date): number[] | undefined;
  permutation(a: string[], b: number[]): string[] | undefined;
  updateString(a: string, value: string | RegExp, b: string): string | undefined;
  splitUUIDAndPrefixed(uuid: string | number, prefix?: string): string | undefined;
  goldenRatioRound(): PhiObject;
  fibonacciRectDraw(
    width: number | string,
    borderStyle?: string,
    borderRadiusStyle?: string,
    bgStyle?: string,
    transformStyle?: string
  ): RectStyleObject | void;
  strBetweenSpecialChar(
    pattern: string,
    char: string,
    tagBoolean: boolean,
    tagName: string
  ): string | void;
}
```

The default export of `src/loa.ts` is an object named `loa` implementing this interface.

```ts
import loa from "./src/loa";
```

Below is a function‑by‑function reference with concrete examples.

---

## 3. String helpers

### 3.1. `capitalize(str?: string): string | undefined`

**Goal**: Return the input string with its first character uppercased.  
If `str` is `undefined` or something goes wrong, `undefined` is returned and a warning is logged in the console.

**Signature**:

- `str` – optional string
- **returns** – capitalized string or `undefined`

**Example**:

```ts
const a = loa.capitalize("hello world"); // "Hello world"
const b = loa.capitalize(); // undefined
```

---

### 3.2. `stringToSlug(str: string): string | undefined`

**Goal**: Convert a human‑readable string to a URL‑friendly slug with:

- lowercase
- space replaced by `-`
- removal of accents and some punctuation (comma, dot)

**Signature**:

- `str` – input string, required
- **returns** – slug string or `undefined` if an error occurs

**Algorithm (simplified)**:

- Lowercase the string
- Normalize to NFD to split accents
- Replace spaces (U+0020) by `-`
- Remove commas, dots and combining diacritical marks

**Example**:

```ts
const input = "Hôtel & Spa, all inclusive.";
const slug = loa.stringToSlug(input);
// "hotel-&-spa-all-inclusive"
```

You can safely feed the result into a router, IDs, or URLs.

---

### 3.3. `updateString(a: string, value: string | RegExp, b: string): string | undefined`

**Goal**: Replace the first occurrence of `value` inside string `a` by string `b`.  
If `value` is a `RegExp`, the standard `String.prototype.replace` semantics apply.

**Signature**:

- `a` – original string
- `value` – string or `RegExp` used as pattern
- `b` – replacement string
- **returns** – updated string or `undefined` on error

**Example**:

```ts
const s1 = loa.updateString("Hello World", "World", "Loa"); // "Hello Loa"

const s2 = loa.updateString("Foo_123_Bar_456", /\d+/g, "X");
// "Foo_X_Bar_456" (only first match)
```

> If you need global replacement, give an explicit global RegExp and post‑process, or call `updateString` several times depending on your use case.

---

## 4. Date helper

### 4.1. `dateToTimestamp(date: string | Date): number[] | undefined`

**Goal**: Convert a `Date` or a date string to an array containing a single timestamp (milliseconds since Unix epoch).  
The function is deliberately conservative: if the date is invalid it logs an **orange warning** and returns `undefined`.

**Signature**:

- `date` – either a `Date` instance or a string parseable by `new Date(...)`
- **returns** – `number[]` containing one element (the timestamp) or `undefined`

**Example**:

```ts
const [createdTs] = loa.dateToTimestamp("2025-01-01T00:00:00Z") ?? [];
const [publishTs] = loa.dateToTimestamp(new Date()) ?? [];

if (createdTs !== undefined && publishTs !== undefined) {
  const isBefore = createdTs < publishTs;
  console.log("Created before publish?", isBefore);
}
```

If the date is invalid:

- a message is logged via the centralized logger
- the function returns `undefined`

---

## 5. Array helper – permutation

### 5.1. `permutation(a: string[], b: number[]): string[] | undefined`

**Goal**: Permute items of array `a` according to a **numeric pattern** in array `b`.  
Each entry of `b` is interpreted to compute an index into `a` using the rule:

```ts
const index = parseInt(rawIndex.toString().substring(1), 10) - 1;
```

That is:

- `rawIndex` is converted to string
- the **first character is dropped**
- the remaining part is parsed as a base‑10 integer
- one is subtracted to get a 0‑based index

If the final index is outside the bounds of `a`, a warning is logged and the element is skipped.

**Signature**:

- `a` – base array of strings
- `b` – pattern of numbers
- **returns** – a new array of strings following the pattern in `b`, or `undefined` on error

**Example**:

```ts
const a = ["item1", "item2", "item3", "item4"];
const b = [14, 23, 32, 41];

const result = loa.permutation(a, b);
// For each element, we take substring from index 1 then minus 1:
// 14 -> "4"  -> 4 - 1 = 3 -> a[3] = "item4"
// 23 -> "3"  -> 3 - 1 = 2 -> a[2] = "item3"
// 32 -> "2"  -> 2 - 1 = 1 -> a[1] = "item2"
// 41 -> "1"  -> 1 - 1 = 0 -> a[0] = "item1"
// => ["item4", "item3", "item2", "item1"]
```

This pattern is especially convenient when you want to **encode permutations as two‑digit numbers**.

---

## 6. Identifier helper – `splitUUIDAndPrefixed`

### 6.1. `splitUUIDAndPrefixed(uuid: string | number, prefix?: string): string | undefined`

**Goal**: Produce a **short ID** from a UUID‑like string or a numeric/string ID, optionally prefixed.

The behavior is:

1. If `uuid` is not a string, it is converted to string.
2. If the string contains a dash (`-`), the part **before the first dash** is used.
3. If there is no dash and the string length is **>= 8**, the first 8 characters are used.
4. If the string length is **< 8**, the function:
   - computes a list of numbers derived from `Date.now()`
   - joins them into a string
   - pads the original ID to reach 8 characters
5. If a non‑empty `prefix` is provided, the final short ID is prefixed with `"<prefix>_"`.

**Signature**:

- `uuid` – string or number
- `prefix` – optional string
- **returns** – short identifier string or `undefined` on error

**Example**:

```ts
const uuid1 = "d3da48a57-18a805cb3dce-c9d52491401";
const uuid2 = 1234;
const uuid3 = "test";
const prefix = "jercom";

const s1 = loa.splitUUIDAndPrefixed(uuid1, prefix);
// "jercom_d3da48a57"

const s2 = loa.splitUUIDAndPrefixed(uuid2, prefix);
// "jercom_<8-char-derived-from-1234-and-time>"

const s3 = loa.splitUUIDAndPrefixed(uuid3, prefix);
// "jercom_<8-char-derived-from-'test'-and-time>"
```

This is useful to generate **short, human‑friendly IDs** for UI components, URLs, or logs while still being connected to the original identifier.

---

## 7. Mathematical helper – golden ratio

### 7.1. Types – `PhiEntry`, `PhiRoundEntry`, `PhiObject`

The golden ratio helper returns a typed object:

```ts
interface PhiEntry {
  codeName: string;
  value: number;
}

interface PhiRoundEntry {
  codeName: string;
  value: number;
  constant: number;
  formula: string;
}

interface PhiObject {
  phi: PhiEntry[];
  phiRound: PhiRoundEntry[];
}
```

### 7.2. `goldenRatioRound(): PhiObject`

**Goal**: Compute and log:

- The classical golden ratio \( \phi = \frac{1 + \sqrt{5}}{2} \)
- A custom rounded golden ratio \( \phi(r) = \sqrt{2} \cdot \ln(\pi) \)
- A constant \( k = \max(\phi, \phi(r)) - \min(\phi, \phi(r)) \)
- A **“corrected”** golden ratio \( \phi = \phi(r) - k \) expressed in the `formula` field

**Signature**:

- **returns** – `PhiObject` with:
  - `phi[0]` – the usual golden ratio
  - `phiRound[0]` – the rounded expression with constants and a formula string

The function also prints to the console the formula and the numerical values.

**Example**:

```ts
const phiObj = loa.goldenRatioRound();

console.log(phiObj.phi[0].codeName, phiObj.phi[0].value);
console.log(phiObj.phiRound[0].codeName, phiObj.phiRound[0].value);
console.log(phiObj.phiRound[0].formula);
```

You can use these values to explore relationships between:

- the golden ratio
- \( \sqrt{2} \)
- \( \pi \)
- the natural logarithm

and to feed visualizations in the Playground UI.

---

## 8. Layout helper – Fibonacci rectangle

### 8.1. Types – `RectStyleObject`

```ts
interface RectStyleObject {
  width: string;
  height: string;
  border?: string;
  borderRadius?: string;
  background?: string;
  transform?: string;
}
```

### 8.2. `fibonacciRectDraw(width, borderStyle?, borderRadiusStyle?, bgStyle?, transformStyle?): RectStyleObject | void`

**Goal**: Compute a rectangle style consistent with Fibonacci / golden ratio relationships.  
The function accepts a **width** with or without unit, normalizes it, and computes the height using a formula derived from:

- Binet’s formula for Fibonacci numbers
- a geometric setup involving vectors and a length \( ||\eta|| \) linked to \( \pi \)

The important points from the docstring:

- width is parsed with:
  - a numeric value
  - a unit from `["px", "vw", "rem", "em", "vh", "%"]`
- height is computed as:

  \[
  \text{height} = -\frac{\text{width} \cdot (1 - \sqrt{5})}{2}
  \]

- an auxiliary length \( \eta \) is computed as:

  \[
  \eta = \sqrt{\text{width}^2 + \left(\frac{2 \cdot \text{width}}{1 + \sqrt{5}}\right)^2}
  \]

- and a second height `h_etha` is computed but currently only kept to avoid TS warnings

**Signature**:

- `width` – number or string, e.g. `300`, `"300px"`, `"50vw"`, `"100"` (no unit)
- `borderStyle` – optional string, default `1px solid #999`
- `borderRadiusStyle` – optional string, default `0`
- `bgStyle` – optional string, default `#999`
- `transformStyle` – optional string, default `none`
- **returns** – `RectStyleObject` or `void` if the arguments are invalid

**Console warnings**:

- If width is provided as a raw number: a **green** log confirming it is valid
- If width is a string without numeric part or without unit: **orange** logs explaining the defaults applied
- If unit is not recognized: **orange** log and default unit is used
- If `width` is `null`/`undefined`: **red** error log

**Example (React / Next.js)**:

```tsx
import loa from "lunar-orbiter-algorithms";

export function GoldenRectDemo() {
  const style = loa.fibonacciRectDraw(300, "1px solid #999", "8px", "#f2f2f2");

  if (!style) return null;

  return <div style={style} />;
}
```

You can expose a Playground control that lets you play with:

- width (value + unit)
- border width/radius
- background color
- transform

and see how the rectangle changes live.

---

## 9. HTML/Markdown helper – `strBetweenSpecialChar`

### 9.1. Concept

`strBetweenSpecialChar` is designed to safely transform segments of a text delimited by a custom marker into HTML tags.  
Typical use case: using a safer alternative to raw HTML inside Markdown, or implementing simple inline markup.

**Example of input**:

- Pattern: `"##Hello## world"`
- Marker: `"##"`
- Target HTML tag: `"span"`
- Option: `tagBoolean = true` (enable tag processing)

Result: `"<span>Hello</span> world"`

### 9.2. Signature

```ts
strBetweenSpecialChar(
  pattern: string,
  char: string,
  tagBoolean: boolean,
  tagName: string
): string | void;
```

**Parameters**:

- `pattern` – input text, can contain zero or more marked segments
- `char` – marker string, e.g. `"##"` or `"**"`
- `tagBoolean` – when `true`, tag processing is enabled; otherwise a **red** warning is logged and no transformation occurs
- `tagName` – HTML tag name used to wrap marked segments, e.g. `"span"`, `"strong"`, `"em"`

**Return value**:

- When `tagBoolean` is `true` and markers are present, returns the transformed string
- Logs info and returns `void` when:
  - the marker is not used in the pattern
  - tagBoolean is `false`

### 9.3. Algorithm overview

1. Basic coherence check:
   - If `pattern` does not contain `char`, a **red** log is emitted and the function returns.
2. Build RegExp instances with a **proper escaped version of the marker**:
   - `start` – detects segments starting right after the marker
   - `end` – detects segments ending right before the marker
   - `patternWithChar` – detects sequences containing both markers
3. Split the pattern into an array of words.
4. For each word:
   - If it contains a start marker but not an end marker:
     - Replace the marker by `<tagName>` at the beginning
   - If it contains an end marker but not a start marker:
     - Replace the marker by `</tagName>` at the end
   - If it contains both:
     - Replace the surrounding markers by `<tagName>` and `</tagName>`
5. Join the array back into a string and log an **orange** info message.

### 9.4. Examples

#### 9.4.1. Basic usage in plain DOM

```ts
const display = document.getElementById("paragraph");
const result = loa.strBetweenSpecialChar(
  "##1## In the beginning...",
  "##",
  true,
  "span"
);

if (display && typeof result === "string") {
  display.innerHTML = result + ".";
}
```

#### 9.4.2. Multiple segments

```ts
const text =
  "This is a ##highlighted## example with ##another highlighted part##.";

const result = loa.strBetweenSpecialChar(text, "##", true, "span");
// "This is a <span>highlighted</span> example with <span>another highlighted part</span>."
```

#### 9.4.3. React usage with `dangerouslySetInnerHTML`

```tsx
import loa from "lunar-orbiter-algorithms";

type Props = { text: string };

export function StyledText({ text }: Props) {
  const formatted = loa.strBetweenSpecialChar(text, "##", true, "span");

  if (typeof formatted !== "string") return null;

  return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
}
```

This is the pattern used in the Playground when rendering user‑provided text with inline styling.

---

## 10. Playground UI – Loa-Interface

The `Loa-Interface` folder contains a **React + Vite** application that serves as a Playground for Loa.

### 10.1. Tech stack

- React 19
- TypeScript
- Vite 7
- Radix UI primitives
- Tailwind CSS 4
- Vitest / Testing Library

Scripts (from `Loa-Interface/package.json`):

- `npm run dev` – start the dev server with HMR
- `npm run build` – TypeScript build then Vite build
- `npm run preview` – preview the production build
- `npm run test` – run tests with Vitest
- `npm run lint` – run ESLint

### 10.2. Running the Playground

```bash
cd Loa-Interface
npm install
npm run dev
```

Open the printed URL (e.g. `http://localhost:5173`) and explore:

- Panels to test each Loa function
- Inputs for parameters
- Live results
- Console logs for warnings and algorithm insights

### 10.3. Suggested usage patterns

- **String utilities**: type a string and see how `capitalize`, `stringToSlug`, and `updateString` behave.
- **Date utility**: pick or type dates to compare timestamps.
- **Permutation**: configure arrays and patterns to visualize reorderings.
- **Golden ratio**: display computed \( \phi \), \( \phi(r) \), and the constant \( k \) and connect them to layouts.
- **Fibonacci rectangle**: bind width/unit sliders to `fibonacciRectDraw` to preview responsive golden rectangles.
- **Special char formatting**: let users type Markdown‑like text with markers (e.g. `"##...##"`) and preview the resulting HTML.

---

## 11. Logging and warnings

Internally, all warnings go through a centralized logger:

```ts
const WARNING_PREFIX =
  "%cWarning from Lunar Orbiter Algorithms [jercom.io]:";

const logLoaWarning = (color: WarningColor, ...messages: unknown[]): void => {
  console.log(WARNING_PREFIX, color, ...messages);
};
```

with `WarningColor` in:

- `"color:red"`
- `"color:orange"`
- `"color:green"`

You can filter or search for `"Lunar Orbiter Algorithms"` in the console to inspect how functions behave on edge‑cases.

---

## 12. License

Lunar Orbiter Algorithms is released under the **MIT License**.

See the license header in `src/loa.ts` or your distribution files for full text.

