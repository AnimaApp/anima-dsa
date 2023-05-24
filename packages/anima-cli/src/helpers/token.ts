import { isDebug } from "./debug";

export class TokenError extends Error {
  constructor(message: string) {
    super('[TokenError]: ' + message);
  }
}

export const getToken = (argv: Record<string, unknown>) => {
  const token = (argv.token ??
    process.env.ANIMA_TEAM_TOKEN ??
    '') as string;
  if (isDebug()) {
    console.log('token =>', token);
  }
  if (!token) throw new TokenError('Token not found');
  return token;
};
