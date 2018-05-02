import * as fs from 'fs';
import { JSDOM } from 'jsdom';
global.window = {};
export class NodeLoader {

  constructor() {
    this.modules = []
  }
  findView() {
    return null;
  }
  load({path, loadViewModal = false, fragment = true}) {
    let file = path + ".html";
    return isFile(file).then(() => {
      return readFile(file).then(data => {
        let view = fragment ? JSDOM.fragment(data).firstChild : new JSDOM(data);
        let content = {moduleId: path, view};
        let promise = loadViewModal ? isFile(path + ".js").then() : Promise.resolve()
        return promise.then(() => {
          if (loadViewModal) {
            let moduleId = require(path + ".js");
            if (typeof moduleId === 'object') {
              for (let key in moduleId) {
                let exported = moduleId[key]
                if (typeof exported === "function") {
                  content.viewModel = new exported();
                }
              }
            }
            if ('loadRouter' in content.viewModel && 'router' in this) {
              console.log('loading routes')
              this.router.load(path, content.viewModel.loadRouter())
            }
            this.modules.push(content)
            console.log("Loaded module: " + path + ".js" + (content.view ? " and " + path + ".html" : ""))

          }
          return content;
        })
      })
    })
  }
}

export class FileLoader {
  load(file) {
    return isFile(file).then(() => {
      return readFile(file).then(data => {
        return data;
      })
    })
  }
}

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error)
        return reject(error)
      resolve(data);
    })
  })
}

function stat(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (error, stat) => {
      if (error)
        return reject(error)
      resolve(stat)
    })
  })
}

function isFile(path) {
  return new Promise( (resolve, reject) => {
    return stat(path)
    .then(stat => {
      if (stat.isFile())
        resolve()
      else
        reject()
    })
  })
}
