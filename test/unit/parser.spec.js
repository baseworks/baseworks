import { ObjectLiteral, Literal, Identifier, Parser, AccessMember, CallMember } from '../../lib/parser';

describe ('parser', () => {
  let parser = new Parser();

  it('should have a parse method', () => {
    expect(parser.parse).toBeDefined();
  })

  it ('should parse', () => {
    let text = "test"
    let result = parser.parse(text);
    expect(result).toEqual(jasmine.any(Object));
  })

  it ('should return a Literal for string expression', () => {
    let text = "'test'"
    let result = parser.parse(text);
    expect(result).toEqual(jasmine.any(Literal))
  })

  it ('should return an ObjectLiteral for an object expression', () => {
    let text = "{'test': 'test'}"
    let result = parser.parse(text);
    expect(result).toEqual(jasmine.any(ObjectLiteral));
  });

  it ('should return an Identifier for variable names', () => {
    let text = "test";
    let result = parser.parse(text)
    expect(result).toEqual(jasmine.any(Identifier));
  })

  it ('should return an AccessMember for a object dot notation property name', () => {
    let text = "test.test";
    let result = parser.parse(text);
    expect(result).toEqual(jasmine.any(AccessMember));
  })

  it ('should return an AccessMember for an object [] notation property name', () => {
    let text = "test[test]";
    let result = parser.parse(text);
    expect(result).toEqual(jasmine.any(AccessMember));
  })


  it ('should reutrn a CallMember for a call expression', () => {
    let text = "call(t,p)";
    let result = parser.parse(text);
    expect(result).toEqual(jasmine.any(CallMember))
  })

  it ('should nest expressions', () => {
    let text = "test.nested['test']";
    let result = parser.parse(text);
    expect(result).toEqual(jasmine.any(AccessMember))
    expect(result.expression).toEqual(jasmine.any(AccessMember))
    expect(result.expression.expression).toEqual(jasmine.any(Literal))
  })

})
