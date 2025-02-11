import { QUERY_RESULT_STATUS } from '../config/constants';

export * from './list';
export * from './user';
export * from './film';

export type PromiseAllSettledProps<T> = {
  status: 'fulfilled' | 'rejected';
  value: T;
};

export type QueryResponseProps = {
  status: (typeof QUERY_RESULT_STATUS)[keyof typeof QUERY_RESULT_STATUS];
  data: [];
  errorMessage: string | null;
};
