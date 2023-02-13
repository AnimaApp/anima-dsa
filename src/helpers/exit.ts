import * as Sentry from "@sentry/node";

export const exitProcess = async (): Promise<never> => {
  await Sentry.close()
  process.exit(1);
}
