export function component(options) {
  return function(target, key, descriptor) {
      console.log(target);
      console.log(key);
      console.log(descriptor);

    target.__renderable__ = { ...options };
            console.log('adding...' + target);

    HtmlComponent.list.push({
        target: target,
        name: target.name,

    })
  }
}
export class HtmlComponent {
    static list = [];

    add(item) {
        HtmlComponent.list.push(item)
    }
}