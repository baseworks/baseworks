/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "..\\..\\src\\bw-binding\\binding.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bw_templating__ = __webpack_require__("..\\..\\src\\bw-templating\\index.js");


class BindingCollection {
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
/* harmony export (immutable) */ __webpack_exports__["b"] = BindingCollection;

class BindingObserver {
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
/* harmony export (immutable) */ __webpack_exports__["c"] = BindingObserver;


class BindingContext {
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
/* harmony export (immutable) */ __webpack_exports__["d"] = BindingContext;


class BindingService {
  constructor() {
    this.bindings = new BindingCollection();
    this.templateCompiler = new __WEBPACK_IMPORTED_MODULE_0_bw_templating__["a" /* TemplateCompiler */]();
  }
  bindView(context, view) {
    this.templateCompiler.processNode(context, view)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BindingService;



/***/ }),

/***/ "..\\..\\src\\bw-binding\\index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__binding__ = __webpack_require__("..\\..\\src\\bw-binding\\binding.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__binding__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_0__binding__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_0__binding__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_0__binding__["d"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__parser__ = __webpack_require__("..\\..\\src\\bw-binding\\parser.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__parser__["a"]; });




/***/ }),

/***/ "..\\..\\src\\bw-binding\\parser.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tokenizer__ = __webpack_require__("..\\..\\src\\bw-binding\\tokenizer.js");


class Parser {
  constructor() {}

  parse(input) {
    this.tokenize = new __WEBPACK_IMPORTED_MODULE_0__tokenizer__["a" /* Tokenize */](input);
    this.token = this.tokenize.next();
    let result;
    while (this.token.type !== __WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].eof) {
      result = this.parseStatement()
      this.token = this.tokenize.next();
    }

    return result
  }

  parseStatement() {
    let expression = this.parseExpression();
    return expression;
  }

  parseExpression() {
    return this.parseConditional();
  }

  //handles ? : conditionals;
  parseConditional() {
    let expr = this.parseExprOps();
    if (this.eat(__WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].question)) {
      let truthy = this.parseExpression();
      this.expect(__WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].colon)
      let falsey = this.parseExpression()
      return new ConditionalExpression(expr, truthy, falsey)
    }
    return expr;
  }
  parseExprOps() {
    let expr = this.parseExpressionSubscript();
    return this.parseExprOp(expr, -1)
  }

