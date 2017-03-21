import * as htmlparser2 from 'htmlparser2';
import { Document, Node, Element, EventTarget } from './DOM'
import NW from 'nwmatcher';


export class HtmlParser {
  parse(data) {
    this.handler = new DOMHandler()
    this.parser = new htmlparser2.Parser(this.handler)
    console.time('someFunction');
    //this.parser.write(data);
    this.parser.end(data);

    console.timeEnd('someFunction');
    return this.handler.document;
  }
  render(element) {
    return render(element);
  }
}

export class DOMHandler {
  constructor() {
    this.document = new Document();
    this.document.childNodes = [];
    this.parent = this.document;
    this.open = true;
    global.window = new EventTarget();
    global.window.document = this.document;
  }

  setupNode(node, type, name, value) {
    node.ownerDocument = this.document;
    node.nodeType = type;
    node.nodeName = name;
    node.nodeValue = value;
    node.parentNode = this.parent;

    /*if (this.parent.firstChild) {
      let previous = this.parent.childNodes[this.parent.childNodes.length - 1]
      node.previousSibling = previous;
      previous.nextSibling = node;
      if (node.nodeType === 3) {
        let previousElement = this.parent.children[this.parent.children.length - 1]
        node.previousElementSibling = previousElement;
        previousElement.nextElementSibling = node;

      }
    }*/

    this.parent.childNodes.push(node);
    this.currentNode = node;

  }
  openNode(node) {
    this.open = true;
    this.parent = this.currentNode;
  }
  closeNode() {
    this.open = false;
    this.parent = this.parent.parentNode;
  }
  onopentag (tagName, attributes) {
    let node = new Element();
    this.currentElementNode = node;
    this.setupNode(node, 1, tagName.toUpperCase(), null);
    this.openNode();
    node.attributes = [];
    for (let name in attributes) {
      node.attributes.push({name: name, value: attributes[name], specified: true})
    }
  }

  onclosetag(tagName) {
    this.closeNode();
  }
  ontext (text) {
    let node = new Node();
    this.setupNode(node, 3, "#text", text);
    node.data = text;
    node.textContent = text;
  }
  oncomment(data) {
    let node = new Node();
    this.setupNode(node, 8, "#commment", data);
  }
  oncommentend() {
  }
  onend() {
    this.document.nw = new NW({document: this.document})
    //let b = this.document.querySelectorAll('[attach-app]');
    //let d = render(this.document);
    this.document.html = render;
  }

  onprocessinginstruction(name, data) { // xmlNode = 7
    let node = new Node();
    node.nodeType = 7;

    if (name === "!doctype") {
      this.document.doctype = node;
      let str = data.split(" ")
      node.nodeName = str[1];
      if (str.length > 2) {
        node.publicId = str[2].toLowerCase() === "public" ? str[3] : undefined;
        node.systemId = str[2].toLowerCase() === "SYSTEM" ? str[3] : node.publicId ? str[4] : undefined;
      }
      node.nodeType = 10;
    } else {
      node.nodeName = name;
    }
  }
}

function render(node) {
  let name = node.nodeName.toLowerCase();
  let r;
  switch(node.nodeType) {
    case 10:
      return "<!DOCTYPE "
        + name
        + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
        + (!node.publicId && node.systemId ? ' SYSTEM' : '')
        + (node.systemId ? ' "' + node.systemId + '"' : '')
        + '>';
    case 9:
      r = node.doctype ? render(node.doctype) : ''
      return r + renderNodes(node.childNodes)
    case 8:
      return '<!--' + node.nodeValue + '-->'
    case 3:
      return node.textContent;
    case 1:

      r = '<' + name;
      for (let i = 0, l = node.attributes.length; i < l; i++) {
        let str = node.attributes[i];
        r += ' ' + str.name
        if (str.value !== "")
          r += '="' + str.value + '"'
      }
      r += '>';
      if (node.hasChildNodes)
        r += renderNodes(node.childNodes);
      if (!voidElements[name])
      r += '</' + name + '>';
      return r;
  }
}
function renderNodes(nodes) {
  let r = ""
  for (let i = 0, l=nodes.length; i < l; i++) {
    r += render(nodes[i]);
  }
  return r;
}
const voidElements = {
  area: true,
  base: true,
  basefont: true,
  br: true,
  col: true,
  command: true,
  embed: true,
  frame: true,
  hr: true,
  img: true,
  input: true,
  isindex: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true,
}
