import { Container } from 'bw-dependency-injection';

export class Framework {
  constructor() {
    this.element = document.querySelectorAll('body')[0];
    this.container = new Container();

    this.loader = new Loader();
    this.router = new Router(this.loader, this.element);
    this.loader.router = this.router;
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
    })
    .catch(error => {
      console.log('uh oh')
    })
  }

}