  parseExprOp(left, minPrec) {
    let prec = this.token.type.binop
    if (prec !== null && prec > minPrec) {
      let logical = this.token.type === __WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].logicalOR || this.token.type === __WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].logicalAND;
      let op = this.token.text;
      this.advance();
      let right = this.parseExprOp(this.parseExpressionSubscript(), prec);
      let expr = new BinaryOperation(left, op, right);
      return this.parseExprOp(expr, minPrec);
    }

    return left;
  }

  // parse call, dot and []
  parseExpressionSubscript() {
    let expr = this.parseExprAtom();
    return this.parseSubscript(expr);
  }

  parseSubscript(base) {
    for (let computed;;) {
      if ((computed = this.eat(__WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].bracketLeft)) || this.eat(__WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].dot)) {
        let expr = computed ? this.parseExpression() : this.parseSubscript(this.parseIdentifier());
        if (computed) this.expect(__WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].bracketRight)
        return new AccessMember(base, expr)
      }
      else if (this.eat(__WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].callLeft)) {
        let args = this.parseExpressionList(__WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].callRight)
        return new CallMember(base, args)
      }
      return base
    }
  }
  parseExprAtom() {
    //need to account for -true or +false for prefix unary
    switch (this.token.type) {
      case __WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].name:
        return this.parseIdentifier();

      case __WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].number:
      case __WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].string:
        let text = this.token.text;
        this.advance();
        return new Literal(text);

      case __WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */]._null:
      case __WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */]._true:
      case __WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */]._false:
        let type = this.token.type === __WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */]._null ? null : this.token.type === __WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */]._true;
        this.advance();
        return new Literal(type);

      case __WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */]._undefined:
        this.advance();
        return new Literal(__WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].undefined);


      case __WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].braceLeft:
        return this.parseObject();

    }

  }
  parseObject() {
    let first = true;
    let keys = [];
    let values = [];
    this.advance();
    while (!this.eat(__WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].braceRight)) {
      if (!first)
        this.expect(__WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].comma);
      else
        first = false;
      keys.push(this.parsePropertyName());
      let value;
      if (this.eat(__WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].comma) || this.eat(__WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].braceRight))
        value = this.parseExpression()
      else {
        this.expect(__WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].colon)
        value = this.parseExpression()
      }
      values.push(value);
    }
    return new ObjectLiteral(keys, values);
  }

  parsePropertyName() {
    return this.token.type === __WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].number || this.token.type === __WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].string ? this.parseExpression() : this.parseIdentifier();
  }
  parseExpressionList(close) {
    let result = []
    let first = true;
    while (!this.eat(close)) {
      if (!first)
        this.expect(__WEBPACK_IMPORTED_MODULE_0__tokenizer__["b" /* tokenType */].comma);
      else
        first = false;
      result.push(this.parseExpression())
    }
    return result;
  }
  parseIdentifier() {
    // add in check;
    let text = this.token.text
    this.advance();
    return new Identifier(text);
  }

  eat(type) {
    if (this.token.type === type) {
      this.token = this.tokenize.next();
      return true;
    }
    return false;
  }
  advance() {
    this.token = this.tokenize.next();
  }
  expect(type) {
    this.eat(type) || this.unexpected()
  }

  unexpected(pos) {
    throw new Error ("Unexpected token")
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Parser;


class BinaryOperation {
  constructor(left, operation, right) {
    this.left = left;
    this.operation = operation;
    this.right = right;
  }
  evaluate(context) {
    let left = this.left.evaluate(context);
    let right = this.right.evaluate(context);

    switch (this.operation) {
      case "&&":
        return left && right;
      case "||":
        return left || right;
      case "|":
        return left | right;
      case "^":
        return left ^ right;
      case "&":
        return left & right;
      case "===":
        return left === right;
      case "==":
        return left == right;
      case "!=":
        return left != right;
      case "!==":
        return left !== right;
      case "<":
        return left < right;
      case "<=":
        return left <= right;
      case ">":
        return left > right;
      case ">=":
        return left >= right;
      case "<<":
        return left << right;
      case ">>":
        return left >> right;
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "%":
        return left % right;
      case "*":
        return left * right;
      case "/":
        return left / right;

    }
  }
}
/* unused harmony export BinaryOperation */


class AccessMember {
  constructor(base, expression) {
    this.base = base;
    this.expression = expression;
  }
  evaluate(context) {
    let base = this.base.evaluate(context)
    let expr = this.expression.evaluate(base);
    return expr;
  }
}
/* unused harmony export AccessMember */

class CallMember {
  constructor(callee, args) {
    this.callee = callee;
    this.args = args;
  }

  evaluate(context) {
    let args = [];
    for (let i = 0; i < this.args.length; i++) {
      args.push(this.args[i].evaluate(context))
    }
    let func = context[this.callee.value]
    return func.apply(this.base, args);
  }

}
/* unused harmony export CallMember */


class Literal {
  constructor(value) {
    this.value = value;
  }
  evaluate() {
    return this.value;
  }

}
/* unused harmony export Literal */

class ObjectLiteral {
  constructor(keys, values) {
    this.keys = keys;
    this.values = values;
  }
  evaluate(context) {
    let value = {}
    for (let i = 0; i < this.keys.length; i++) {
      value[this.keys[i].evaluate(context)] = this.values[i].evaluate(context)
      return value;
    }
  }

}
/* unused harmony export ObjectLiteral */


class Identifier {
  constructor(value) {
    this.value = value;
    this._value;
  }

  evaluate(context) {
    return context[this.value];
  }

  observe(binding, context) {
    this.context = context;
    this._value = this.evaluate(context);
    let decorator = {}
    this.binding = binding;
    decorator.get = () => {
      return this._value
    }
    decorator.set = (newValue) => {
      this._value = newValue;
      binding.update(newValue);
    }
    Reflect.defineProperty(context, this.value, decorator);
  }

  assign(value) {
    this.context[this.value] = value;
    this.binding.update(value);
  }

}
/* unused harmony export Identifier */

class ConditionalExpression {
  constructor(expr, truthy, falsey) {
    this.expr = expr;
    this.truthy = truthy
    this.falsey = falsey
  }

  evaluate(context) {
    if (this.expr.evaluate(context))
      return this.truthy.evaluate(context);
    return this.falsey.evaluate(context);
  }
}
/* unused harmony export ConditionalExpression */



/***/ }),

