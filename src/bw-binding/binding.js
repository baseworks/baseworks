import {Identifier} from "./parser";

export class BindingCollection {
    constructor() {
        this.bindings = [];
    }

    add(binding) {
        this.bindings.push(binding);
        return binding;
    }

    find(expression, context) {
        let binding = this.bindings.filter(i => i.expression.value === expression.value && i.context === context);
        console.log(binding);
        return binding.length > 0 ? binding[0] : false;
    }

    filterByContext(context) {
        let bindings = this.bindings.filter(i => i.context === context);
        return binding.length > 0 ? bindings : false;
    }
}

export class BindingObserver {
    constructor(context, value) {
        this.context = context;
        this.value = value;
    }

    update(newValue) {
        this.context[this.value] = newValue;
    }
}

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
}

