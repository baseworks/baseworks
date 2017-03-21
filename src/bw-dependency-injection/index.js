export class Container {
  constructor() {
    this.registry = new Map();
  }
  resolve(target) {
    target = this._normalize(target);
    let dependencies = this.getDependencies(target);
    let inject = []
    for (let d of dependencies) {
      inject.push(this.resolve(d))
    }
    return this.getOrCreateInstance(target, inject)

  }
  getOrCreateInstance(target, dependencies) {
    let instance = this.registry.get(target);
    if (!instance) {
      instance = new target(...dependencies)
      this.registry.set(target, instance)
    }
    return instance;
  }
  getDependencies(target) {
    if (!target.hasOwnProperty("_dependencies"))
      return [];

    return typeof target._dependencies === 'function' ? target._dependencies() : target._dependencies;
  }

  _normalize(target) {
    switch (typeof target) {
      case "string":
        //use loader to get thet module and import it;
      case "function":
        return target;
      default:
        throw new Error('Unable resolve dependancy ' +target)
    }
  }
}

export function depend(...items) {
  return function(target, key, desriptor) {
    target._dependencies = items
  }
}
