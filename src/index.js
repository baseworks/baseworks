export class Index {
  constructor() { }

  loadRouter() {
    return [
      {pattern: "home\/(?P<id>\\d+)", view: "home"},
    ];

  }

}
