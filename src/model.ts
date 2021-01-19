import {
  FimAccountJson,
  FimAccountType,
  FimExpenseJson,
  FimGoalJson,
  FimIncomeJson,
  FimModelJson,
} from "./recurrences/formats/model-json";

export type FimReccurance = {
  occursOn(date: Date): boolean;
};

export type FimAccount = {
  getBalance: () => number;
  getName: () => string;
  getType: () => FimAccountType;
  deposit: (name: string, amount: number, date: Date) => void;
  withdraw: (name: string, amount: number, date: Date) => void;
  toJson: () => FimAccountJson;
};

export type FimExpense = {
  getName: () => string;
  getFrom: () => FimAccount;
  getRecurrence: () => FimReccurance;
  toJson: () => FimExpenseJson;
  getAmount: () => number;
};

export type FimIncome = {
  getName: () => string;
  getInto: () => FimAccount;
  getRecurrence: () => FimReccurance;
  getAmount: () => number;
  toJson: () => FimIncomeJson;
};

export type FimGoalResult =
  | {
      type: "passed";
    }
  | {
      type: "failed";
      message: string;
    };

export type FimGoal = {
  getName: () => string;
  verify: (date: Date) => FimGoalResult;
  toJson: () => FimGoalJson;
};

export type FimResult = {
  goal: FimGoal;
  result:
    | {
        type: "passed";
      }
    | {
        type: "failed";
        message: string;
        on: Date;
      };
};

export type FimModel = {
  toJson: () => FimModelJson;
  verify: (start: Date, end: Date) => FimResult[];
};

export const createFimModel = (
  accounts: FimAccount[],
  expenses: FimExpense[],
  incomes: FimIncome[],
  goals: FimGoal[]
): FimModel => {
  return {
    toJson: () => ({
      accounts: accounts.map((account) => account.toJson()),
      expenses: expenses.map((expense) => expense.toJson()),
      goals: goals.map((goal) => goal.toJson()),
      incomes: incomes.map((income) => income.toJson()),
    }),
    verify: (start: Date, end: Date) => {
      const results: FimResult[] = [];
      const goalsToCheck = new Set(goals);
      const current = new Date(start);
      while (current <= end) {
        for (const income of incomes) {
          if (income.getRecurrence().occursOn(current)) {
            income
              .getInto()
              .deposit(income.getName(), income.getAmount(), current);
          }
        }
        for (const expense of expenses) {
          if (expense.getRecurrence().occursOn(current)) {
            expense
              .getFrom()
              .withdraw(expense.getName(), expense.getAmount(), current);
          }
        }
        const newResults: FimResult[] = [];
        for (const goal of goalsToCheck.values()) {
          const goalResult = goal.verify(current);
          if (goalResult.type === "failed") {
            const { type, message } = goalResult;
            newResults.push({
              goal,
              result: {
                message,
                on: new Date(current),
                type,
              },
            });
          }
        }
        for (const result of newResults) {
          goalsToCheck.delete(result.goal);
          results.push(result);
        }
        current.setDate(current.getDate() + 1);
      }
      for (const goal of goalsToCheck.values()) {
        results.push({
          goal,
          result: {
            type: "passed",
          },
        });
      }
      return results;
    },
  };
};
