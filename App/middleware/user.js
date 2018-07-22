/**
 * 
 * @param {*} profileService 
 * 获取用户信息的service
 */
export const user = profileService => {
  return async (ctx, next) => {
    if (ctx.ignore) {
      await next();
      return;
    }
    ctx.userID = profileService.getClientIpMappedUserId(ctx.clientIP);
    await next();
  };
};
