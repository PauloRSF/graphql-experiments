import { pino } from "pino";

export const logger = pino({ level: process.env.LOG_LEVEL ?? "trace" });

type LogLevels = "trace" | "debug" | "info" | "error" | "warn";

export type Logger = Record<LogLevels, typeof console.log>;
