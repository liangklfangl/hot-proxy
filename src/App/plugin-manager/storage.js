import { isString } from 'lodash';
import { LocalStorage } from 'node-localstorage';

const key = 'hot-plugins';
export default class PluginStorage {
  store =  {};
  constructor(path = __dirname) {
    this.store = new LocalStorage(path);
  }

  set(value) {
    this.store.setItem(key, JSON.stringify(value));
  }

  get() {
    let plugins = this.store.getItem(key) || [];
    if (isString(plugins)) {
      plugins = JSON.parse(plugins);
    }
    return plugins;
  }
}