/***/ "..\\..\\src\\bw-binding\\tokenizer.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Token {
  constructor(type, text) {
    this.text = text;
    this.type = type;
  }
}
/* unused harmony export Token */

class Tokenizer {
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
/* unused harmony export Tokenizer */



class Tokenize {
  constructor(input) {
    this.start = 0;
    this.pos = 0;
    this.end = 0;
    this.input = input;
  }

  next() {
    this.skipWhiteSpace();
    this.start = this.pos;
    if (this.start >= this.input.length)
      return this.finishToken(tokenType.eof);

    return this.getTokenFromChar(this.fixedCharCodeAt())
  }


  fixedCharCodeAt() {
    let char = this.input.charCodeAt(this.pos);
    if (0xD800 <= char && char <= 0xDB7F) {
      let next = this.inputcharCodeAt(this.pos + 1);
      return (char << 10) + next - 0x35fdc00
    }
    return char;
  }



  skipWhiteSpace() {
    loop:  while (this.pos < this.input.length) {
      let char = this.input.charCodeAt(this.pos);
      switch (char) {
        case 10:
        case 32:
        case 160:
          ++this.pos;
          break;
        case 13:
          if (this.input.charCodeAt(this.pos + 1) === 10) {
            ++this.pos
          }
          break;
        default:
          if (char > 8 && char < 14 || char >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(char))) {
            ++this.pos
          } else {
            break loop;
          }
      }
    }

  }
  isIdentifierStart(char) {
    if (char < 65) return char === 36; //$
    if (char < 91) return true; //A-Z
    if (char < 97) return char === 95; // _
    if (char < 123) return true;//a-z;
    //not including > 0xffffff identifier starts
    return false;
  }
  isIdentifierChar(char) {
    if (char < 48) return char === 36; // 1 - 9 or $
    if (char < 58) return true;
    if (char < 65) return false;
    if (char < 91) return true;
    if (char < 97) return char === 95;
    if (char < 123) return true;

    return false;
  }

  getTokenFromChar(char) {
    if (this.isIdentifierStart(char)) {
      return this.readIdentifier();
    }
    switch (char) {
      case 46:
        return this.readDot();

      case 40: // (
        ++this.pos;
        return this.finishToken(tokenType.callLeft);
      case 41: // )
        ++this.pos;
        return this.finishToken(tokenType.callRight);
      case 59: // ;
        ++this.pos;
        return this.finishToken(tokenType.colon);
      case 44: // ,
        ++this.pos;
        return this.finishToken(tokenType.comma);
      case 91: // [
        ++this.pos;
        return this.finishToken(tokenType.bracketLeft);
      case 93: // ]
        ++this.pos;
        return this.finishToken(tokenType.bracketRight);
      case 123: // {
        ++this.pos;
        return this.finishToken(tokenType.braceLeft);
      case 125: // }
        ++this.pos;
        return this.finishToken(tokenType.braceRight);
      case 58: // :
        ++this.pos;
        return this.finishToken(tokenType.colon);
      case 63: // ?
        ++this.pos;
        return this.finishToken(tokenType.question);
      case 37: // %
        ++this.pos;
        return this.finishToken(tokenType.modulo);
      case 42: // *
        ++this.pos;
        return this.finishToken(tokenType.star);
      case 43: // +
      case 45: // -
        ++this.pos;
        return this.finishToken(tokenType.plusMin);
      case 47: // /
        ++this.pos;
        return this.finishToken(tokenType.slash);
      case 94: // ^
        ++this.pos;
        return this.finishToken(tokenType.bitwiseXOR);
      case 48: // 0 - octal/hex/binary
        let next = this.input.charCodeAt(this.pos + 1)
        if (next === 120 || next === 88)
          return this.readRadixNumber(16) // '0x', '0X' - hex number
        if (this.options.ecmaVersion >= 6) {
          if (next === 111 || next === 79)
            return this.readRadixNumber(8) // '0o', '0O' - octal number
          if (next === 98 || next === 66)
            return this.readRadixNumber(2) // '0b', '0B' - binary number
      }

      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        return this.readNumber(false);

      case 34: // '
      case 39: // "
        return this.readString(char);

      case 60: // >
      case 62: // <
        return this.readOperator(char, 61, "=", tokenType.relational);
      case 33: // !
      case 61: // =
        return this.readOperator(char, 61, "=", tokenType.equality);

      case 124:
      return this.readOperator(char, 124, "|")
      case 38:
        return this.readOperator(char, 38, "&")
    }
  }
  readString(quote) {
    let str = "";
    let start = ++this.pos;
    for (;;) {
      if (this.pos >= this.input.length)
        throw new Error("Unterminated string constant");
      let char = this.input.charCodeAt(this.pos);
      if (char === quote)
        break;
      if (char === 92) { // '\'
        str += this.input.slice(start, this.pos);
        str += this.readEscapedChar(false);
        start = this.pos;
      } else {
        if (char === 10 || char === 13 || char === 0x2028 || char === 0x2029)
          throw new Error("Unterminated string constant")
        ++this.pos;
      }
    }
    str += this.input.slice(start, this.pos++);
    return this.finishToken(tokenType.string, str);
  }

