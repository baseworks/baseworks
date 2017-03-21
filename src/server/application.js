import * as http from 'http';
import * as path from 'path';
import { Router } from './router';
import { Loader, FileLoader } from 'bw-node-loader';
import { TemplateCompiler } from 'bw-templating';
import { Container, depend } from 'bw-dependency-injection'
/*

class Awesome {
  constructor() {
    console.log('wow')
  }
}

@depend(Awesome)
export class Test {
  constructor(testa) {
    console.log(testa)
  }

}
@depend(Awesome)
export class Again {
  constructor(awe) {
    console.log(awe)
  }
}*/

export class App {
  constructor() {
    this.router = new Router();
    this.router.url = '/'
    this.loader = new Loader();
    this.loader.router = this.router;
    this.fileLoader = new FileLoader();
    this.templateCompiler = new TemplateCompiler()
    this.container = new Container();
    //this.test = this.container.resolve(Test)
    //this.again = this.container.resolve(Again)
    //this.htmlParser.parse( path.resolve(__dirname, '../../example/src') + '/index.html')

    this.options = {
      root: path.resolve(__dirname, '../../example'),
      src: '/src',
      defaultFile: 'index.html',
      staticFiles: '/static'
    }
    this.startServer();

  }

  createView() {
    //need to create initial DOM.
    //boot strapping loads the app html
    let path = this.options.root;
    return this.loader.load(path + "/index")
    .then(content => {
      this.document = content.view
      this.element = this.document.querySelectorAll('[attach-app]')[0];
      path = this.options.root + this.options.src;
      return this.loader.load(path + "/index", true)
      .then(subContent => {
        let div = this.document.createElement('div');
        div.setAttribute("bw-view", "0")
        for (let i=0, c = subContent.view.childNodes, l = c.length; i < l; i++) {
          div.append(c[i]);
        }
        //div.appendChild(subContent.view);
        this.element.appendChild(div);
        this.templateCompiler.processNode(subContent.viewModel, this.element);
      })
    })
  }

  startServer() {
    this.server = http.createServer((request, response) => this.handleRequests(request,response)).listen(9090);
    this.createView();
  }

  handleRequests(request, response) {
    let route = this.router.findRoute(request.url)
    if (request.url === '/') {
      response.statusCode = 200;
      response.end(this.document.html(this.document));
      return;
    } else if (route.route) {
      let path = this.options.root + this.options.src + '/' + route.route.view
      this.loader.load(path, true)
      .then(content => {
        let element = this.document.querySelectorAll('view')[0];
        element.childNodes = [];
        let div = this.document.createElement('div');
        for (let i=0, c = content.view.childNodes, l = c.length; i < l; i++) {
          div.append(c[i]);
        }
        this.templateCompiler.processNode(content.viewModel, div);
        element.appendChild(div)
        response.statusCode = 200;
        response.end(this.document.html(this.document));
      })
      .catch(error => {
        console.log(error)
        response.statusCode = 404;
        response.end();
      })
    }

    else if (new RegExp('^' + this.options.staticFiles).test(request.url)) {
      let path = this.options.root + request.url
      this.fileLoader.load(path)
      .then(data => {
        response.statusCode = 200;
        response.write(data);
        response.end();
      })
      .catch(error => {
        response.statusCode = 404;
        response.end();
      })
    }
    else {
      response.statusCode = 404;
      response.end();
    }

  }
}

function main() {
  const app = new App()
}
main();

console.log('Server Running and listening on port: 9090');
