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
