import { describe, it, expect } from "vitest";
import {
  centsToString,
  sanitizeValue,
  splitAt,
  stringToCents,
  type InputState,
} from "./NumberInputLogic";

describe("centsToString", () => {
  it("formats mixed amounts", () => {
    expect(centsToString(1)).toBe("0.01");
    expect(centsToString(10)).toBe("0.10");
    expect(centsToString(12)).toBe("0.12");
    expect(centsToString(101)).toBe("1.01");
    expect(centsToString(101)).toBe("1.01");
    expect(centsToString(123)).toBe("1.23");
    expect(centsToString(1234)).toBe("12.34");
  });
  it("formats whole amounts", () => {
    expect(centsToString(100)).toBe("1");
    expect(centsToString(200)).toBe("2");
    expect(centsToString(1200)).toBe("12");
  });
  it("turns NaN into empty string", () => {
    expect(centsToString(NaN)).toBe("");
  });
});

describe("stringToCents", () => {
  describe.each([["-"], [""]])("with sign '%s'", (sign) => {
    const signInt = sign === "-" ? -1 : 1;
    it("parses whole amounts to hundreds", () => {
      expect(stringToCents(`${sign}1`)).toBe(signInt * 100);
      expect(stringToCents(`${sign}12`)).toBe(signInt * 1200);
    });
    it("parses mixed amounts", () => {
      expect(stringToCents(`${sign}0.01`)).toBe(signInt * 1);
      expect(stringToCents(`${sign}0.10`)).toBe(signInt * 10);
      expect(stringToCents(`${sign}0.12`)).toBe(signInt * 12);
      expect(stringToCents(`${sign}1.23`)).toBe(signInt * 123);
      expect(stringToCents(`${sign}12.34`)).toBe(signInt * 1234);
    });
    it("parses special cases", () => {
      expect(stringToCents(`${sign}0`)).toBe(signInt * 0);
      expect(stringToCents(`${sign}0.0`)).toBe(signInt * 0);
      expect(stringToCents(`${sign}00.00`)).toBe(signInt * 0);
      expect(stringToCents(`${sign}0.1`)).toBe(signInt * 10);
      expect(stringToCents(`${sign}.10`)).toBe(signInt * 10);
      expect(stringToCents(`${sign}.100`)).toBe(signInt * 10);
      expect(stringToCents(`${sign}.1`)).toBe(signInt * 10);
    });
    it("parses german decimal separator", () => {
      expect(stringToCents(`${sign}0,01`)).toBe(signInt * 1);
      expect(stringToCents(`${sign}0,10`)).toBe(signInt * 10);
      expect(stringToCents(`${sign}0,12`)).toBe(signInt * 12);
      expect(stringToCents(`${sign}1,23`)).toBe(signInt * 123);
      expect(stringToCents(`${sign}12,34`)).toBe(signInt * 1234);
      expect(stringToCents(`${sign}0,0`)).toBe(signInt * 0);
      expect(stringToCents(`${sign}00,00`)).toBe(signInt * 0);
      expect(stringToCents(`${sign}0,1`)).toBe(signInt * 10);
      expect(stringToCents(`${sign},10`)).toBe(signInt * 10);
      expect(stringToCents(`${sign},100`)).toBe(signInt * 10);
      expect(stringToCents(`${sign},1`)).toBe(signInt * 10);
    });
    it("turns empty and invalid values into NaN", () => {
      expect(stringToCents(`${sign}`)).toBe(NaN);
      expect(stringToCents(`${sign}+`)).toBe(NaN);
      expect(stringToCents(`${sign},`)).toBe(NaN);
      expect(stringToCents(`${sign},`)).toBe(NaN);
      expect(stringToCents(`${sign}xxx`)).toBe(NaN);
    });
  });
  it("rounds if needed", () => {
    expect(stringToCents(`0.003458735`)).toBe(0);
    expect(stringToCents(`0.004`)).toBe(0);
    expect(stringToCents(`0.005`)).toBe(1);
    expect(stringToCents(`0.024`)).toBe(2);
    expect(stringToCents(`0.025`)).toBe(3);
    expect(stringToCents(`0.104`)).toBe(10);
    expect(stringToCents(`0.105`)).toBe(11);
    expect(stringToCents(`3.004`)).toBe(300);
    expect(stringToCents(`3.005`)).toBe(301);
    expect(stringToCents(`12345.6789`)).toBe(1234568);
    expect(stringToCents(`987654.321`)).toBe(98765432);

    expect(stringToCents(`-0.003458735`)).toBe(-0);
    expect(stringToCents(`-0.004`)).toBe(-0);
    expect(stringToCents(`-0.005`)).toBe(-0);
    expect(stringToCents(`-0.0051`)).toBe(-1);
    expect(stringToCents(`-0.024`)).toBe(-2);
    expect(stringToCents(`-0.025`)).toBe(-2);
    expect(stringToCents(`-0.0251`)).toBe(-3);
    expect(stringToCents(`-0.104`)).toBe(-10);
    expect(stringToCents(`-0.105`)).toBe(-10);
    expect(stringToCents(`-0.1051`)).toBe(-11);
    expect(stringToCents(`-3.004`)).toBe(-300);
    expect(stringToCents(`-3.005`)).toBe(-300);
    expect(stringToCents(`-3.0051`)).toBe(-301);
    expect(stringToCents(`-12345.6789`)).toBe(-1234568);
    expect(stringToCents(`-987654.321`)).toBe(-98765432);
  });
});

