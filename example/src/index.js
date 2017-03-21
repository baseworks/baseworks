//import 'baseworks-initialize/index.js';


//require('../../src/baseworks-initialize/initialize.js');

export class Index {
  constructor() {
    this.test = "wooop"
  }

  loadRouter() {
    return [
      {pattern: "/home\/(?P<id>\\d+)", view: "home"},
    ];

  }

}
