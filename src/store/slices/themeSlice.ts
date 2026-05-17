import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemePreference } from '../../utils/theme/CustomTheme';

interface ThemeState {
  preference: ThemePreference;
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: { preference: 'system' } as ThemeState,
  reducers: {
    setThemePreference(state, action: PayloadAction<ThemePreference>) {
      state.preference = action.payload;
    },
  },
});

export const { setThemePreference } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
