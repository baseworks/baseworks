import { TemplateCompiler } from 'bw-templating';

export class BindingCollection {
  constructor() {
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
}
export class BindingObserver {
  constructor(element, attribute) {
    this.element = element;
    this.attribute = attribute;
  }
  update(newValue) {
    this.element[this.attribute] = newValue;
    //if (this.attribute === "textContent" || this.attribute === "value")
    //else
      //this.element.setAttribute(this.attribute, newValue);
  }
}

export class BindingContext {
  constructor(expression, context) {
    this.expression = expression;
    this.observers = []
    this.context = context;
    if ('observe' in this.expression)
      this.expression.observe(this, this.context);
  }
  assign(value) {
    if ('assign' in this.expression)
      this.expression.assign(value)
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

export class BindingService {
  constructor(templateCompiler) {
    this.bindings = new BindingCollection();
    this.templateCompiler = templateCompiler;
  }
  bindView(context, view) {
    this.templateCompiler.processNode(context, view)
  }
}
