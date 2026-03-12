#!/usr/bin/env node

// Simple CLI for the Lunar Orbiter Algorithms library.
// It calls the compiled dist/loa.js so you can test each function from the terminal.

import fs from "node:fs";

let loa;

try {
  ({ default: loa } = await import("../dist/loa.js"));
} catch (err) {
  console.error(
    [
      "Unable to load '../dist/loa.js'.",
      "Make sure you ran 'npm run build' at the project root before using this CLI.",
      `Underlying error: ${err}`,
    ].join("\n"),
  );
  process.exit(1);
}

const [, , command, ...args] = process.argv;

const print = (value) => {
  if (typeof value === "string" || typeof value === "number") {
    // Primitive values are printed directly.
    console.log(value);
  } else {
    // Objects / arrays are printed as pretty JSON to keep output readable.
    console.log(JSON.stringify(value, null, 2));
  }
};

const showHelp = () => {
  console.log(
    [
      "Lunar Orbiter Algorithms CLI",
      "",
      "Usage:",
      "  node cli/loa-cli.mjs <command> [...args]",
      "",
      "Commands:",
      "  capitalize <text...>                             Capitalize first letter of the given text",
      "  slug <text...>                                   Convert a string to a slug",
      "  date-to-timestamp <date>                         Convert a date string to timestamp array",
      "  permutation <items> <indices>                    Permute an array via index codes",
      "                                                   items  : comma-separated list (e.g. item1,item2,item3)",
      "                                                   indices: comma-separated list (e.g. 14,23,32,41)",
      "  update-string <a> <value> <b>                    Replace <value> by <b> in string <a>",
      "  split-uuid <uuid> [prefix]                       Split UUID / short id, optional prefix",
      "  string-to-hsl <text...> [hueMin,hueMax] [S] [L]  Generate HSL color from string",
      "  golden-ratio                                     Show golden ratio values object",
      "  fibonacci-rect <width> [border] [radius] [bg] [transform]",
      "                                                   Compute Fibonacci rectangle CSS style object",
      "  str-between <pattern...> <marker> <tagName>      Wrap marker-delimited text with HTML tag",
      '                                                   Example pattern: "Voici un ##texte## en couleur"',
      "  password-from-image <email> <imagePath>         Generate deterministic password from email + image (<= 10MB)",
      "",
      "Examples:",
      '  node cli/loa-cli.mjs capitalize "hello world"',
      '  node cli/loa-cli.mjs slug "Hôtel & Spa, all inclusive."',
      '  node cli/loa-cli.mjs date-to-timestamp "2024-01-01T00:00:00Z"',
      '  node cli/loa-cli.mjs permutation "item1,item2,item3,item4" "14,23,32,41"',
      '  node cli/loa-cli.mjs update-string "a + b = c" "b" "x"',
      '  node cli/loa-cli.mjs split-uuid "d3da48a57-18a805cb3dce-c9d52491401" "jercom"',
      '  node cli/loa-cli.mjs string-to-hsl "Some text" "120,240" 70 45',
      "  node cli/loa-cli.mjs golden-ratio",
      "  node cli/loa-cli.mjs fibonacci-rect 300",
      '  node cli/loa-cli.mjs str-between "Voici un ##texte## en couleur" "##" "span"',
      '  node cli/loa-cli.mjs password-from-image "user@example.com" "./avatar.png"',
      "",
    ].join("\n"),
  );
};

