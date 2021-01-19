import {
  createFimModel,
  FimAccount,
  FimExpense,
  FimGoal,
  FimGoalResult,
  FimIncome,
  FimReccurance,
  FimResult,
} from './model';
import { createMock } from './test-helpers';

const dateToString = (date: Date) => date.toISOString().substr(0, 10);

const testStart = new Date('2000-01-01');
const testEnd = new Date('2000-12-31');

const testOccuranceDates = [
  '2000-02-01',
  '2000-03-01',
  '2000-05-01',
  '2000-08-01',
  '2000-12-01',
];

const testRecurrence = (): FimReccurance => ({
  occursOn: (date: Date) => testOccuranceDates.includes(dateToString(date)),
});

describe('model.verify', () => {
  it('processes income', () => {
    type StatementEntry = {
      name: string;
      amount: number;
      date: string;
    };
    const statement: StatementEntry[] = [];
    const depositMock = jest.fn((name: string, amount: number, date: Date) => {
      statement.push({ name, amount, date: date.toISOString().substr(0, 10) });
    });
    const testAccount = createMock<FimAccount>({
      deposit: depositMock,
    });
    const testIncome = createMock<FimIncome>({
      getAmount: () => 50,
      getInto: () => testAccount,
      getName: () => 'test-income',
      getRecurrence: testRecurrence,
    });
    const model = createFimModel([testAccount], [], [testIncome], []);
    model.verify(testStart, testEnd);
    const expectedStatement: StatementEntry[] = [
      { amount: 50, date: '2000-02-01', name: 'test-income' },
      { amount: 50, date: '2000-03-01', name: 'test-income' },
      { amount: 50, date: '2000-05-01', name: 'test-income' },
      { amount: 50, date: '2000-08-01', name: 'test-income' },
      { amount: 50, date: '2000-12-01', name: 'test-income' },
    ];
    expect(statement).toMatchObject<StatementEntry[]>(expectedStatement);
  });
  it('processes expenses', () => {
    type StatementEntry = {
      name: string;
      amount: number;
      date: string;
    };
    const statement: StatementEntry[] = [];
    const withdrawMock = jest.fn((name: string, amount: number, date: Date) => {
      statement.push({ name, amount, date: date.toISOString().substr(0, 10) });
    });
    const testAccount = createMock<FimAccount>({
      withdraw: withdrawMock,
    });
    const testExpense = createMock<FimExpense>({
      getAmount: () => 50,
      getFrom: () => testAccount,
      getName: () => 'test-expense',
      getRecurrence: testRecurrence,
    });
    const model = createFimModel([testAccount], [testExpense], [], []);
    model.verify(testStart, testEnd);
    const expectedStatement: StatementEntry[] = [
      { amount: 50, date: '2000-02-01', name: 'test-expense' },
      { amount: 50, date: '2000-03-01', name: 'test-expense' },
      { amount: 50, date: '2000-05-01', name: 'test-expense' },
      { amount: 50, date: '2000-08-01', name: 'test-expense' },
      { amount: 50, date: '2000-12-01', name: 'test-expense' },
    ];
    expect(statement).toMatchObject<StatementEntry[]>(expectedStatement);
  });
  describe('processes goals', () => {
    it('passing', () => {
      const testGoal = createMock<FimGoal>({
        verify: () => ({ type: 'passed' }),
      });
      const model = createFimModel([], [], [], [testGoal]);
      const result = model.verify(testStart, testEnd);
      expect(result).toMatchObject<FimResult[]>([
        {
          goal: testGoal,
          result: { type: 'passed' },
        },
      ]);
    });
    it('failing', () => {
      const failingVerifyMock = jest
        .fn<FimGoalResult, []>()
        .mockImplementationOnce(() => ({ type: 'passed' }))
        .mockImplementationOnce(() => ({
          type: 'failed',
          message: 'failed-message',
        }));
      const testFailingGoal = createMock<FimGoal>({
        verify: failingVerifyMock,
      });
      const testPassingGoal = createMock<FimGoal>({
        verify: () => ({ type: 'passed' }),
      });
      const model = createFimModel(
        [],
        [],
        [],
        [testFailingGoal, testPassingGoal]
      );
      const result = model.verify(testStart, testEnd);
      expect(failingVerifyMock).toBeCalledTimes(2);
      expect(result).toHaveLength(2);
      const [failingGoalResult, passingGoalResult] = result;
      if (failingGoalResult.result.type === 'passed') {
        throw new Error();
      }
      expect(dateToString(failingGoalResult.result.on)).toBe('2000-01-02');
      expect(failingGoalResult.result.message).toBe('failed-message');
      expect(passingGoalResult).toMatchObject<FimResult>({
        goal: testPassingGoal,
        result: { type: 'passed' },
      });
    });
  });
});
