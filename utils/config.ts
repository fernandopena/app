import { AsyncStorage } from 'react-native';

interface UserPreferences {
  showOnboarding?: boolean;
}

const defaultPreferences: UserPreferences = {
  showOnboarding: true,
};

let _preferences: UserPreferences;

export async function getPreferences(): Promise<UserPreferences> {
  if (!_preferences) {
    const pref = await AsyncStorage.getItem('user_preferences');
    _preferences = pref ? JSON.parse(pref) : defaultPreferences;
  }
  return _preferences;
}

export async function savePreferences(preferences: UserPreferences) {
  const newPreferences = { ..._preferences, ...preferences };
  await AsyncStorage.setItem(
    'user_preferences',
    JSON.stringify(newPreferences),
  );
  _preferences = newPreferences;
}
