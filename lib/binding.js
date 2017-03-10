import { Parser } from './parser';

export class BindingContext {
  constructor(expression, context, element, attribute) {
    this.expression = expression;
    this.value;
    this.element = element;
    this.attribute = attribute;
    this.context = context;
  }
  assign(value) {
    if ('assign' in this.expression)
      this.expression.assign(value)
  }
  evaluate() {
    return this.expression.evaluate(this.context);
  }

  observe() {
    // need to have multiple observers
    if ('observe' in this.expression)
      return this.expression.observe(this, this.context);
  }

  update(newValue) {
    if (this.attribute === "textContent")
      this.element[this.attribute] = newValue;
    else
      this.element.setAttribute(this.attribute, newValue);
  }
}

export class BindingService {
  constructor() {
    this.parser = new Parser();
  }
  bindView(context, view) {
    this.processNode(context, view)
  }

  processNode(context, node) {
    if (node.nodeType === 3) {
      if (node.textContent.length > 3) {
        let parts = node.textContent.split("${");
        let results = [];
        for (let i = 1; i < parts.length; i++) {
          let curly = 1;
          let text = parts[i];
          let quote = null;
          let length = text.lastIndexOf("}");
          if (length > -1) {
            for (let x = 0; x <= length; x++) {
              let char = text.charCodeAt(x);
              if (char === 39 || char === 34) {
                if (quote === null)
                  quote = char;
                else if (quote === char)
                  quote = null;
                continue;
              }
              if (quote !== null)
                continue;

              if (char === 123)
                curly++;
              if (char === 125)
                curly--;

              if (curly === 0)
                length = x;
            }
            if (curly === 0 && quote === null && length > 0) {
              let r = text.substring(0, length)
              let binding = new BindingContext(this.parser.parse(r), context, node, "textContent");
              binding.observe();
              let value = binding.evaluate();

              if (value !== undefined) {
                node.textContent = node.textContent.replace("${" + r + "}", value);
              }
            }
          }
        }
      }
    }

    if (node.nodeType < 3 && node.hasAttributes()) {
      for (let a of node.attributes) {
        let bindingAttr = a.name.split(':')
        if (bindingAttr.length > 1) {
          let attr = bindingAttr[0];
          let method = bindingAttr[1];
          let expr = a.value;
          let binding = new BindingContext(this.parser.parse(expr), context, node, method);
          binding.observe();
          node.setAttribute(attr, binding.evaluate(context))
          if (node.tagName.toLowerCase() === "input") {
            let listener = e => {
              binding.assign(node.value)
            }
            node.addEventListener("change", listener)
            node.addEventListener("input", listener)
          }
        }
      }
    }
    if (node.hasChildNodes()) {
      for (let n of node.childNodes) {
        this.processNode(context, n)
      }
    }
  }
}
