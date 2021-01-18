import { verifyNoOverDraftGoal } from "./no-overdraft-goal";
import { FimAccount, FimGoalResult } from "../model";
import { createMock } from "../test-helpers";

const testOverdraft = (
    testData: [string, number][],
) => {
    const accounts = testData.map(
        ([name, balance]) => 
        createMock<FimAccount>({
            getName: () => name,
            getBalance: () => balance,
            // TODO - When more types are supported, we need to test for it.
            getType: () => "debit",
        })
    );
    const verify = verifyNoOverDraftGoal(accounts);
    const actual = verify(new Date());
    return actual;
}

describe("goals/no-overdraft-goal", () => {
    it("handles basic overdraft", () => {
        const actual = testOverdraft(
            [
                ["Account A", 1000],
                ["Account B", -1000],
                ["Account C", 1000],
            ]
        );
        expect(actual).toMatchObject<FimGoalResult>({
            message: "Account [Account B] is overdraft.",
            type: "failed"
        })
    });
    it("handles basic no overdraft", () => {
        const actual = testOverdraft(
            [
                ["Account A", 1000],
                ["Account B", 1000],
                ["Account C", 1000],
            ]
        );
        expect(actual).toMatchObject<FimGoalResult>({ type: "passed" });
    });
});