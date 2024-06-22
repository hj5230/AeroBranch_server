import { Middleware } from "koa";
import jwt from "jsonwebtoken";

// urls exempt from login
const exempts = [/^\/user\/verify\/.*$/, /^\/user\/sign$/];

export const jwtMiddleware: Middleware = async (ctx, next) => {
    if (exempts.some(e => e.test(ctx.path))) {
        await next();
        return;
    }
    const authHeader = ctx.headers.authorization;
    if (!authHeader) {
        ctx.status = 401;
        ctx.body = { errno: "APPNS" };
        return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        ctx.status = 401;
        ctx.body = { errno: "APPNS" };
        return;
    }
    try {
        const secretKey = process.env.SECRET || "AEROBRANCHSECRET@2023";
        const decoded = jwt.verify(token, secretKey);
        ctx.state.user = decoded;
        await next();
    } catch (err) {
        ctx.status = 401;
        ctx.body = { errno: "APPNS" };
    }
};
