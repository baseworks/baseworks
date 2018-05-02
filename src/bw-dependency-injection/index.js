export class Container {
  constructor() {
    this.registry = new Map();
  }
  resolve(target) {
    target = this._normalize(target);
    const dependencies = this.resolveDependencies(target);
    return this.getOrCreateInstance(target, dependencies);
  }
  resolveDependencies(target) {
    let dependencies = this.getDependencies(target);
    let inject = [];
    for (let d of dependencies) {
      inject.push(this.resolve(d))
    }
    return inject;
  }
  registerAlias(target, alias) {
    target = this._normalize(target);
    const dependencies = this.resolveDependencies(target);
    const instance = new alias(...dependencies);
    this.registry.set(target, instance);
  }
  getOrCreateInstance(target, dependencies) {
    let instance = this.registry.get(target);

    if (!instance) {
      instance = new target(...dependencies);
      console.log(target);
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
        throw new Error('Unable resolve dependency ' +target)
    }
  }
}

export function depend(...items) {
  return function(target, key, desriptor) {
    target._dependencies = items
  }
}
