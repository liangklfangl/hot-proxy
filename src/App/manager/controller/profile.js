import { Inject, Service } from 'typedi';
import { ProfileService } from '../../services';
export class ProfileController {
  profileService = new ProfileService();

  regist(router) {
    router.post('/profile/savefile', async ctx => {
      const userId = ctx.userId;
      await this.profileService.setProfile(userId, ctx.request.body);
      ctx.body = {
        code: 0,
      };
    });

    router.post('/profile/setRuleState', async ctx => {
      const userId = ctx.userId;
      await this.profileService.setEnableRule(userId, !!ctx.query.rulestate);
      ctx.body = {
        code: 0,
      };
    });

    router.post('/profile/setHostState', async ctx => {
      const userId = ctx.userId;
      await this.profileService.setEnableHost(userId, !!ctx.query.hoststate);
      ctx.body = {
        code: 0,
      };
    });
  }
}
