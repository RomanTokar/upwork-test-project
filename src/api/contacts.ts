import queryString from 'query-string';
import axiosInstance from './axiosInstance';

type GetContactsParams = {
  page?: number;
  query?: string;
  countryId?: number;
};

export const getContacts = ({ page, query, countryId }: GetContactsParams) => {
  return axiosInstance.get(`/contacts.json?${queryString.stringify({ page, query, countryId, companyId: 171 })}`);
};