  readEscapedChar(inTemplate) {
    let ch = this.input.charCodeAt(++this.pos)
    ++this.pos
    switch (ch) {
      case 110: return "\n" // 'n' -> '\n'
      case 114: return "\r" // 'r' -> '\r'
      case 120: return String.fromCharCode(this.readHexChar(2)) // 'x'
      case 117: return codePointToString(this.readHexChar(4)) // 'u'
      case 116: return "\t" // 't' -> '\t'
      case 98: return "\b" // 'b' -> '\b'
      case 118: return "\u000b" // 'v' -> '\u000b'
      case 102: return "\f" // 'f' -> '\f'
      case 13: return "\r"
      case 10: return "\n"
        if (this.options.locations) { this.lineStart = this.pos; ++this.curLine }
        return ""
      default:
        if (ch >= 48 && ch <= 55) {
          let octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0]
          let octal = parseInt(octalStr, 8)
          if (octal > 255) {
            octalStr = octalStr.slice(0, -1)
            octal = parseInt(octalStr, 8)
          }
          if (octalStr !== "0" && (this.strict || inTemplate)) {
            this.raise(this.pos - 2, "Octal literal in strict mode")
          }
          this.pos += octalStr.length - 1
          return String.fromCharCode(octal)
        }
        return String.fromCharCode(ch)
      }
  }

  readOperator(char, nextChar, str, type) {
    let next = this.input.charCodeAt(this.pos + 1);
    let operation = String.fromCharCode(char);
    if (next === nextChar) {
      ++this.pos;
      operation += str;
      next = this.input.charCodeAt(this.pos + 1);
      if ((char === 61 || char === 33) && next === nextChar) {
        ++this.pos;
        operation += str;
      }
    }
    ++this.pos;
    return this.finishToken(type, operation);
  }

  readIdentifier() {
    let start = this.pos;
    while (this.isIdentifierChar(this.fixedCharCodeAt())) {
      ++this.pos;
    }
    let word = this.input.slice(start, this.pos)

    let type = tokenType.name;
    if (word === "true")
      type = tokenType._true;
    if (word === "false")
      type = tokenType._false;
    if (word === "null")
      tpye = tokenType._null
    if (word === "undefined")
      type = tokenType._undefined;

    return this.finishToken(type, word);
  }
  readDot() {
    let char = this.input.charCodeAt(this.pos + 1);
    if (char >= 48 && char <=57) return this.readNumber(true);
    ++this.pos;
    return this.finishToken(tokenType.dot)
  }
  readNumber(startsWithDot) {
    let char;
    let start = this.pos;
    let pos = this.pos;
    let isFloat = false;
    let isOctal = this.input.charCodeAt(this.pos) === 48; //0
    if (startsWithDot)
      char = this.input.slice(this.pos+1)
    else
      char = this.input.slice(this.pos)
    if (isOctal && this.pos === start + 1)
      isOctal = false
    while (true) {
      if (!(char >= 48 && char <=57)) {
        break;
      }
      next = this.input.charCodeAt(pos+1);
      if (next === 46 && !isOctal)
        isFloat = true;

      if ((next == 69 || next === 101) && !isOctal) { // eE
        next = this.input.charCodeAt(++this.pos);
        if (next === 43 || next == 45)
          ++pos;
        if (parseInt(this.input.slice(start, pos) ,10) === NaN)
          throw new Error("Invalid Number");
        isFloat = true;
      }

      ++pos;
      char = this.input.charCodeAt(pos)
    }
    this.pos += pos+1;
    let value;
    let num = this.input.slice(start, this.pos);

    if (isFloat)
      value = parseFloat(num)
    else if (!isOctal || num.length === 1)
      value = parseInt(num, 10);
    else
      value = parseInt(str, 8); //octal

    return this.finishToken(tokenType.number, value);
    /*
    let start = this.pos;
    let value;
    let isFloat = false;
    let isOctal = this.input.charCodeAt(this.pos) === 48; //0
    console.log(start);
    console.log(String.fromCharCode(this.input.charCodeAt(this.pos)))

    if (!startsWithDot && this.readInt(10) === null)
      throw new Error ("Invalid Number");
    if (isOctal && this.pos === start + 1)
      isOctal = false; //00
    let next = this.input.charCodeAt(this.pos);
    console.log(String.fromCharCode(next))
    if (next === 46 && !isOctal) { // .
      next = this.input.charCodeAt(++this.pos);
      isFloat = true;
    }
    if ((next == 69 || next === 101) && !isOctal) { // eE
      next = this.input.charCodeAt(++this.pos);
      if (next === 43 || next == 45)
        ++this.pos;
      if (this.readInt(10) === null)
        throw new Error("Invalid Number");
      isFloat = true;
    }
    let num = this.input.slice(start, this.pos);

    if (isFloat)
      value = parseFloat(num)
    else if (!isOctal || num.length === 1)
      value = parseInt(num, 10);
    else
      value = parseInt(str, 8); //octal

    return this.finishToken(tokenType.number, value); */
  }
  readRadixNumber(radix) {
    this.pos += 2 // 0x
    let value = this.readInt(radix)
    if (value == null) throw new Error("Expected number in radix " + radix)
    if (isIdentifierStart(this.fixedCharCodeAt())) throw new Error("Identifier directly after number")
    return this.finishToken(tokenType.number, value)
  }



  finishToken(type, text) {
    return new Token(type, text);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Tokenize;


function codePointToString(code) {
  // UTF-16 Decoding
  if (code <= 0xFFFF) return String.fromCharCode(code)
  code -= 0x10000
  return String.fromCharCode((code >> 10) + 0xD800, (code & 1023) + 0xDC00)
}

class TokenType {
  constructor(label, conf = {}) {
    this.label = label;
    this.keyword = conf.keyword
    this.beforeExpr = !!conf.beforeExpr
    this.startsExpr = !!conf.startsExpr
    this.prefix = !!conf.prefix
    this.postfix = !!conf.postfix
    this.binop = conf.binop || null
  }
}
/* unused harmony export TokenType */


const tokenType = {
  dot: new TokenType("."),
  string: new TokenType("String"),
  name: new TokenType("Name"),
  eof: new TokenType("eof"),
  number: new TokenType("Number"),
  braceLeft: new TokenType("{"),
  braceRight: new TokenType("}"),
  bracketLeft: new TokenType("["),
  bracketRight: new TokenType("]"),
  callLeft: new TokenType("("),
  callRight: new TokenType(")"),
  comma: new TokenType(","),
  colon: new TokenType(":"),
  semi: new TokenType(";"),
  question: new TokenType("?"),
  dollarBraceL: new TokenType("${"),
  operation: new TokenType("Operation"),
  _null: new TokenType("null"),
  _false: new TokenType("false"),
  _true: new TokenType("true"),
  _undefined: new TokenType("undefined"),
  logicalOR: binop("||", 1),
  logicalAND: binop("&&", 2),
  bitwiseOR: binop("|", 3),
  bitwiseXOR: binop("^", 4),
  bitwiseAND: binop("&", 5),
  equality: binop("==/!=", 6),
  relational: binop("</>", 7),
  bitShift: binop("<</>>", 8),
  plusMin: new TokenType("+/-", {beforeExpr: true, binop: 9}),
  modulo: binop("%", 10),
  star: binop("*", 10),
  slash: binop("/", 10),
}
/* harmony export (immutable) */ __webpack_exports__["b"] = tokenType;


function binop(name, prec) {
  return new TokenType(name, {beforeExpr: true, binop: prec})
}

const nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/
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


/***/ }),

