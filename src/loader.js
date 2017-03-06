import { Parser } from 'parser'

export class Loader {
  constructor() {
    this.modules = []
    this.parser = new Parser();
  }

  load(moduleId) {
    let found = this.modules.filter(i => i.moduleId === moduleId)[0]
    if (found) {
      return Promise.resolve(found);
    }
    else if (__webpack_require__.m[moduleId + '.js']) {
      let module = __webpack_require__(moduleId + ".js")
      if (typeof module === 'object') {
        for (let key in module) {
          let exported = module[key]
          if (typeof exported === "function") {
            let view;
            if (__webpack_require__.m[moduleId + '.html']) {
              view = __webpack_require__(moduleId + ".html")
              //let template = document.createElement('div')
              //template.innerHTML = html;
              //view = template.firstElementChild;
            }
            let item = new module[key]()
            let id = this.modules.length;
            let config = {moduleId: moduleId, view: view, id: id, viewModel: item}
            if ('loadRouter' in item && 'router' in this) {
              this.router.load(moduleId, item.loadRouter())
            }
            this.modules.push(config)
            console.debug("Loaded module: " + moduleId + ".js" + (config.view ? " and " + moduleId + ".html" : ""))

            return Promise.resolve(config);
          }
        }
      }
    } else {
      return Promise.reject();
    }
  }
}
