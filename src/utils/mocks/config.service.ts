enum ConfigConstants {
  'JWT_EXPIRATION_TIME' = 3600,
}

export const mockedConfigService = {
  get(key: string) {
    return ConfigConstants[key] || null;
  },
};