/***/ "..\\..\\src\\bw-client-router\\index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bw_router__ = __webpack_require__("..\\..\\src\\bw-router\\index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bw_binding__ = __webpack_require__("..\\..\\src\\bw-binding\\index.js");


class Router extends __WEBPACK_IMPORTED_MODULE_0_bw_router__["a" /* BaseRouter */] {
  constructor(loader, element) {
    super(loader);
    this.currentState = {route: {pattern: "/", parent: null, view: "index"}, url: "/"};
    this.binding = new __WEBPACK_IMPORTED_MODULE_1_bw_binding__["a" /* BindingService */]();
    this.history = window.history;
    this.element = element;
    this.loader = loader;

    this.isRouting = false;
    window.addEventListener('popstate', this.popstate.bind(this));
    window.addEventListener('click', this.handleLink.bind(this), true);

    window.history.replaceState(this.currentState, "", "/");
  }

  switchView(element, view) {
    element.innerHTML = "";
    element.appendChild(view);
  }

  bindView(content) {
    let template = document.createElement('div')
    template.innerHTML = content.view;
    let view = template.firstElementChild;
    this.binding.bindView(content.viewModel, view)
    return view;
  }

  navigate(url, pushState = true) {
    this.isRouting = true;
    let {params, route} = this.findRoute(url.split("?")[0])
     if (url === '/') {
       let target = this.element.querySelectorAll("view[router]")[0];
       /*
       need a better method to handling the base route.

       */
       target.innerHTML = "";
    } else if (route) {
      this.loader.load(route.view)
      .then(content => {
        let index = this.loader.modules.findIndex(i => i.moduleId === route.parent)
        let element = document.querySelectorAll("view[router]")[index];
        if (content.view && element) {
          let view = this.bindView(content)
          this.switchView(element, view)
        }
        if (pushState)
          this.history.pushState({route: route, url: url}, "", url);


        this.isRouting = false;
      })

    } else {
      console.debug('Route not found');
    }
  }

