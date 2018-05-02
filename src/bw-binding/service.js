import {depend} from "../bw-dependency-injection";
import {TemplateCompiler} from "../bw-templating";

@depend(TemplateCompiler)
export class BindingService {
  constructor(templateCompiler) {
    this.templateCompiler = templateCompiler;
  }
  bindView(context, view) {
    this.templateCompiler.processNode(context, view)
  }
}
