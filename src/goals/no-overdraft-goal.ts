import { FimAccount, FimGoal } from '../model';

export const verifyNoOverDraftGoal = (
  accounts: FimAccount[]
): FimGoal['verify'] => () => {
  for (const account of accounts) {
    if (account.getType() === 'debit' && account.getBalance() < 0) {
      return {
        type: 'failed',
        message: `Account [${account.getName()}] is overdraft.`,
      };
    }
  }
  return { type: 'passed' };
};
