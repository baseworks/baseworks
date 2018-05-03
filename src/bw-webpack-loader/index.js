import {Router} from 'bw-client-router';
import {depend} from 'bw-dependency-injection';

export class WebpackLoader {
  constructor() {
    this.modules = [];
    window.webpack = __webpack_require__;
  }

  findView(component) {
    const found = this.modules.find(i => i.viewModel === component.target);

    if (found)
      return found;
    const keys = Object.keys(__webpack_require__.m).filter(i => i.slice(-3) === '.js');

    for (let key of keys) {
      const module = __webpack_require__(key);
      if (module.hasOwnProperty(component.name) && module[component.name] === component.target) {
        return this.load(key.slice(0, -3));
      }
    }
  }

  load(moduleId) {
    const found = this.modules.filter(i => i.moduleId === moduleId)[0];

    if (found) {
      return Promise.resolve(found);
    }


    else if (__webpack_require__.m[moduleId + '.js']) {
      let module = __webpack_require__(moduleId + ".js");
      if (typeof module === 'object') {
        for (let key in module) {
          let exported = module[key];
          if (typeof exported === "function") {
            let view;
            if (__webpack_require__.m[moduleId + '.html']) {
              view = __webpack_require__(moduleId + ".html")
            }
            let item = new module[key]();
            let id = this.modules.length;
            let content = {moduleId: moduleId, view: view, id: id, viewModel: item};

            this.modules.push(content);
            console.debug("Loaded module: " + moduleId + ".js" + (content.view ? " and " + moduleId + ".html" : ""));

            return Promise.resolve(content);
          }
        }
      }
    } else {
      return Promise.reject("not found: " + moduleId);
    }
  }
}
