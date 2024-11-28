export const ROCKET_CONFIG = {
    BASE_URL: "https://amigurumi-gaur.pikapod.net/api/v1",
    DEFAULT_AUTH: {
        userId: 'qrzRQGpEiGxsSG6M2',
        authToken: 'TkZDG5qK3T1FJiw9N2joUBtNaD8VGQqP3P8jJlHS4rH'
    }
} as const;

// Store auth tokens in memory (consider using a more persistent solution in production)
let authTokens = ROCKET_CONFIG.DEFAULT_AUTH;

export const getHeaders = () => {
  if (!authTokens) {
    throw new Error('Not authenticated');
  }

  return {
    "X-Auth-Token": authTokens.authToken,
    "X-User-Id": authTokens.userId,
    "Content-Type": "application/json"
  };
};

export const setAuthTokens = (tokens: { userId: string; authToken: string }) => {
  authTokens = tokens;
};

export const clearAuthTokens = () => {
  authTokens = ROCKET_CONFIG.DEFAULT_AUTH;
}; 