switch (command) {
  case "capitalize": {
    const text = args.join(" ");
    print(loa.capitalize(text));
    break;
  }

  case "slug": {
    const text = args.join(" ");
    print(loa.stringToSlug(text));
    break;
  }

  case "date-to-timestamp": {
    const [date] = args;
    if (!date) {
      console.error("Missing <date> argument.");
      showHelp();
      process.exit(1);
    }
    print(loa.dateToTimestamp(date));
    break;
  }

  case "permutation": {
    const [itemsArg, indicesArg] = args;
    if (!itemsArg || !indicesArg) {
      console.error("Missing <items> or <indices> arguments.");
      showHelp();
      process.exit(1);
    }
    const items = itemsArg.split(",");
    const indices = indicesArg.split(",").map((v) => Number(v));
    print(loa.permutation(items, indices));
    break;
  }

  case "update-string": {
    const [a, value, b] = args;
    if (!a || value === undefined || b === undefined) {
      console.error("Missing arguments for update-string <a> <value> <b>.");
      showHelp();
      process.exit(1);
    }
    print(loa.updateString(a, value, b));
    break;
  }

  case "split-uuid": {
    const [uuid, prefix] = args;
    if (!uuid) {
      console.error("Missing <uuid> argument.");
      showHelp();
      process.exit(1);
    }
    print(loa.splitUUIDAndPrefixed(uuid, prefix));
    break;
  }

  case "string-to-hsl": {
    if (!args.length) {
      console.error(
        "Missing arguments for string-to-hsl <text...> [hueMin,hueMax] [S] [L].",
      );
      showHelp();
      process.exit(1);
    }

    const raw = [...args];

    const isNumberLike = (value) =>
      value !== undefined && value !== "" && !Number.isNaN(Number(value));

    let lightness;
    let saturation;
    let hueRange;

    if (raw.length && isNumberLike(raw[raw.length - 1])) {
      lightness = Number(raw.pop());
    }
    if (raw.length && isNumberLike(raw[raw.length - 1])) {
      saturation = Number(raw.pop());
    }

    if (raw.length) {
      const maybeRange = raw[raw.length - 1];
      if (typeof maybeRange === "string" && maybeRange.includes(",")) {
        const [minStr, maxStr] = maybeRange.split(",");
        const min = Number(minStr);
        const max = Number(maxStr);
        if (!Number.isNaN(min) && !Number.isNaN(max)) {
          hueRange = [min, max];
          raw.pop();
        }
      }
    }

    const text = raw.join(" ");
    if (!text) {
      console.error("Missing <text> argument for string-to-hsl.");
      showHelp();
      process.exit(1);
    }

    const color = loa.stringToHslColor(text, hueRange, saturation, lightness);
    print(color);
    break;
  }

  case "golden-ratio": {
    print(loa.goldenRatioRound());
    break;
  }

  case "fibonacci-rect": {
    const [width, border, radius, bg, transform] = args;
    if (!width) {
      console.error("Missing <width> argument.");
      showHelp();
      process.exit(1);
    }
    const numericWidth = Number.isNaN(Number(width)) ? width : Number(width);
    print(loa.fibonacciRectDraw(numericWidth, border, radius, bg, transform));
    break;
  }

  case "str-between": {
    if (args.length < 3) {
      console.error(
        "Missing arguments for str-between <pattern...> <marker> <tagName>.",
      );
      showHelp();
      process.exit(1);
    }
    const marker = args[args.length - 2];
    const tagName = args[args.length - 1];
    const pattern = args.slice(0, -2).join(" ");
    print(loa.strBetweenSpecialChar(pattern, marker, true, tagName));
    break;
  }

  case "password-from-image": {
    const [email, imagePath] = args;
    if (!email || !imagePath) {
      console.error("Missing <email> or <imagePath> argument.");
      showHelp();
      process.exit(1);
    }

    const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

    let stats;
    try {
      stats = fs.statSync(imagePath);
    } catch (err) {
      console.error(`Unable to read image file at path: ${imagePath}`);
      console.error(String(err));
      process.exit(1);
    }

    if (!stats.isFile()) {
      console.error(`Provided path is not a file: ${imagePath}`);
      process.exit(1);
    }

    if (stats.size > MAX_IMAGE_SIZE_BYTES) {
      console.error(
        `Image is too large. Maximum allowed size is ${MAX_IMAGE_SIZE_BYTES} bytes (10 MB).`,
      );
      process.exit(1);
    }

    const buffer = fs.readFileSync(imagePath);
    const password = loa.generatePasswordFromEmailAndImage(
      email,
      new Uint8Array(buffer),
    );

    if (!password) {
      console.error(
        "Password could not be generated. Check LOA warnings for more details.",
      );
      process.exit(1);
    }

    print(password);
    break;
  }

  case "-h":
  case "--help":
  case undefined:
    showHelp();
    break;

  default:
    console.error(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
}
