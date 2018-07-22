import { IncomingMessage } from 'http';

/**
 * 对请求进行拦截获取到ip地址封装到clientIp上
 */
export const ip = () => {
  return async (ctx, next) => {
    if (ctx.ignore) {
      await next();
      return;
    }
    const req  = ctx.req;
    ctx.clientIP =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;
    await next();
  };
};
