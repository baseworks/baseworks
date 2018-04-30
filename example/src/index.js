//import 'baseworks-initialize/index.js';


//require('../../src/baseworks-initialize/initialize.js');

export class Index {
  constructor() {
    this.test = "wooop";
    window.baseworks = this;
  }

  loadRouter() {
    return [
      {pattern: "/home\/(?P<id>\\d+)", view: "home"},
    ];

  }

}
