import Router from 'koa-router';
import { Container } from 'typedi';
import {
  ConfigController,
  HostController,
  HttpTrafficController,
  MockDataController,
  ProfileController,
  RuleController,
  UtilsController,
} from './controller';

export default function() {
  const router = new Router();
 new ConfigController().regist(router);
 new ProfileController().regist(router);
 new HostController().regist(router);
 new HttpTrafficController().regist(router);
 new MockDataController().regist(router);
 new RuleController().regist(router);
 new UtilsController().regist(router);
  return router.routes();
}
