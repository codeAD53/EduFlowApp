import { env } from "node:process";
import pino from "pino";
export const logger = pino(
    env.NODE_ENV === 'development' ? {
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true
        }
    }
}: {});