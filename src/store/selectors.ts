import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';

export const selectAllContacts = (state: RootState) => state.contacts.contacts;
export const selectOnlyEven = (state: RootState) => state.contacts.onlyEven;
export const selectLoading = (state: RootState) => state.contacts.loading;
export const selectQuery = (state: RootState) => state.contacts.query;
export const selectHasMore = (state: RootState) => state.contacts.hasMore;

export const selectContacts = createSelector(selectAllContacts, selectOnlyEven, (contacts, onlyEven) =>
  onlyEven ? contacts.filter((contact) => contact.id % 2 === 0) : contacts
);
