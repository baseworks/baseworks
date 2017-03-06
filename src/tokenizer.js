export class Token {
  constructor(text) {
    this.text = text
  }
}
export class Tokenizer {
  constructor() {
    this.reText = /^[a-z$_][a-z0-9_$]+/i
    this.reWhitespace = /^[\s]+/i
    this.reQuoteText = /(^['"])([\w\s'"\\]+)\1/
  }
  scan(text) {
    let tokens = [];
    this.pos = 0;

    this.length = text.length;
    let token = this.tokenize(text);

    while (token) {
      tokens.push(token);
      if (this.pos >= this.length)
        break;
      token = this.tokenize(text.substring(this.pos, this.length));
    }

    return tokens;

  }

  tokenize(text) {
    if (this.reText.test(text)) {
      let match = this.reText.exec(text);
      this.pos += match[0].length;
      return new Token(match[0]);
    }


    if (this.reWhitespace.test(text)) {
      let match = this.reWhitespace.exec(text);
      this.pos += match[0].length;
      return this.tokenize(text.substring(match[0].length, this.length))
    }

    let char = text.charCodeAt(0);
    if (char === 46) { // period
      this.pos += 1;
      return new Token(".");
    }
    if (singleTokenCharacterCodes.indexOf(char) > -1) {
      this.pos += 1;
      return new Token(String.fromCharCode(char));
    }
    if (quoteCharacterCodes.indexOf(char) > -1) {
      this.pos += 1;
      if (this.reQuoteText.test(text)) {
        let match = this.reQuoteText.exec(text);
        let quote = match[2];
        this.pos += match[0].length - 1;
        let reUnicode = /\\([a-z0-9])/gi;
        let unicode = reUnicode.exec(quote);

        while (unicode) {
          switch (unicode[1]) {
            case "u":
              if (/\\u[\dA-F]{4}/gi.test(quote))
                quote.replace(/\\u([\dA-F]{4})/gi, (m, r) => { return String.fromCharCode(parseInt(r, 16)); });
              else
                throw new Error("Invalid unicode escape sequence")
            case "x":
              if (/\\x[\dA-F]{2}/gi.test(quote))
                quote.replace(/\\x([\dA-F]{2})/gi, (m, r) => { return String.fromCharCode(parseInt(r, 16)); });
              else
                throw new Error("Invalid unicode escape sequence")
            case "t":
              quote = quote.replace("\\t", "\t");
            case "r":
              quote = quote.replace("\\r", "\r");
            case "n":
              quote = quote.replace("\\n", "\n");
            case "b":
              quote = quote.replace("\\b", "\b");
            case "f":
              quote = quote.replace("\\f", "\f");
            case "v":
              quote = quote.replace("\\v", "\v");
            default:
              quote = quote.replace(unicode[0], unicode[1]);
          }
        unicode = reUnicode.exec(quote);
        }

        return new Token(quote)
      }
    }
    throw new Error("Cannot parse: " + text);
  }
}
const singleTokenCharacterCodes = [
  40,  // (
  41,  // )
  44,  // ,
  58,  // :
  59,  // ;
  91,  // [
  93,  // ]
  123, // {
  125  // }
]
const quoteCharacterCodes = [
  34, // "
  39, // '
]
