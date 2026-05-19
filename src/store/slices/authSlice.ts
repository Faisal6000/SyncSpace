import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginData } from '../../domain/model/LoginData';
import { ProfileData } from '../../domain/model/ProfileData';

interface AuthState {
  isAuthenticated: boolean;
  loginData: LoginData | null;
  profileData: ProfileData | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loginData: null,
  profileData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<LoginData>) {
      state.isAuthenticated = true;
      state.loginData = action.payload;
    },
    setProfileData(state, action: PayloadAction<ProfileData>) {
      state.profileData = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.loginData = null;
      state.profileData = null;
    },
  },
});

export const { loginSuccess, setProfileData, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
