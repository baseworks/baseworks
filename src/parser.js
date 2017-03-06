import { Tokenizer } from 'tokenizer'

export class BindingContext {
  constructor(tokens, type) {
    this.tokens = tokens;
    this.type = type;
  }
  value(context) {

    let value = null;
    if (this.type === "Object") {

    }
    if (this.type === "Member") {
      for (let i = 0; i < this.tokens.length; i++) {
        let m = this.tokens[i].text
        if (m === "." || m === '[' || m === ']')
          continue;
        if (!value)
          value = context[m]
        else
          value = value[m]
      }
    }
    return value;
  }

}
export class Parser {
  constructor() {
    this.tokenizer = new Tokenizer();
    this.tokens = []
  }
  parse(input) {
    /*
    only handles strings
    itterate through each token until we can determine what the data is
    there could be multiple data ie: this.member === "text"
    we'll need child bindings for contextAccess, ===, and text
    */
    this.tokens = this.tokenizer.scan(input);
    if (this.tokens.length > 0) {
      this.type = null;
      let char = this.tokens[0][1];
      if (char === "{")
        this.type = "Object"
      else
        this.type = "Member"

      //use Object.defineProperty
      return new BindingContext(this.tokens, this.type);
    }
  }

}
