import { Parser } from 'parser';
import { Tokenizer } from 'tokenizer';

export class Binding {
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
              //should it be ${r} so the parser know's its a es6 template literal
              let binding = new Parser().parse(r);
              //add binding to the view config
              let value = binding.value(context);
              if (value) {
                node.textContent = node.textContent.replace("${" + r + "}", value);
              }
            }
          }
        }
      }
    }

    if (node.nodeType < 3 && node.hasAttributes()) {
      for (let a of node.attributes) {
        // parse attribute bindings
        //console.log(a.name)
        //console.log(a.value)

      }
    }
    if (node.hasChildNodes()) {
      for (let n of node.childNodes) {
        this.processNode(context, n)
      }
    }
  }
}
