import { FimReccurance } from "../model";
import { createMontlyReccurance } from "./montly-recurrence";

const testRecurrence = (
  recurrence: FimReccurance,
  testData: [string, boolean][]
) => {
  for (const [dateString, expected] of testData) {
    const date = new Date(dateString);
    const actual = recurrence.occursOn(date);
    expect(actual).toBe(expected);
  }
};

describe("recurrences/montly-recurrence", () => {
  // It does actually get expected in `testRecurrence`
  // eslint-disable-next-line jest/expect-expect
  it("handles normal dates", () => {
    testRecurrence(createMontlyReccurance(15), [
      ["2000/10/01", false],
      ["2000/10/02", false],
      ["2000/10/03", false],
      ["2000/10/04", false],
      ["2000/10/05", false],
      ["2000/10/06", false],
      ["2000/10/07", false],
      ["2000/10/08", false],
      ["2000/10/09", false],
      ["2000/10/10", false],
      ["2000/10/11", false],
      ["2000/10/12", false],
      ["2000/10/13", false],
      ["2000/10/14", false],
      ["2000/10/15", true],
      ["2000/10/16", false],
      ["2000/10/17", false],
      ["2000/10/18", false],
      ["2000/10/19", false],
      ["2000/10/20", false],
      ["2000/10/21", false],
      ["2000/10/22", false],
      ["2000/10/23", false],
      ["2000/10/24", false],
      ["2000/10/25", false],
      ["2000/10/26", false],
      ["2000/10/27", false],
      ["2000/10/28", false],
      ["2000/10/29", false],
      ["2000/10/30", false],
      ["2000/10/31", false],
    ]);
  });
});
