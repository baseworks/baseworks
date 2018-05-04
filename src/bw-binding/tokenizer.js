export class Token {
    constructor(type, text) {
        this.text = text;
        this.type = type;
    }
}

export class Tokenizer {
    constructor() {
        this.reText = /^[a-z$_][a-z0-9_$]+/i;
        this.reWhitespace = /^[\s]+/i;
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
                                quote.replace(/\\u([\dA-F]{4})/gi, (m, r) => {
                                    return String.fromCharCode(parseInt(r, 16));
                                });
                            else
                                throw new Error("Invalid unicode escape sequence");
                        case "x":
                            if (/\\x[\dA-F]{2}/gi.test(quote))
                                quote.replace(/\\x([\dA-F]{2})/gi, (m, r) => {
                                    return String.fromCharCode(parseInt(r, 16));
                                });
                            else
                                throw new Error("Invalid unicode escape sequence");
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


export class Tokenize {
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
                let next = this.input.charCodeAt(this.pos + 1);
                if (next === 120 || next === 88)
                    return this.readRadixNumber(16); // '0x', '0X' - hex number
                if (this.options.ecmaVersion >= 6) {
                    if (next === 111 || next === 79)
                        return this.readRadixNumber(8); // '0o', '0O' - octal number
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
                return this.readOperator(char, 124, "|");
            case 38:
                return this.readOperator(char, 38, "&")
        }
    }

    readString(quote) {
        let str = "";
        let start = ++this.pos;
        for (; ;) {
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
                    throw new Error("Unterminated string constant");
                ++this.pos;
            }
        }
        str += this.input.slice(start, this.pos++);
        return this.finishToken(tokenType.string, str);
    }

    readEscapedChar(inTemplate) {
        let ch = this.input.charCodeAt(++this.pos);
        ++this.pos;
        switch (ch) {
            case 110:
                return "\n"; // 'n' -> '\n'
            case 114:
                return "\r"; // 'r' -> '\r'
            case 120:
                return String.fromCharCode(this.readHexChar(2)); // 'x'
            case 117:
                return codePointToString(this.readHexChar(4)); // 'u'
            case 116:
                return "\t"; // 't' -> '\t'
            case 98:
                return "\b"; // 'b' -> '\b'
            case 118:
                return "\u000b"; // 'v' -> '\u000b'
            case 102:
                return "\f"; // 'f' -> '\f'
            case 13:
                return "\r";
            case 10:
                return "\n";
                if (this.options.locations) {
                    this.lineStart = this.pos;
                    ++this.curLine
                }
                return "";
            default:
                if (ch >= 48 && ch <= 55) {
                    let octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
                    let octal = parseInt(octalStr, 8);
                    if (octal > 255) {
                        octalStr = octalStr.slice(0, -1);
                        octal = parseInt(octalStr, 8)
                    }
                    if (octalStr !== "0" && (this.strict || inTemplate)) {
                        this.raise(this.pos - 2, "Octal literal in strict mode")
                    }
                    this.pos += octalStr.length - 1;
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
        let word = this.input.slice(start, this.pos);

        let type = tokenType.name;
        if (word === "true")
            type = tokenType._true;
        if (word === "false")
            type = tokenType._false;
        if (word === "null")
            tpye = tokenType._null;
        if (word === "undefined")
            type = tokenType._undefined;

        return this.finishToken(type, word);
    }

    readDot() {
        let char = this.input.charCodeAt(this.pos + 1);
        if (char >= 48 && char <= 57) return this.readNumber(true);
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
            char = this.input.slice(this.pos + 1);
        else
            char = this.input.slice(this.pos);
        if (isOctal && this.pos === start + 1)
            isOctal = false;
        while (true) {
            if (!(char >= 48 && char <= 57)) {
                break;
            }
            next = this.input.charCodeAt(pos + 1);
            if (next === 46 && !isOctal)
                isFloat = true;

            if ((next == 69 || next === 101) && !isOctal) { // eE
                next = this.input.charCodeAt(++this.pos);
                if (next === 43 || next == 45)
                    ++pos;
                if (parseInt(this.input.slice(start, pos), 10) === NaN)
                    throw new Error("Invalid Number");
                isFloat = true;
            }

            ++pos;
            char = this.input.charCodeAt(pos)
        }
        this.pos += pos + 1;
        let value;
        let num = this.input.slice(start, this.pos);

        if (isFloat)
            value = parseFloat(num);
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
        this.pos += 2; // 0x
        let value = this.readInt(radix);
        if (value == null) throw new Error("Expected number in radix " + radix);
        if (isIdentifierStart(this.fixedCharCodeAt())) throw new Error("Identifier directly after number");
        return this.finishToken(tokenType.number, value)
    }


    finishToken(type, text) {
        return new Token(type, text);
    }
}

function codePointToString(code) {
    // UTF-16 Decoding
    if (code <= 0xFFFF) return String.fromCharCode(code);
    code -= 0x10000;
    return String.fromCharCode((code >> 10) + 0xD800, (code & 1023) + 0xDC00)
}

export class TokenType {
    constructor(label, conf = {}) {
        this.label = label;
        this.keyword = conf.keyword;
        this.beforeExpr = !!conf.beforeExpr;
        this.startsExpr = !!conf.startsExpr;
        this.prefix = !!conf.prefix;
        this.postfix = !!conf.postfix;
        this.binop = conf.binop || null
    }
}

export const tokenType = {
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
};

function binop(name, prec) {
    return new TokenType(name, {beforeExpr: true, binop: prec})
}

const nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
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
];
const quoteCharacterCodes = [
    34, // "
    39, // '
];
