import { BindingService } from './binding';

export class Router {
  constructor(loader, element) {
    this.loader = loader;
    this.history = window.history;
    this.element = element;
    this.isRouting = false;
    this.routes = [];
    this.currentState = {route: {pattern: "/", parent: null, view: "index"}, url: "/"};
    this.binding = new BindingService();

    window.addEventListener('popstate', this.popstate.bind(this));
    window.addEventListener('click', this.handleLink.bind(this), true);

    window.history.replaceState(this.currentState, "", "/");
  }
  load(moduleId, routes) {
    for (let route of routes) {
      this.analyzePattern(route)
      route.parent = moduleId;
      this.routes.push(route);
    }
  }
  analyzePattern(route) {
    route.params = [];
    let matches = route.pattern.match(/\?P<[A-Za-z_]+>/g);
    if (matches) {
      for (let m of matches) {
        let match = m.match(/<([A-Za-z_]+)>/)
        route.params.push(match[1]);
      }
    }
    route.pattern = route.pattern.replace(/\?P<[A-Za-z_]+>/g, "");
    route.re = new RegExp(route.pattern);
  }

  closestAnchorElement(target) {
    let element = target;
    while (element) {
      if (element.tagName === 'A')
        return element;
      element = element.parentNode;
    }
  }
  handleLink(event) {
    let element = this.closestAnchorElement(event.target);

    if (element && this.getTarget(element)) {
      let href = element.getAttribute('href');
      if (href) {
        this.navigate(href);
        event.preventDefault();
      }
    }
  }

  getTarget(element) {
    let target = element.getAttribute('target')
    return (!target || target === window.name || target === '_self' || (target === 'top' && window.self === window.top))
  }


  popstate(event) {
    this.navigate(event.state.url, false)
  }

  register(items) {
    for (let item of items) {
      item.re = new RegExp(item.pattern);
      this.routes.push(item)
    }
  }

  getRoutes() {
    return this.routes;
  }

  findRoute(url) {
    for (let route of this.routes) {
      let found = url.match(route.re)
      if (found) {
        let params = {}
        found.splice(0,1)
        for (let x = 0; x < found.length; x++) {
          params[route.params[x]] = found[x]
        }
        return {params: params, route: route};
      }
    }
    return {params: undefined, route: undefined}
  }

  parseUrl(url, route) {
    const re = /(\w+)/g;
    let path = url.split('?')[0]

  }
  switchView(element, view) {
    element.innerHTML = "";
    element.appendChild(view);
  }

  bindView(config) {
    let template = document.createElement('div')
    template.innerHTML = config.view;
    let view = template.firstElementChild;
    this.binding.bindView(config.viewModel, view)
    return view;
  }

  navigate(url, pushState = true) {
    this.isRouting = true;
    let {params, route} = this.findRoute(url.split("?")[0])
     if (url === '/') {
       let target = this.element.querySelectorAll("view[router]")[0];
       /*
       need a better method to handling the base route.

       */
       target.innerHTML = "";
    } else if (route) {
      this.loader.load(route.view)
      .then(config => {
        let index = this.loader.modules.findIndex(i => i.moduleId === route.parent)
        let element = document.querySelectorAll("view[router]")[index];
        if (config.view && element) {
          let view = this.bindView(config)
          this.switchView(element, view)
        }
        if (pushState)
          this.history.pushState({route: route, url: url}, "", url);


        this.isRouting = false;
      })

    } else {
      console.debug('Route not found');
    }
  }

}
