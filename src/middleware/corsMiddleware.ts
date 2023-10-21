import cors from "@koa/cors";

export const corsMiddleware = cors({
  origin: "*"
});
