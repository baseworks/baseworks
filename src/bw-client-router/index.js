import { BaseRouter } from 'bw-router';
import { BindingService } from 'bw-binding';
import { Loader } from 'bw-loader';
import { depend } from 'bw-dependency-injection';


@depend(Loader, BindingService)
export class Router extends BaseRouter {
  constructor(loader, bindingService) {
    super(loader);
    this.currentState = {route: {pattern: "/", parent: null, view: "index"}, url: "/"};
    this.binding = bindingService;
    this.history = window.history;
    this.loader = loader;
    this.isRouting = false;
    window.addEventListener('popstate', this.popstate.bind(this));
    window.addEventListener('click', this.handleLink.bind(this), true);

    window.history.replaceState(this.currentState, "", "/");
  }
  setElement(element) {
    this.element = element;
  }
  switchView(element, view) {
    element.innerHTML = "";
    element.appendChild(view);
  }

  bindView(content) {
    let template = document.createElement('div')
    template.innerHTML = content.view;
    let view = template.firstElementChild;
    this.binding.bindView(content.viewModel, view)
    return view;
  }

  navigate(url, pushState = true) {
    this.isRouting = true;
    console.log(url);
    let {params, route} = this.findRoute(url.split("?")[0])
     if (url === '/') {
       let target = this.element.querySelectorAll("view[router]")[0];
       /*
       need a better method to handling the base route.

       */
       target.innerHTML = "";
       if (pushState)
         this.history.pushState({route: route, url: url}, "", url);
    } else if (route) {
      this.loader.load(route.view)
      .then(content => {
        let index = this.loader.modules.findIndex(i => i.moduleId === route.parent)
        let element = document.querySelectorAll("view[router]")[index];
        if ('loadRouter' in content.viewModel) {
          console.log('loading routes')
          this.load(content.moduleId, content.viewModel.loadRouter())
        }
        if (content.view && element) {
          let view = this.bindView(content)
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

}