  closestAnchorElement(target) {
    let element = target;
    while (element) {
      if (element.tagName === 'A')
        return element;
      element = element.parentNode;
    }
  }
  handleLink(event) {
    let element = this.closestAnchorElement(event.target);

    if (element && this.getTarget(element)) {
      let href = element.getAttribute('href');
      if (href) {
        this.navigate(href);
        event.preventDefault();
      }
    }
  }

  getTarget(element) {
    let target = element.getAttribute('target')
    return (!target || target === window.name || target === '_self' || (target === 'top' && window.self === window.top))
  }


  popstate(event) {
    this.navigate(event.state.url, false)
  }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Router;



/***/ }),

/***/ "..\\..\\src\\bw-initialize\\index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bw_webpack_loader__ = __webpack_require__("..\\..\\src\\bw-webpack-loader\\index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bw_client_router__ = __webpack_require__("..\\..\\src\\bw-client-router\\index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_bw_binding__ = __webpack_require__("..\\..\\src\\bw-binding\\index.js");




class Bootstrapper {
  constructor() {
    this._configureLoadPromise = new Promise(resolve => { this._resolveLoadPromise = resolve });
    this.checkState()
  }

  checkState() {
    if (window.document.readyState === 'complete') {
      this._resolveLoadPromise();
    } else {
      window.document.addEventListener('DOMContentLoaded', e => this.documentReady(e))
      window.addEventListener('load', e => this.documentReady(e));
    }
  }

  documentReady(event) {
    window.document.removeEventListener('DOMContentLoaded', e => this.initialized(e))
    window.removeEventListener('load', e => this.initialized(e))
    this._resolveLoadPromise()
  }

  ensureLoaded() {
    return this._configureLoadPromise;
  }
}

const bootstrap = new Bootstrapper();

bootstrap.ensureLoaded()
.then(() => {
  console.log('bootstrapping done');
  const main = new Main();
})

class Main {
  constructor() {

    this.element = document.querySelectorAll('body')[0];
    console.log(this.element);
    this.loader = new __WEBPACK_IMPORTED_MODULE_0_bw_webpack_loader__["a" /* Loader */]();
    this.router = new __WEBPACK_IMPORTED_MODULE_1_bw_client_router__["a" /* Router */](this.loader, this.element);
    this.loader.router = this.router;
    this.createView(); // should the router just navigate to '/' instead?
  }

  createView() {
    this.loader.load("index")
    .then(content => {
      console.log(content);
      this.element.innerHTML = "";
      let template = document.createElement('div')
      template.innerHTML = content.view;
      let view = template.firstElementChild;
      this.element.appendChild(view)
      this.element.firstChild.setAttribute("bw-view", content.id)
      this.router.binding.bindView(content.viewModel, view)
    })
    .catch(error => {
      console.log(error)
    })
  }

}
/* harmony export (immutable) */ __webpack_exports__["Main"] = Main;



/***/ }),

