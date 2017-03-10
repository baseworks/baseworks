import { Router } from './router';
import { Loader } from './loader';

require.context("", true, /^\.\//); //loads all files in the src folder.

function ready() {
  if (!window.document || window.document.readyState === "complete") {
    return Promise.resolve()
  } else {
    return new Promise( (resolve) => {
      var done = function() {
        window.document.removeEventListener('DOMContentLoaded', done)
        window.removeEventListener('load', done)
        resolve();
      }
      window.document.addEventListener('DOMContentLoaded', done);
      window.addEventListener('load', done);
    })
  }
}

function main() {
  return ready()
  .then(() => {
    const main = new Main()

  })

}

export class Main {
  constructor() {

    this.element = document.querySelectorAll('body')[0];
    this.loader = new Loader();
    this.router = new Router(this.loader, this.element);
    this.loader.router = this.router;
    this.createView(); // should the router just navigate to '/' instead?
  }

  createView() {
    this.loader.load("index")
    .then(config => {
      this.element.innerHTML = "";
      let template = document.createElement('div')
      template.innerHTML = config.view;
      let view = template.firstElementChild;
      this.element.appendChild(view)
      this.element.firstChild.setAttribute("bw-view", config.id)
    })
    .catch(error => {
      console.log('uh oh')
    })
  }

}

main();

export function init() {
  return undefined;
}
