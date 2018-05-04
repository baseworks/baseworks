export class BaseRouter {
    constructor(loader) {
        this.routes = [];
        this.loader = loader;
    }

    load(moduleId, routes) {
        console.log('ok');
        for (let route of routes) {
            this.analyzePattern(route);
            route.parent = moduleId;
            this.routes.push(route);
        }
        console.log(this.routes);
    }

    analyzePattern(route) {
        route.params = [];
        let matches = route.pattern.match(/\?P<[A-Za-z_]+>/g);
        if (matches) {
            for (let m of matches) {
                let match = m.match(/<([A-Za-z_]+)>/);
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
            let found = url.match(route.re);
            if (found) {
                let params = {};
                found.splice(0, 1);
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

export function route(...items) {
    return function (target, key, desriptor) {
        target._route = items
    }
}
