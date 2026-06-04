export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Scan: undefined;
  Library: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  CertDetail: { id: string };
  ScanPreview: { uri: string; source: 'scan' | 'gallery' };
  Print: { id?: string };
  Verify: undefined;
};
