import { WebpackLoader } from 'bw-webpack-loader'
import { Loader } from 'bw-loader'
import { Router } from 'bw-client-router'
import { Container } from "bw-dependency-injection";

class Bootstrapper {
  constructor() {
    this._configureLoadPromise = new Promise(resolve => { this._resolveLoadPromise = resolve });
    this.checkState()
  }

  checkState() {
    if (window.document.readyState === 'complete') {
      this._resolveLoadPromise();
    } else {
      window.document.addEventListener('DOMContentLoaded', e => this.documentReady(e))
      window.addEventListener('load', e => this.documentReady(e));
    }
  }

  documentReady(event) {
    window.document.removeEventListener('DOMContentLoaded', e => this.initialized(e))
    window.removeEventListener('load', e => this.initialized(e))
    this._resolveLoadPromise()
  }

  ensureLoaded() {
    return this._configureLoadPromise;
  }
}

const bootstrap = new Bootstrapper();

bootstrap.ensureLoaded()
.then(() => {
  console.log('bootstrapping done');
  const main = new Main();
})

export class Main {
  constructor() {
    this.container = new Container();
    this.container.registerAlias(Loader, WebpackLoader);
    this.element = document.querySelectorAll('body')[0];
    this.loader = this.container.resolve(Loader);
    this.router = this.container.resolve(Router);
    this.router.setElement(this.element);
    this.createView(); // should the router just navigate to '/' instead?
  }

  createView() {
    this.loader.load("index")
    .then(content => {
      this.element.innerHTML = "";
      let template = document.createElement('div')
      template.innerHTML = content.view;
      let view = template.firstElementChild;
      this.element.appendChild(view)
      this.element.firstChild.setAttribute("bw-view", content.id)
      this.router.binding.bindView(content.viewModel, view)
    })
    .catch(error => {
      console.log(error)
    })
  }

}
