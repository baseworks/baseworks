export class EventTarget {
  addEventListener() {}
  removeEventListener() {}
  distPatchEvent() {
    return true
  }
}

function parentNode(object) {
  Object.defineProperty(object, "firstElementChild", {
    enumerable: true,
    get: function() {
      return this.children[0];
    }
  })
  Object.defineProperty(object, "lastElementChild", {
    enumerable: true,
    get: function() {
      return this.children[this.children.length - 1];
    }
  })
  Object.defineProperty(object, "childElementCount", {
    enumerable: true,
    get: function() {
      return this.children.length;
    }
  })
  Object.defineProperty(object, "children", {
    enumerable: true,
    get: function() {
      return this.childNodes.filter(i => i.nodeType === 1);
    }
  })
  object.prepend = function(nodes) {

  }
  object.append = function(nodes) {
    this.childNodes.push(nodes);
  }
  object.querySelector = function(selectors) {
    return this.querySelectorAll(selectors)[0];
  }
  object.querySelectorAll = function(selectors) {
    return this.nw.select(selectors, this);
  }
}



export class Node extends EventTarget {
  constructor() {
    super();
    this.parentNode = null;
    this.childNodes = [];
  }
  get parentElement() {
    let parent = this.parentNode.nodeType === 1 ? this.parentNode : this.parentNode.parentElement;
    return parent || null;
  }
  get lastChild() {
    return this.childNodes[this.childNodes.length - 1]
  }
  get firstChild() {
    return this.childNodes[0]
  }
  hasChildNodes() { return this.childNodes.length > 0 }
  contains(node) { return false; }
  insertBefore(node, child) { }
  appendChild(node) {
    if (node.parentNode) {
      //node.parentNode.removeChild(node);
    }
    this.childNodes.push(node);
    return node;
  }
  replaceChild(node, child) { }
  removeChild(child) { }
}


export class Document extends Node {
  constructor() {
    super();
    this.nodeName = "#document";
    this.nodeType = 9;
    parentNode(this);
    addElementSearch(this);
  }
  get body() {
    return this.getElementsByTagName("body")[0]
    //this.childNodes.filter(i => i.nodeType === 1 && i.nodeName === "BODY")[0];
  }
  set body(node) {
    let body = this.getElementsByTagName("body")[0];
    if (body)
      body = node;
    else
      this.childNodes.push(node);
  }
  get documentElement() {
    return this.childNodes.filter(i => i.nodeType === 1)[0];
  }
  createElement(name, options = null) {
    let element = new Element()
    element.nodeName = name.toUpperCase();
    return element;
  }
  createElementNS(namespace, qualifiedName, options = null) {}
  createTextNode(data) {}
  createCDATASection(data) {}
  createComment(data) {}
  createProcessingInstruction(target, data) {}
  importNode(node, deep = false) {}
  adoptNode(node) {}
  createAttribute(localName) {}
  createAttributeNS(namespace, qualifiedName) {}
  createEvent(context) {}
  createRange() {}
  createNodeIterator(root, whatToShow = 0xFFFFFFFF, filter = null) {}
  createTreeWalker(root, whatToShow = 0xFFFFFFFF, filter = null) {}
  getElementById(elementId) { }

}

function addElementSearch(obj) {
  obj.getElementsByTagName = function(qualifiedName) {
    let name = qualifiedName.toUpperCase();
    let r = []
    for (let i = 0, c = this.children, l = c.length; i < l; i++) {
      if (name === "*" || c[i].nodeName === name)
        r.push(c[i]);
      r = r.concat(c[i].getElementsByTagName(name))
    }
    return r;
  }
  obj.getElementsByTagNameNS = function(qualifiedName, localName) {}
  obj.getElementsByClassName = function(className) {

    return r;
  }
}

export class Element extends Node {
  constructor() {
    super();
    parentNode(this);
    this.nodeType = 1;
    this.id = undefined;
    this.className = undefined;
    this.previousElementSibling = null;
    this.nextElementSibling = null;
    addElementSearch(this);
    this.attributes = []
  }
  get tagName() {
    return this.nodeName
  }
  hasAttributes() {
    return this.attributes.length > 0;
  }
  getAttributeNmes() {}
  getAttribute(name) {
    return this.attributes[name]
  }
  getAttributeNS(namespace, localName) {}
  setAttribute(name, value) {
    let attr = this.attributes.find(i => i.name === name);
    if (attr)
      attr.value = value;
    else
      this.attributes.push({name: name, value: value, specified: true})
  }
  getAttributeNode(name) {
    return this.attributes.find(i => i.name === name.toLowerCase());
  }
  setAttributeNS(namespace, name, value) {}
  removeAttribute(name) {}
  removeAttributeNS(namespace, localName) {}
  hasAttribute(name) {}
  hasAttributeNS(namespace, localName) {}

  closest() {}
  matches() {}

  insertAdjacentElement(where, element) {}
  insertAdjacentText(where, data) {}

  before(nodes) {

  }
  after(nodes) {

  }
  replaceWith(nodes) {

  }
  remove() {

  }

}
