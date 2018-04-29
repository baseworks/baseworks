export class Loader {
  constructor() {
    this.modules = []
  }

  load(moduleId) {
    console.log(moduleId);
    let found = this.modules.filter(i => i.moduleId === moduleId)[0];
    console.log(__webpack_require__.m);
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
              //let template = document.createElement('div')
              //template.innerHTML = html;
              //view = template.firstElementChild;
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
