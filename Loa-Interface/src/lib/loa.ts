/* eslint-disable no-misleading-character-class */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/**
 *
 * --------------------------------------
 * LUNAR ORBITER ALGORITHMS LIBRARY
 * --------------------------------------
 * @author Joël ROURE <contact@jercom.io>
 * @date of creation 11/03/2022
 * @update (the last) 03/03/2026
 * @version 1.5.0
 * @copyright jercom.io 2022-2026
 * @license MIT
 * Copyright (c) 2022-2026, jercom.io
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

type WarningColor = "color:red" | "color:orange" | "color:green";

const WARNING_PREFIX = "%cWarning from Lunar Orbiter Algorithms [jercom.io]:";

const logLoaWarning = (color: WarningColor, ...messages: unknown[]): void => {
  // Centralized logger for the library (keeps original console format)
  console.log(WARNING_PREFIX, color, ...messages);
};

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

interface RectStyleObject {
  width: string;
  height: string;
  border?: string;
  borderRadius?: string;
  background?: string;
  transform?: string;
}

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

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

const sha256 = (message: Uint8Array): Uint8Array => {
  const k = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ]);

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  const originalLength = message.length;
  const bitLength = originalLength * 8;

  const withOne = originalLength + 1;
  const mod64 = withOne % 64;
  const padLength = (mod64 <= 56 ? 56 - mod64 : 56 + (64 - mod64)) + 8;
  const totalLength = withOne + padLength;

  const buffer = new Uint8Array(totalLength);
  buffer.set(message, 0);
  buffer[originalLength] = 0x80;

  const view = new DataView(buffer.buffer);
  const highBits = Math.floor(bitLength / 0x100000000);
  const lowBits = bitLength >>> 0;
  view.setUint32(totalLength - 8, highBits, false);
  view.setUint32(totalLength - 4, lowBits, false);

  const w = new Uint32Array(64);

  for (let offset = 0; offset < totalLength; offset += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      const s0 =
        ((w[i - 15] >>> 7) | (w[i - 15] << 25)) ^
        ((w[i - 15] >>> 18) | (w[i - 15] << 14)) ^
        (w[i - 15] >>> 3);
      const s1 =
        ((w[i - 2] >>> 17) | (w[i - 2] << 15)) ^
        ((w[i - 2] >>> 19) | (w[i - 2] << 13)) ^
        (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let i = 0; i < 64; i++) {
      const S1 =
        ((e >>> 6) | (e << 26)) ^
        ((e >>> 11) | (e << 21)) ^
        ((e >>> 25) | (e << 7));
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + k[i] + w[i]) >>> 0;
      const S0 =
        ((a >>> 2) | (a << 30)) ^
        ((a >>> 13) | (a << 19)) ^
        ((a >>> 22) | (a << 10));
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  outView.setUint32(0, h0, false);
  outView.setUint32(4, h1, false);
  outView.setUint32(8, h2, false);
  outView.setUint32(12, h3, false);
  outView.setUint32(16, h4, false);
  outView.setUint32(20, h5, false);
  outView.setUint32(24, h6, false);
  outView.setUint32(28, h7, false);

  return out;
};

const computeDeterministicPasswordFromEmailAndImage = (
  email: string,
  imageBytes: Uint8Array,
): string => {
  const encoder = new TextEncoder();
  const emailBytes = encoder.encode(email);

  const combined = new Uint8Array(emailBytes.length + imageBytes.length);
  combined.set(emailBytes, 0);
  combined.set(imageBytes, emailBytes.length);

  const digest = sha256(combined);

  // Derive a password-like string from the 32-byte digest.
  const charset =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  const charsetLength = charset.length;

  let password = "";
  for (let i = 0; i < 24; i++) {
    const byte = digest[i % digest.length];
    const idx = byte % charsetLength;
    password += charset.charAt(idx);
  }

  return password;
};

export interface Loa {
  /**
   *
   * @param {string} str
   * @returns
   *
   * This function allows to extract the first letter of a string.
   * Example:
   * str = "Hello World"
   * firstLetter(str) => "H"
   *
   */
  capitalize(str?: string): string | undefined;

  /**
   *
   * @param {string} str
   * @returns
   *
   * Convert a simple string to slug string
   * Example:
   * str = "Hôtel & Spa, all inclusive."
   * slug = "hotel-&-spa-all-incluvive"
   *
   */
  stringToSlug(str: string): string | undefined;

  /**
   *
   * @param {string} date
   * @returns
   *
   * dateToTimestamp
   * Convert a date to timestamp. This function is useful to compare two dates.
   * Example:
   * dateTreatment(createdDate) < dateTreatment(publishDate) ? 'true' : 'false'
   *
   */
  dateToTimestamp(date: string | Date): number[] | undefined;

  // PERMUTATION
  // To permute the ids like you want
  // This function allow to permutate some selected items of an array in an differente order.
  // The variable 'b' is the array contain the permutation values.
  // The variable 'a' is the original array with strings values.
  // const a = ["item1","item2","item3","item4"]
  // Example:
  // const b = [14,23,32,41];
  //
  // Result: ["item4","item3","item2","item1"]
  //
  /**
   *
   * @param {string} a This param must be an array of string
   * @param {number} b This param must be an array of number
   * @returns
   */
  permutation(a: string[], b: number[]): string[] | undefined;

  /**
   *
   * @param a The initial value of string
   * @param value The replacement value: string, number or rationnal expression
   * @param b The new value of string
   * @returns
   */
  updateString(
    a: string,
    value: string | RegExp,
    b: string,
  ): string | undefined;

  /**
   *
   * @param uuid string or number
   * @param prefix string (option)
   * @returns
   *
   * Example:
   * const uuid1 = "d3da48a57-18a805cb3dce-c9d52491401"
   * let uuid2 = 1234
   * let uuid3 = "test"
   * const prefix = "jercom"
   * splitUUIDAndPrefixed(uuid, prefix)
   * results = jercom_d3da48a57 | d3da48a57 | jercom_12347340 | 12345529 | jercom_test3551 | test4266
   */
  splitUUIDAndPrefixed(
    uuid: string | number,
    prefix?: string,
  ): string | undefined;

  /**
   * Generate a deterministic password-like string from an email and image bytes.
   *
   * The same (email, image) pair always produces the same password, and images
   * larger than 10 MB are rejected.
   *
   * @param email User email.
   * @param imageBytes Binary content of the image as Uint8Array.
   */
  generatePasswordFromEmailAndImage(
    email: string,
    imageBytes: Uint8Array,
  ): string | undefined;

  /**
   * Generate a deterministic HSL color from a string.
   *
   * @param content The input string used to derive the color.
   * @param hueRange Optional hue range [minHue, maxHue] in degrees (0–360).
   *                 Defaults to [0, 360]. Values outside 0–360 are accepted
   *                 but will be normalized modulo 360.
   * @param saturation Optional saturation percentage (0–100). Defaults to 65.
   * @param lightness Optional lightness percentage (0–100). Defaults to 50.
   * @returns The CSS `hsl(H, S%, L%)` color string.
   */
  stringToHslColor(
    content: string,
    hueRange?: [number, number],
    saturation?: number,
    lightness?: number,
  ): string;

  // Special functions
  /**
   * This function return an object with the values about golden number and the golden number round by the mathematical expression.
   * This expression proposed by Joël Roure to connect square root of 2 and Pi number with natural logarithm.
   * @returns
   */
  goldenRatioRound(): PhiObject;

  /**
   *
   * @param {number | string} width
   * @param {string} borderStyle
   * @param {string} borderRadiusStyle
   * @param {string} bgStyle
   * @param {string} transformStyle
   * @returns
   *
   * Example: for React or Next.js component
   * <div style={fibonacciRect(300, '1px solid #999', 'none')}></div>
   *
   * Documentation:
   * Let the vectors λ (lambda) and ή (etha) such that the scalar product of λ by ή is:
   *  ->  ->      ->      ->       -> ->
   *  λ . ή  =  ||λ|| . ||ή||. cos(λ, ή)
   * After calculation, we have:
   *   ->
   * ||ή|| = π/2 √[ width² - height²]
   *
   * If φ = (1 + √5) / 2 and φ = height / width, so height = -(width * (1 - √5)) / 2 the solution of equation system.
   * So, we have:
   *   ->
   * ||ή|| = π/2 √[ width² - ((width * (1 - √5)) / 2)²]
   *
   */
  fibonacciRectDraw(
    width: number | string,
    borderStyle?: string,
    borderRadiusStyle?: string,
    bgStyle?: string,
    transformStyle?: string,
  ): RectStyleObject | void;

  /**
   * Extracting a string between special characters like '##string##'
   * @param {string} pattern
   * @param {string} char
   * @param {boolean} tagBoolean
   * @param {string} tagName
   * @returns
   *
   * @console Documentation
   * This function is more secure than use HTML into Markdown syntax. You can specify yourself the HTML tag that you want to use.
   * You can add an ID and/or a Class.
   * You can activate or disable with the tagBoolean parameter.
   *
   * Some Lunar Orbiter informations or warning added in browser console based on the parameters. Do not hesitate to consult them in the console.
   *
   * Example:
   * const displayNewTag = document.getElementById('paragraph');
   * const result1 = strBetweenSpecialChar("##1## Au commencement, Dieu créa les cieux et la terre.", "##", true, "span");
   * displayNewTag.innerHTML = result1 + '.';
   *
   * const displayNewTag2 = document.getElementById('paragraph2');
   * const result2 = strBetweenSpecialChar("Voici un ##texte## comprenant des ##mots en couleur##", "##", true, "span");
   * displayNewTag2.innerHTML = result2 + '.';
   *
   * To use this function in a React component, you must specify the props: dangerouslySetInnerHTML.
   * Example:
   * const textToChangeInHTMLElement = {
   *  text: "##Text with style## ..."
   * }
   * const format = loa.strBetweenSpecialChar(textToChangeInHTMLElement.text, "##", true, "span");
   * <div key={id} dangerouslySetInnerHTML={{__html: format}}></div>
   *
   */
  strBetweenSpecialChar(
    pattern: string,
    char: string,
    tagBoolean: boolean,
    tagName: string,
  ): string | void;
}

