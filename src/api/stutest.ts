import { get, post } from '../utils/request';
export const stutesList = (params: any) => {
  return get('/api/test/list', params);
};
