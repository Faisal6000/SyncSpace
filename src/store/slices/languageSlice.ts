import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LanguageState {
  currentLanguageCode: string;
}

const languageSlice = createSlice({
  name: 'language',
  initialState: { currentLanguageCode: 'en' } as LanguageState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      state.currentLanguageCode = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export const languageReducer = languageSlice.reducer;
