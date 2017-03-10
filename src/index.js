require('../lib/init.js');
require.context("", true, /^\.\//); //loads all files in the src folder.


export class Index {
  constructor() { }

  loadRouter() {
    return [
      {pattern: "home\/(?P<id>\\d+)", view: "home"},
    ];

  }

}
