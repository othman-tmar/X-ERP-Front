import { createSelector } from 'reselect';

const selectStorePreventives = state => state.storePreventives;

export const selectPreventives = createSelector(
  [selectStorePreventives],
  storePreventives => storePreventives.preventives
);

export const selectIsLoading = createSelector(
  [selectStorePreventives],
  storePreventives => storePreventives.isLoading
);

export const selectError = createSelector(
  [selectStorePreventives],
  storePreventives => storePreventives.error
);
