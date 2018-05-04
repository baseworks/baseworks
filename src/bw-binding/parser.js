import { Tokenizer, Tokenize, tokenType } from './tokenizer'

export class Parser {
  constructor() {}

  parse(input) {
    this.tokenize = new Tokenize(input);
    this.token = this.tokenize.next();
    let result;
    while (this.token.type !== tokenType.eof) {
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
    if (this.eat(tokenType.question)) {
      let truthy = this.parseExpression();
      this.expect(tokenType.colon)
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
      let logical = this.token.type === tokenType.logicalOR || this.token.type === tokenType.logicalAND;
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
      if ((computed = this.eat(tokenType.bracketLeft)) || this.eat(tokenType.dot)) {
        let expr = computed ? this.parseExpression() : this.parseSubscript(this.parseIdentifier());
        if (computed) this.expect(tokenType.bracketRight)
        return new AccessMember(base, expr)
      }
      else if (this.eat(tokenType.callLeft)) {
        let args = this.parseExpressionList(tokenType.callRight)
        return new CallMember(base, args)
      }
      return base
    }
  }
  parseExprAtom() {
    //need to account for -true or +false for prefix unary
    switch (this.token.type) {
      case tokenType.name:
        return this.parseIdentifier();

      case tokenType.number:
      case tokenType.string:
        let text = this.token.text;
        this.advance();
        return new Literal(text);

      case tokenType._null:
      case tokenType._true:
      case tokenType._false:
        let type = this.token.type === tokenType._null ? null : this.token.type === tokenType._true;
        this.advance();
        return new Literal(type);

      case tokenType._undefined:
        this.advance();
        return new Literal(tokenType.undefined);


      case tokenType.braceLeft:
        return this.parseObject();

    }

  }
  parseObject() {
    let first = true;
    let keys = [];
    let values = [];
    this.advance();
    while (!this.eat(tokenType.braceRight)) {
      if (!first)
        this.expect(tokenType.comma);
      else
        first = false;
      keys.push(this.parsePropertyName());
      let value;
      if (this.eat(tokenType.comma) || this.eat(tokenType.braceRight))
        value = this.parseExpression()
      else {
        this.expect(tokenType.colon)
        value = this.parseExpression()
      }
      values.push(value);
    }
    return new ObjectLiteral(keys, values);
  }

  parsePropertyName() {
    return this.token.type === tokenType.number || this.token.type === tokenType.string ? this.parseExpression() : this.parseIdentifier();
  }
  parseExpressionList(close) {
    let result = []
    let first = true;
    while (!this.eat(close)) {
      if (!first)
        this.expect(tokenType.comma);
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

export class BinaryOperation {
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

export class AccessMember {
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
export class CallMember {
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

export class Literal {
  constructor(value) {
    this.value = value;
  }
  evaluate() {
    return this.value;
  }

}
export class ObjectLiteral {
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

export class Identifier {
  constructor(value) {
    this.value = value;
  }

  evaluate(context) {
    return context[this.value];
  }

}

export class ConditionalExpression {
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
