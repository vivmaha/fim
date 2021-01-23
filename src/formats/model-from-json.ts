import { verifyNoOverDraftGoal } from "../goals/no-overdraft-goal";
import {
  FimAccountJson,
  FimExpenseJson,
  FimGoalJson,
  FimIncomeJson,
  FimModelJson,
  FimReccurenceJson,
} from "./model-json";
import { createMontlyReccurance } from "../recurrences/montly-recurrence";
import {
  createFimModel,
  FimAccount,
  FimExpense,
  FimGoal,
  FimIncome,
  FimModel,
  FimReccurance,
} from "../model";

export const createAccountFromJson = (json: FimAccountJson): FimAccount => ({
  deposit: (_name, amount) => {
    json.balance += amount;
  },
  withdraw: (_name, amount) => {
    json.balance -= amount;
  },
  getBalance: () => json.balance,
  getName: () => json.name,
  toJson: () => json,
  getType: () => json.type,
});

export const createRecurrenceFromJson = (
  json: FimReccurenceJson
): FimReccurance => {
  switch (json.type) {
    case "monthly":
      return createMontlyReccurance(json.dayOfMonth);
    default:
      throw new Error(`Unknown recurrence type [${json.type}].`);
  }
};

const verifyGoalFromJson = (json: FimGoalJson, accounts: FimAccount[]) => {
  switch (json.type) {
    case "all-debit-accounts-have-positive-balance":
      return verifyNoOverDraftGoal(accounts);
    default:
      throw new Error(`Unknown goal type: [${json.type}]`);
  }
};

const createGoalFromJson = (
  json: FimGoalJson,
  accounts: FimAccount[]
): FimGoal => {
  const verify = verifyGoalFromJson(json, accounts);
  return {
    getName: () => json.name,
    toJson: () => json,
    verify,
  };
};

export const createExpenseFromJson = (
  json: FimExpenseJson,
  getAccount: (name: string) => FimAccount
): FimExpense => {
  const reccurence = createRecurrenceFromJson(json.recurrence);
  const from = getAccount(json.from);
  return {
    getFrom: () => from,
    getName: () => json.name,
    getRecurrence: () => reccurence,
    toJson: () => json,
    getAmount: () => json.amount,
  };
};

export const createIncomeFromJson = (
  json: FimIncomeJson,
  getAccount: (name: string) => FimAccount
): FimIncome => {
  const recurrence = createRecurrenceFromJson(json.recurrence);
  const into = getAccount(json.into);
  return {
    getInto: () => into,
    getName: () => json.name,
    getRecurrence: () => recurrence,
    toJson: () => json,
    getAmount: () => json.amount,
  };
};

export const createFimModelFromJson = (json: FimModelJson): FimModel => {
  const accounts = json.accounts.map(createAccountFromJson);
  const getAccountByName = (() => {
    const accountsMap = new Map(
      accounts.map((account) => [account.getName(), account])
    );
    return (name: string) => {
      const account = accountsMap.get(name);
      if (account === undefined) {
        throw new Error(`Unknown account [${name}].`);
      }
      return account;
    };
  })();
  const expenses = json.expenses.map((expenseJson) =>
    createExpenseFromJson(expenseJson, getAccountByName)
  );
  const incomes = json.incomes.map((incomeJson) =>
    createIncomeFromJson(incomeJson, getAccountByName)
  );
  const goals = json.goals.map((goalJson) =>
    createGoalFromJson(goalJson, accounts)
  );
  return createFimModel(accounts, expenses, incomes, goals);
};