/***/ "..\\..\\src\\bw-router\\index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export route */
class BaseRouter {
  constructor(loader) {
    this.routes = [];
    this.loader = loader;
  }

  load(moduleId, routes) {
    for (let route of routes) {
      this.analyzePattern(route)
      route.parent = moduleId;
      this.routes.push(route);
    }
  }

  analyzePattern(route) {
    route.params = [];
    let matches = route.pattern.match(/\?P<[A-Za-z_]+>/g);
    if (matches) {
      for (let m of matches) {
        let match = m.match(/<([A-Za-z_]+)>/)
        route.params.push(match[1]);
      }
    }
    route.pattern = route.pattern.replace(/\?P<[A-Za-z_]+>/g, "");
    route.re = new RegExp(route.pattern);
  }

  register(items) {
    for (let item of items) {
      item.re = new RegExp(item.pattern);
      this.routes.push(item)
    }
  }

  getRoutes() {
    return this.routes;
  }

  findRoute(url) {
    for (let route of this.routes) {
      let found = url.match(route.re)
      if (found) {
        let params = {}
        found.splice(0,1)
        for (let x = 0; x < found.length; x++) {
          params[route.params[x]] = found[x]
        }
        return {params: params, route: route};
      }
    }
    return {params: undefined, route: undefined}
  }

  parseUrl(url, route) {
    const re = /(\w+)/g;
    let path = url.split('?')[0]

  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BaseRouter;


function route(...items) {
  return function(target, key, desriptor) {
    target._route = items
  }
}


/***/ }),

/***/ "..\\..\\src\\bw-templating\\index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__template_compiler__ = __webpack_require__("..\\..\\src\\bw-templating\\template-compiler.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__template_compiler__["a"]; });



/***/ }),

/***/ "..\\..\\src\\bw-templating\\template-compiler.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bw_binding__ = __webpack_require__("..\\..\\src\\bw-binding\\index.js");

class TemplateCompiler {
  constructor() {
    this.parser = new __WEBPACK_IMPORTED_MODULE_0_bw_binding__["b" /* Parser */]();
    this.bindings = new __WEBPACK_IMPORTED_MODULE_0_bw_binding__["c" /* BindingCollection */]();
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
              let expression = this.parser.parse(r);
              let binding = this.bindings.find(expression, context)
              if (!binding)
                binding = this.bindings.add(new __WEBPACK_IMPORTED_MODULE_0_bw_binding__["d" /* BindingContext */](expression, context));
              binding.addObserver(new __WEBPACK_IMPORTED_MODULE_0_bw_binding__["e" /* BindingObserver */](node, "textContent"));
              let value = binding.evaluate();
              if (value !== undefined) {
                node.textContent = node.textContent.replace("${" + r + "}", value);
                node.parentNode.setAttribute("text-content:bind", r);
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
          let attr = bindingAttr[0].toCamel();
          let method = bindingAttr[1];
          let expr = a.value;
          let expression = this.parser.parse(expr);
          let binding = this.bindings.find(expression, context)

          if (!binding)
            binding = this.bindings.add(new __WEBPACK_IMPORTED_MODULE_0_bw_binding__["d" /* BindingContext */](expression, context));

          binding.addObserver(new __WEBPACK_IMPORTED_MODULE_0_bw_binding__["e" /* BindingObserver */](node, attr));
          if (attr === "value" || attr === "textContent")
            node[attr] = binding.evaluate(context)
          else
            node.setAttribute(attr, binding.evaluate(context));

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
/* harmony export (immutable) */ __webpack_exports__["a"] = TemplateCompiler;

if (typeof String.prototype.toCamel !== 'function') {
  String.prototype.toCamel = function(){
    return this.replace(/[-]([a-z])/g, function (g) { return g[1].toUpperCase(); })
  };
}


/***/ }),

/***/ "..\\..\\src\\bw-webpack-loader\\index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Loader {
  constructor() {
    this.modules = []
  }

