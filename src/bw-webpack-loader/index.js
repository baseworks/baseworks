export class WebpackLoader {
  constructor() {
    this.modules = []
  }

  findView(component) {
    const found = this.modules.find(i => i.viewModel === component.target);
    console.log(component);
    if (found)
      return found
    const keys = Object.keys(__webpack_require__.m).filter(i => i.slice(-3) === '.js');
    console.log(keys);
    for (let key of keys) {
      const module = __webpack_require__(key);
      console.log(module);
      if (module.hasOwnProperty(component.name) && module[component.name] === component.target) {
        console.log('we found it')
        return key;
      }
    }
  }

  load(moduleId) {
    const found = this.modules.filter(i => i.moduleId === moduleId)[0];
    console.log(__webpack_require__);
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
            if ('loadRouter' in item && 'router' in this) {
              this.router.load(moduleId, item.loadRouter())
            }
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
