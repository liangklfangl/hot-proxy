export class Ignorer {
   /**
    * 忽略集合
    */
   patterns  = [];
  
  /**
   * 忽略的模式
   */
  addPattern(pattern) {
    this.patterns.push(pattern);
  }

  /**
   * 
   * @param {*} ctx 
   * @param {*} next 
   * 忽略某一个请求
   */
  async middleware(ctx, next) {
    let shouldIgnore = false;
    for (const pattern of this.patterns) {
      if (ctx.req.url.includes(pattern)) {
        shouldIgnore = true;
        break;
      }
    }
    if (shouldIgnore) {
      ctx.ignore = true;
    }
    await next();
  }
}