  load(moduleId) {
    let found = this.modules.filter(i => i.moduleId === moduleId)[0]
    console.log(__webpack_require__.m)
    if (found) {
      return Promise.resolve(found);
    }

    else if (__webpack_require__.m[moduleId + '.js']) {
      let module = __webpack_require__(moduleId + ".js")
      if (typeof module === 'object') {
        for (let key in module) {
          let exported = module[key]
          if (typeof exported === "function") {
            let view;
            if (__webpack_require__.m[moduleId + '.html']) {
              view = __webpack_require__(moduleId + ".html")
              //let template = document.createElement('div')
              //template.innerHTML = html;
              //view = template.firstElementChild;
            }
            let item = new module[key]()
            let id = this.modules.length;
            let content = {moduleId: moduleId, view: view, id: id, viewModel: item}
            if ('loadRouter' in item && 'router' in this) {
              this.router.load(moduleId, item.loadRouter())
            }
            this.modules.push(content)
            console.debug("Loaded module: " + moduleId + ".js" + (content.view ? " and " + moduleId + ".html" : ""))

            return Promise.resolve(content);
          }
        }
      }
    } else {
      return Promise.reject("not found: " + moduleId);
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Loader;



/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./home": "home.js",
	"./home.html": "home.html",
	"./home.js": "home.js",
	"./index": "index.js",
	"./index.html": "index.html",
	"./index.js": "index.js",
	"./main": "main.js",
	"./main.js": "main.js"
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 4;


/***/ }),

/***/ "home.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"mdl-cell mdl-cell--12-col\">\r\n  <h1>${input}</h1>\r\n  <input value:bind=\"input\">\r\n</div>\r\n";

/***/ }),

/***/ "home.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
class Test {
  constructor() {
    this.message = "Home"
    this.input = "Input"
    console.log('Home ViewModel')
    this.message = {"test": "Awesome", "testa": "Better"}
    this.test = {"test": {"sub": "Tester"}}
    this.testTwo= {"test": {"test": {"sub": "deep"}}}
    this.testStrigng = "test";


  }

  callme(v) {
    console.log(v)
    console.log('ok')
    return v
  }


}
/* harmony export (immutable) */ __webpack_exports__["Test"] = Test;



/***/ }),

/***/ "index.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-drawer\r\n            mdl-layout--fixed-header\">\r\n  <header class=\"mdl-layout__header\">\r\n    <div class=\"mdl-layout__header-row\">\r\n      <div class=\"mdl-layout-spacer\"></div>\r\n      <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--expandable\r\n                  mdl-textfield--floating-label mdl-textfield--align-right\">\r\n        <label class=\"mdl-button mdl-js-button mdl-button--icon\"\r\n               for=\"fixed-header-drawer-exp\">\r\n          <i class=\"material-icons\">search</i>\r\n        </label>\r\n        <div class=\"mdl-textfield__expandable-holder\">\r\n          <input class=\"mdl-textfield__input\" type=\"text\" name=\"sample\"\r\n                 id=\"fixed-header-drawer-exp\">\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </header>\r\n  <div class=\"mdl-layout__drawer\">\r\n    <span class=\"mdl-layout-title\">Router Sample</span>\r\n    <nav class=\"mdl-navigation\">\r\n      <a class=\"mdl-navigation__link\" href=\"/\">Index</a>\r\n      <a class=\"mdl-navigation__link\" href=\"/home/1234\">home</a>\r\n    </nav>\r\n  </div>\r\n  <main class=\"mdl-layout__content mdl-color--grey-100\">\r\n    <h1>Index</h1>\r\n    <p>${test}</p>\r\n    <input value:bind=\"test\" value=\"haha\">\r\n    <div class=\"page-content\">\r\n      <view router class=\"mdl-grid\"></view>\r\n    </div>\r\n  </main>\r\n</div>\r\n";

/***/ }),

/***/ "index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//import 'baseworks-initialize/index.js';


//require('../../src/baseworks-initialize/initialize.js');

class Index {
  constructor() {
    this.test = "wooop"
  }

  loadRouter() {
    return [
      {pattern: "/home\/(?P<id>\\d+)", view: "home"},
    ];

  }

}
/* harmony export (immutable) */ __webpack_exports__["Index"] = Index;



/***/ }),

/***/ "main.js":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("..\\..\\src\\bw-initialize\\index.js");
__webpack_require__(4); //loads all files in the src folder.


/***/ })

/******/ });