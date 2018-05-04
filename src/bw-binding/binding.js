import { Identifier } from "./parser";

export class BindingCollection {
  constructor() {
    console.log(this)
    this.bindings = [];
  }
  add(binding) {
    this.bindings.push(binding)
    return binding;
  }
  find(expression, context) {
    let binding = this.bindings.filter(i => i.expression.text === expression.text && i.context === context)
    return binding.length > 0 ? binding[0] : false;
  }
  filterByContext(context) {
    let binding = this.bindings.filter(i => i.context === context);
    return binding.length > 0 ? binding[0] : false;
  }
}

export class BindingObserver {
  constructor(context, value) {
    this.context = context;
    this.value = value;
  }
  update(newValue) {
    this.context[this.value] = newValue;
    //if (this.attribute === "textContent" || this.attribute === "value")
    //else
      //this.element.setAttribute(this.attribute, newValue);
  }

}
/*
  observe(binding, context) {
    this.context = context;
    this._value = this.evaluate(context);
    let decorator = {};
    this.binding = binding;
    decorator.get = () => {
      return this._value
    };
    decorator.set = (newValue) => {
      this._value = newValue;
      binding.update(newValue);
    };
    Reflect.defineProperty(context, this.value, decorator);
  }

  assign(value) {
    console.log('broken:' + value);
    console.log('setting :' + this.context[this.value]);
    this.context[this.value] = value;
    this.binding.update(value);
  }*/

export class BindingContext {
  constructor(expression, context) {
    this.expression = expression;
    this.context = context;
    this.observers = [];
    this._value = this.evaluate(this.context);
    if (expression instanceof Identifier) {
      const decorator = {
        get: () => this._value,
        set: (value) => {
            this.assign(value)
        }
      };
      Reflect.defineProperty(this.context, expression.value, decorator);
    }
  }

  assign(value) {
    this._value = value;
    this.observers.forEach(observer => observer.update(value));
    return this._value;
  }
  evaluate() {
    return this.expression.evaluate(this.context);
  }

  addObserver(observer) {
    this.observers.push(observer)
  }

  update(newValue) {
    this.observers.forEach( observer => { observer.update(newValue); })
  }
}

