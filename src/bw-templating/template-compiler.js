import {HtmlComponent} from "bw-component";
import {Loader} from "bw-loader";
import {depend} from "bw-dependency-injection";
import {BindingCollection} from "bw-binding/binding";
import {BindingContext, BindingObserver, Parser} from 'bw-binding';

@depend(Loader, BindingCollection)
export class TemplateCompiler {
    constructor(loader, bindingCollection) {
        this.parser = new Parser();
        this.bindings = bindingCollection;
        this.loader = loader;
    }
    compileComponent(context, node, content) {
        let template = document.createElement('div');
        template.innerHTML = content.view;
        let view = template.firstElementChild;
        this.processNode(content.viewModel, view);
        this.bindings.filterByContext(context);

        node.innerHTML = '';
        node.appendChild(view);
    }

    processNode(context, node) {
        const component = HtmlComponent.list.find(i => i.name.toUpperCase() === node.tagName);
        if (component) {
           this.loader.findView(component)
               .then(content => this.compileComponent(context, node, content));
        }
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
                            let r = text.substring(0, length);
                            let expression = this.parser.parse(r);
                            let binding = this.bindings.find(expression, context);
                            if (!binding)
                                binding = this.bindings.add(new BindingContext(expression, context));
                            binding.addObserver(new BindingObserver(node, "textContent"));
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
                let bindingAttr = a.name.split(':');
                if (bindingAttr.length > 1) {
                    let attr = bindingAttr[0].toCamel();
                    let method = bindingAttr[1];
                    let expr = a.value;
                    let expression = this.parser.parse(expr);
                    let binding = this.bindings.find(expression, context);

                    if (!binding)
                        binding = this.bindings.add(new BindingContext(expression, context));

                    binding.addObserver(new BindingObserver(node, attr));
                    if (attr === "value" || attr === "textContent")
                        node[attr] = binding.evaluate();
                    else
                        node.setAttribute(attr, binding.evaluate(context));

                    if (node.tagName.toLowerCase() === "input") {
                        let listener = e => {
                            binding.assign(node.value)
                        };
                        node.addEventListener("change", listener);
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

if (typeof String.prototype.toCamel !== 'function') {
    String.prototype.toCamel = function () {
        return this.replace(/[-]([a-z])/g, function (g) {
            return g[1].toUpperCase();
        })
    };
}
