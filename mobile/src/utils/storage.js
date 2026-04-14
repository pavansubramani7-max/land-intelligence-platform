import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@land_iq_token";

export const storage = {
  getToken: () => AsyncStorage.getItem(TOKEN_KEY),
  setToken: (token) => AsyncStorage.setItem(TOKEN_KEY, token),
  removeToken: () => AsyncStorage.removeItem(TOKEN_KEY),
};
