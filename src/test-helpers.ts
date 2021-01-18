export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export const createMock = <T>(mock: DeepPartial<T>): T => mock as T;
