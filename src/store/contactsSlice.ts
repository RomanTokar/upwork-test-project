import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getContacts } from '../api/contacts';
import { RootState } from './index';
import { debounce, pick } from 'lodash-es';

export interface ContactsState {
  contacts: any[];
  onlyEven: boolean;
  query: string;
  hasMore: boolean;
  page: number;
  contactsType: 'all' | 'US';
}

const initialState: ContactsState = {
  contacts: [],
  onlyEven: false,
  query: '',
  hasMore: true,
  page: 1,
  contactsType: 'all',
};

export const counterSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setOnlyEven: (state, action: PayloadAction<boolean>) => {
      state.onlyEven = action.payload;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setContacts: (state, action: PayloadAction<any[]>) => {
      state.contacts = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setContactsType: (state, action: PayloadAction<ContactsState['contactsType']>) => {
      state.contactsType = action.payload;
    },
    setInitialState: () => initialState,
  },
});

const debouncedChangeQuery = debounce((dispatch) => {
  dispatch(setContacts([]));
  dispatch(setPage(1));
  dispatch(setHasMore(true));
  dispatch(fetchContacts());
}, 400);

export const changeQuery = createAsyncThunk<void, ContactsState['query']>(
  'contacts/changeQuery',
  (query, { dispatch }) => {
    dispatch(setQuery(query));
    debouncedChangeQuery(dispatch);
  }
);

export const fetchContacts = createAsyncThunk('contacts/fetchContacts', async (arg, { dispatch, getState }) => {
  const { page, query, contacts, contactsType } = (getState() as RootState).contacts;
  console.log(contactsType);
  const { data } = await getContacts({ page, query, countryId: contactsType === 'US' ? 226 : undefined });
  if (data.contacts_ids.length === 0) {
    dispatch(setHasMore(false));
    return;
  }
  const newContacts = Object.values(pick(data.contacts, data.contacts_ids));
  dispatch(setContacts([...contacts, ...newContacts]));
  dispatch(setPage(page + 1));
});

export const { setOnlyEven, setContacts, setQuery, setPage, setHasMore, setInitialState, setContactsType } =
  counterSlice.actions;

export default counterSlice.reducer;