describe("splitAt", () => {
  it("splits", () => {
    expect(splitAt("3456", 0)).toEqual(["", "3456"]);
    expect(splitAt("3456", 1)).toEqual(["3", "456"]);
    expect(splitAt("3456", 2)).toEqual(["34", "56"]);
    expect(splitAt("3456", 3)).toEqual(["345", "6"]);
    expect(splitAt("3456", 4)).toEqual(["3456", ""]);
    expect(splitAt("", 0)).toEqual(["", ""]);
  });
  it("handles overflows gracefully", () => {
    expect(splitAt("3456", 5)).toEqual(["3456", ""]);
    expect(splitAt("3456", -1)).toEqual(["", "3456"]);
  });
  it("handles weird cases gracefully", () => {
    expect(splitAt("3456", NaN)).toEqual(["", "3456"]);
    expect(splitAt("", 1)).toEqual(["", ""]);
    expect(splitAt("", -1)).toEqual(["", ""]);
    expect(splitAt("", NaN)).toEqual(["", ""]);
    expect(splitAt("123", 0.5)).toEqual(["", "123"]);
    expect(splitAt("123", 1.4)).toEqual(["1", "23"]);
    expect(splitAt("123", 1.5)).toEqual(["1", "23"]);
    expect(splitAt("123", 1.999)).toEqual(["1", "23"]);
    expect(splitAt("123", 6.5)).toEqual(["123", ""]);
  });
});

describe("sanitizeValue", () => {
  const makeExample = (valueWithCursor: string): InputState => ({
    value: valueWithCursor.replace("|", ""),
    caretPosition: valueWithCursor.indexOf("|"),
  });
  it("leaves clean values unchanged", () => {
    expect(sanitizeValue(makeExample("1234|"))).toEqual(makeExample("1234|"));
    expect(sanitizeValue(makeExample("12.34|"))).toEqual(makeExample("12.34|"));
    expect(sanitizeValue(makeExample("12,34|"))).toEqual(makeExample("12,34|"));
  });
  it("is okay with empty values", () => {
    expect(sanitizeValue(makeExample("|"))).toEqual(makeExample("|"));
    expect(sanitizeValue(makeExample(".|"))).toEqual(makeExample(".|"));
    expect(sanitizeValue(makeExample(",|"))).toEqual(makeExample(",|"));
  });
  it("removes non-numbers", () => {
    expect(sanitizeValue(makeExample("12a34|"))).toEqual(makeExample("1234|"));
    expect(sanitizeValue(makeExample("12|a34"))).toEqual(makeExample("12|34"));
    expect(sanitizeValue(makeExample("abc|defg"))).toEqual(makeExample("|"));
    expect(sanitizeValue(makeExample("💕|"))).toEqual(makeExample("|"));
    expect(sanitizeValue(makeExample("|🚀"))).toEqual(makeExample("|"));
  });
  it("switches sign when typing minuses", () => {
    expect(sanitizeValue(makeExample("1234-|"))).toEqual(makeExample("-1234|"));
    expect(sanitizeValue(makeExample("1234--|"))).toEqual(makeExample("1234|"));
    expect(sanitizeValue(makeExample("1234---|"))).toEqual(
      makeExample("-1234|"),
    );
    expect(sanitizeValue(makeExample("--|1234"))).toEqual(makeExample("|1234"));
    expect(sanitizeValue(makeExample("-|1234"))).toEqual(makeExample("-|1234"));
  });
  it("makes it positive when typing a plus", () => {
    expect(sanitizeValue(makeExample("-+|1234"))).toEqual(makeExample("|1234"));
    expect(sanitizeValue(makeExample("-1234+|"))).toEqual(makeExample("1234|"));
    expect(sanitizeValue(makeExample("-12+|34"))).toEqual(makeExample("12|34"));
    expect(sanitizeValue(makeExample("1234+|"))).toEqual(makeExample("1234|"));
    expect(sanitizeValue(makeExample("1234-+|"))).toEqual(makeExample("1234|"));
    expect(sanitizeValue(makeExample("1234--+|"))).toEqual(
      makeExample("1234|"),
    );
    expect(sanitizeValue(makeExample("1234---+|"))).toEqual(
      makeExample("1234|"),
    );
  });
  describe.each([[","], ["."]])("with separator '%s'", (separator) => {
    it("moves the separator to the cursor", () => {
      expect(
        sanitizeValue(makeExample(`12${separator}34${separator}|5`)),
      ).toEqual(makeExample(`1234${separator}|5`));
      expect(
        sanitizeValue(makeExample(`12${separator}|34${separator}5`)),
      ).toEqual(makeExample(`12${separator}|345`));
    });
    it("keeps the last separator after the cursor", () => {
      expect(
        sanitizeValue(makeExample(`1|2${separator}34${separator}5`)),
      ).toEqual(makeExample(`1|234${separator}5`));
    });
    it("keeps the last separator before the cursor", () => {
      expect(
        sanitizeValue(makeExample(`12${separator}34${separator}5|6`)),
      ).toEqual(makeExample(`1234${separator}5|6`));
    });
  });
  it("somehow handles crazy values", () => {
    const crazyValue =
      "1a2.,3b45.,.c-def,.,67fgh|.898i.jk7l6..5mno,p43-qr,.s-21t,uv";
    expect(sanitizeValue(makeExample(crazyValue))).toEqual(
      makeExample("-12345,67|8987654321"),
    );
  });
});
