export type FimAccountType = 'debit';

export type FimAccountJson = {
  name: string;
  balance: number;
} & {
  type: FimAccountType;
};

export type FimReccurenceJson = {
  type: 'monthly';
  dayOfMonth: number;
};

export type FimExpenseJson = {
  name: string;
  from: string;
  amount: number;
  recurrence: FimReccurenceJson;
};

export type FimIncomeJson = {
  name: string;
  into: string;
  amount: number;
  recurrence: FimReccurenceJson;
};

export type FimGoalJson = {
  name: string;
} & {
  type: 'all-debit-accounts-have-positive-balance';
};

export type FimModelJson = {
  accounts: FimAccountJson[];
  expenses: FimExpenseJson[];
  incomes: FimIncomeJson[];
  goals: FimGoalJson[];
};