const loa: Loa = {
  capitalize(str?: string): string | undefined {
    try {
      return str ? `${str.charAt(0).toUpperCase()}${str.slice(1)}` : undefined;
    } catch (err) {
      logLoaWarning("color:red", "\ncapitalizeString function", `\n${err}`);
    }
  },

  stringToSlug(str: string): string | undefined {
    try {
      const slug = str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0020]/g, "-")
        .replace(/[\u002c+\u002e+\u0300-\u036f]/g, "");
      return slug;
    } catch (err) {
      logLoaWarning("color:red", "\nstringToSlug function", `\n${err}`);
    }
  },

  dateToTimestamp(date: string | Date): number[] | undefined {
    try {
      const dateTimestamp: number[] = [];
      const publishISODate =
        date instanceof Date ? date : new Date(date as string);
      const time = publishISODate.getTime();

      if (Number.isNaN(time)) {
        logLoaWarning(
          "color:orange",
          "\ndateToTimestamp function",
          "\nInvalid date parameter.",
        );
        return;
      }

      dateTimestamp.push(time);
      return dateTimestamp;
    } catch (err) {
      logLoaWarning("color:red", "\ndateToTimestamp function", `\n${err}`);
    }
  },

  permutation(a: string[], b: number[]): string[] | undefined {
    try {
      if (!Array.isArray(a) || !Array.isArray(b)) {
        logLoaWarning(
          "color:red",
          "\nPermutation function",
          "\nThe type of 'a' or 'b' parameters is wrong",
        );
        return;
      }

      const result: string[] = [];

      for (let i = 0; i < b.length; i++) {
        const rawIndex = b[i];

        if (typeof rawIndex !== "number" || !Number.isFinite(rawIndex)) {
          continue;
        }

        const index = parseInt(rawIndex.toString().substring(1), 10) - 1;

        if (index >= 0 && index < a.length) {
          result.push(a[index]);
        } else {
          logLoaWarning(
            "color:orange",
            "\nPermutation function",
            `\nIndex computed from 'b' is out of range: ${rawIndex}`,
          );
        }
      }

      return result;
    } catch (err) {
      logLoaWarning("color:red", "\nPermutation function", `\n${err}`);
    }
  },

  updateString(
    a: string,
    value: string | RegExp,
    b: string,
  ): string | undefined {
    try {
      const s = a.replace(value, b);
      return s;
    } catch (err) {
      logLoaWarning("color:red", "\nupdateString function", `\n${err}`);
    }
  },

  splitUUIDAndPrefixed(
    uuid: string | number,
    prefix: string = "",
  ): string | undefined {
    try {
      if (typeof uuid !== "string") {
        uuid = uuid.toString();
      }
      let shortId = uuid.split("-")[0];
      if (uuid.match(/[-]/g)) {
        if (prefix) {
          shortId = `${prefix}_${shortId}`;
        }
        return shortId;
      } else if (uuid.length >= 8) {
        shortId = uuid.slice(0, 8);
        if (prefix) {
          shortId = `${prefix}_${shortId}`;
        }
        return shortId;
      } else if (uuid.length < 8) {
        const x: number[] = [];
        const l = 8 - uuid.length;
        const now = Date.now();
        for (let n = 0; n < l; n++) {
          x.push(n * now);
        }
        const y = x.join("").toString();
        shortId = uuid + y.slice(y.length - (8 - uuid.length));
        if (prefix) {
          shortId = `${prefix}_${shortId}`;
        }
        return shortId;
      } else {
        logLoaWarning(
          "color:orange",
          "\nsplitUUIDAndPrefixed function",
          "Error: check your arguments.",
        );
      }
    } catch (err) {
      logLoaWarning("color:red", "\nsplitUUIDAndPrefixed function", `\n${err}`);
    }
  },

  generatePasswordFromEmailAndImage(
    email: string,
    imageBytes: Uint8Array,
  ): string | undefined {
    try {
      if (!email || typeof email !== "string") {
        logLoaWarning(
          "color:red",
          "\ngeneratePasswordFromEmailAndImage function",
          "\nEmail parameter must be a non-empty string.",
        );
        return;
      }

      if (!(imageBytes instanceof Uint8Array)) {
        logLoaWarning(
          "color:red",
          "\ngeneratePasswordFromEmailAndImage function",
          "\nimageBytes parameter must be a Uint8Array.",
        );
        return;
      }

      if (imageBytes.byteLength === 0) {
        logLoaWarning(
          "color:orange",
          "\ngeneratePasswordFromEmailAndImage function",
          "\nImage buffer is empty.",
        );
      }

      if (imageBytes.byteLength > MAX_IMAGE_SIZE_BYTES) {
        logLoaWarning(
          "color:orange",
          "\ngeneratePasswordFromEmailAndImage function",
          `\nImage is too large. Maximum allowed size is ${MAX_IMAGE_SIZE_BYTES} bytes (10 MB).`,
        );
        return;
      }

      return computeDeterministicPasswordFromEmailAndImage(email, imageBytes);
    } catch (err) {
      logLoaWarning(
        "color:red",
        "\ngeneratePasswordFromEmailAndImage function",
        `\n${err}`,
      );
    }
  },
  stringToHslColor(
    content: string,
    hueRange: [number, number] = [0, 360],
    saturation: number = 65,
    lightness: number = 50,
  ): string {
    try {
      const text = content ?? "";

      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        hash = (hash << 5) - hash + charCode;
        hash |= 0;
      }

      let [minHueRaw, maxHueRaw] = hueRange;
      if (!Number.isFinite(minHueRaw)) {
        minHueRaw = 0;
      }
      if (!Number.isFinite(maxHueRaw)) {
        maxHueRaw = 360;
      }

      const minHue = ((minHueRaw % 360) + 360) % 360;
      const maxHue = ((maxHueRaw % 360) + 360) % 360;

      let range = maxHue - minHue;
      if (range === 0) {
        range = 360;
      }

      const normalized = (hash >>> 0) / 0xffffffff;
      const hue = (minHue + normalized * range) % 360;

      return `hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`;
    } catch (err) {
      logLoaWarning("color:red", "\nstringToHslColor function", `\n${err}`);
      return "hsl(0, 0%, 50%)";
    }
  },

  goldenRatioRound(): PhiObject {
    const gValues: number[] = [];
    const phi: number = (1 + Math.sqrt(5)) / 2;
    const phiRound: number = Math.SQRT2 * Math.log(Math.PI);
    gValues.push(phi);
    gValues.push(phiRound);

    gValues.sort((a, b) => b - a);
    const k: number = gValues[0] - gValues[1];
    const newPhi: number = phiRound - k;

    const phiObj: PhiObject = {
      phi: [
        {
          codeName: "\u03C6",
          value: phi,
        },
      ],
      phiRound: [
        {
          codeName: "\u03C6(r)",
          value: phiRound,
          constant: k,
          formula: "\u03C6 = \u03C6(r) - k",
        },
      ],
    };
    console.log(
      `${phiObj.phiRound[0].formula}`,
      `\n${phiObj.phiRound[0].codeName} = ${phiRound} - ${k};
          \n${phiObj.phiRound[0].codeName} = ${newPhi}`,
    );
    console.log(phiObj);
    return phiObj;
  },

  fibonacciRectDraw(
    width: number | string,
    borderStyle?: string,
    borderRadiusStyle?: string,
    bgStyle?: string,
    transformStyle?: string,
  ): RectStyleObject | void {
    const defaultStyleValues = {
      width: 100,
      border: `1px solid #999`,
      borderRadius: `0`,
      background: `#999`,
      transform: `none`,
    };
    if (width !== undefined && width !== null) {
      const units: string[] = ["px", "vw", "rem", "em", "vh", "%"];
      const widthNumber: number[] = [];
      const widthUnit: string[] = [];
      const unitDefault: string = units[0];
      const rgx = {
        number: /^(\d+)+[^(a-zA-Z%)]*/,
        unit: /[^(\d+)]+[a-zA-Z%]*/,
      };

      if (typeof width === "number") {
        widthNumber.push(width);
        widthUnit.push(unitDefault);
        logLoaWarning(
          "color:green",
          `The argument of width is valid: '${widthNumber[0]}${widthUnit[0]}'`,
        );
      } else if (typeof width === "string") {
        // Width value without number
        if (width.match(rgx.number) === null) {
          widthNumber.push(defaultStyleValues.width);
          const unitFromWidth =
            units.indexOf(width) !== -1 ? width : unitDefault;
          widthUnit.splice(0, widthUnit.length, unitFromWidth);
          logLoaWarning(
            "color:orange",
            `No numerical value indicated. A default numerical value '${defaultStyleValues.width}' was applied.`,
          );
        }

        // Width value without unit
        if (width.match(rgx.unit) === null) {
          widthUnit.splice(0, widthUnit.length, unitDefault);
          widthNumber.splice(0, widthNumber.length, parseFloat(width));
          logLoaWarning(
            "color:orange",
            `No unit indicated. A default unit '${unitDefault}' was applied.`,
          );
        }

        // Width value with number and unit
        const valueNumber = width.match(rgx.number);
        const valueUnit = width.match(rgx.unit);
        if (
          valueNumber &&
          valueUnit &&
          width === valueNumber[0] + valueUnit[0]
        ) {
          const numericValue = parseFloat(valueNumber[0]);
          if (units.indexOf(valueUnit[0]) !== -1) {
            const unit: string = units[units.indexOf(valueUnit[0])];
            widthNumber.splice(0, widthNumber.length, numericValue);
            widthUnit.splice(0, widthUnit.length, unit);
            logLoaWarning(
              "color:green",
              `The argument of width is valid: '${widthNumber[0]}${widthUnit[0]}'`,
            );
          } else {
            widthNumber.splice(0, widthNumber.length, numericValue);
            widthUnit.splice(0, widthUnit.length, unitDefault);
            logLoaWarning(
              "color:orange",
              `Unit indicated is not valid. The default unit '${unitDefault}' was applied`,
            );
          }
        }
      }
      /**
       * Binet's formula
       */
      // Height value
      const h: number = -(widthNumber[0] * (1 - Math.sqrt(5))) / 2;

      // Option: retrieve etha value (Pythagore's theorem)
      const etha: number = Math.sqrt(
        Math.pow(widthNumber[0], 2) +
          Math.pow((2 * widthNumber[0]) / (1 + Math.sqrt(5)), 2),
      );
      const h_etha: number = Math.sqrt(
        -Math.pow(widthNumber[0], 2) + Math.pow(etha, 2),
      );
      void h_etha; // keep computed value if needed later, avoid TS unused warning

      const rectStyle: RectStyleObject = {
        width: `calc(${widthNumber[0]} * 1${widthUnit[0]})`,
        height: `calc(${h} * 1${widthUnit[0]})`,
        border:
          borderStyle !== undefined ? borderStyle : defaultStyleValues.border,
        borderRadius:
          borderRadiusStyle !== undefined
            ? borderRadiusStyle
            : defaultStyleValues.borderRadius,
        background:
          bgStyle !== undefined ? bgStyle : defaultStyleValues.background,
        transform:
          transformStyle !== undefined
            ? transformStyle
            : defaultStyleValues.transform,
      };
      return rectStyle;
    } else {
      logLoaWarning("color:red", "Error: The function arguments are invalid.");
    }
  },

  strBetweenSpecialChar(
    pattern: string,
    char: string,
    tagBoolean: boolean,
    tagName: string,
  ): string | void {
    //******************************************** */
    // RegEx options to some specifics treatments
    // const regX1 = /[#]+[\w\s]+[#]*/g
    // const regX2 = /[^#]+[\w\s]+[^#]*/g
    //******************************************** */

    // RegExp rules (general case) but once.
    // const regXStart = new RegExp(`${char}(?=\w)`, 'g');
    // const regXEnd = new RegExp(`(?<=\w)${char}`, 'g');
    // const regXPatternWithChar = new RegExp(`${char}.+?(?:(?!)|${char})`, 'g');

    // Basic coherence check between pattern and marker.
    // If the marker "char" is not present in the pattern at all, it is considered a misuse.
    if (typeof pattern === "string" && typeof char === "string") {
      const hasMarker = pattern.includes(char);

      if (!hasMarker) {
        logLoaWarning(
          "color:red",
          "Marker mismatch in strBetweenSpecialChar.\n",
          "The provided marker:",
          `"${char}"`,
          "\n",
          "is not used inside the pattern:\n",
          `"${pattern}"`,
          "\n\n",
          "Ensure that the marker appears around the text to wrap, e.g.:",
          ` ${char}text${char}`,
        );
        return;
      }
    }

    const escapedChar = escapeRegExp(char);

    // RegExp rules (with Next.js). The general case doesn't work with Next.js
    const regX = {
      start: new RegExp(`${escapedChar}(?=\\w)`, "g"),
      end: new RegExp(`(?<=\\w)${escapedChar}`, "g"),
      patternWithChar: new RegExp(
        `${escapedChar}.+?(?:(?!)|${escapedChar})`,
        "g",
      ),
    };
    //The regular expression /##.+?(?:(?!)|##)/g select '##' and the text between '##' (e.g: ##text##)
    //The regular expression /##.+?(?:(?!))|##/g select only '##' but not text between '##' (e.g: ##  ##)

    // Tag option is enable
    if (tagBoolean === true) {
      // Transform the pattern to array
      const patternToArray = pattern?.split(" ");
      console.log(patternToArray);

      // Treatment of array
      patternToArray?.forEach((n) => {
        const tagBeforeName = `<${tagName}>`;
        const tagAfterName = `</${tagName}>`;

        if (n.match(regX.start) && !n.match(regX.end)) {
          const before = n;
          // Retrieves the index of n from patternToArray
          const indexOfBefore = patternToArray.indexOf(n);
          //console.log(indexOfBefore);

          const beforeToArray = before.split(char);
          //console.log(beforeToArray);
          beforeToArray.splice(0, 1, tagBeforeName);
          const newStrWithBeforeChar = `${beforeToArray[0]}${beforeToArray[1]}`;
          //console.log(newStrWithBeforeChar);

          // Replace the index into patternToArray
          patternToArray.splice(indexOfBefore, 1, newStrWithBeforeChar);
          //console.log(patternToArray);
        }
        if (n.match(regX.end) && !n.match(regX.start)) {
          const after = n;
          // Retrieves the index of n from patternToArray
          const indexOfAfter = patternToArray.indexOf(n);
          //console.log(indexOfAfter);

          const afterToArray = after.split(char);
          //console.log(afterToArray);
          afterToArray.splice(1, 1, tagAfterName);
          const newStrWithAfterChar = `${afterToArray[0]}${afterToArray[1]}`;
          //console.log(newStrWithAfterChar);

          patternToArray.splice(indexOfAfter, 1, newStrWithAfterChar);
          //console.log(patternToArray);
        }
        if (n.match(regX.patternWithChar)) {
          const beforeAfter = n;
          // Retrieves the index of n from patternToArray
          const indexOfBeforeAfter = patternToArray.indexOf(n);
          //console.log(indexOfBeforeAfter);

          const beforeAfterToArray = beforeAfter.split(char);
          //console.log(beforeAfterToArray);
          beforeAfterToArray.splice(0, 1, tagBeforeName) &&
            beforeAfterToArray.splice(2, 1, tagAfterName);
          const newStrWithBeforeAfterChar = `${beforeAfterToArray[0]}${beforeAfterToArray[1]}${beforeAfterToArray[2]}`;
          //console.log(newStrWithBeforeAfterChar);

          patternToArray.splice(
            indexOfBeforeAfter,
            1,
            newStrWithBeforeAfterChar,
          );
          //console.log(patternToArray);
          return patternToArray;
        }
      });

      const newPattern = patternToArray?.join(" ");
      logLoaWarning(
        "color:orange",
        "\nTag option is enable.\nAlgorithm is OK.\n\nThe result of algorithm is: ",
        `${newPattern}`,
        "\nNow, you can add CSS style for HTML tag",
        `${tagName}`,
        ".",
      );
      return newPattern;
    } else {
      //Tag option is disable
      logLoaWarning(
        "color:red",
        "Tag option is disable.\nTo activate the option, add the tagBoolean<type:boolean> and tagName<type:string> parameters.\n\nUsage:\n\nstrBetweenSpecialChar('myString', '##', true, 'span') \nIn this case, the function return: <span>myString</span>",
      );
    }
  },
};

export default loa;
