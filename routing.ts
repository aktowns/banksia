/// <reference path='banksia.d.ts' />

module Controllers {
    export class ApplicationController extends Banksia.Controller {

    }
}

module Banksia {
    export class Route {
        constructor(controller, method) {

        }

        call(request: Banksia.Request) {

        }
    }

    export class Router {
        private static router = null;
        private mode = null;
        private routes = [];
        public root = null;

        constructor(root = "/", mode = "history") {
            this.root = root;
            this.mode = mode;
        }

        add(re: RegExp, handler: Route) {
            this.routes.push({path: re, handler: Route});
        }

        removeHandler(handler: Route) {
            this.routes = this.routes.filter((route) => route.handler !== handler)
        }

        removePath(route: RegExp) {
            this.routes = this.routes.filter((route) => route.path !== route)
        }

        check(fragment: string = this.getFragment()) {
            this.routes
                .map((route) => { return { route: route, frag: fragment.match(route.path) }})
                .filter((check) => check.frag.length > 0)
                .forEach((check) => {
                    check.frag.shift();
                    console.log(check.frag);
                    check.route.handler.call(new Banksia.Request())
                });
        }

        static shared() {
            if (typeof this.router === null) {
                this.router = new Router()
            }
            return this.router;
        }

        private getFragment() {
            var fragment = "";
            if (this.mode === "history") {
                fragment = Router.clearSlashes(decodeURI(location.pathname + location.search)).replace(/\?(.*)$/, '');
                fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
            } else {
                var match = window.location.href.match(/#(.*)$/);
                fragment = match ? match[1] : '';
            }
            return Router.clearSlashes(fragment);
        }

        private static clearSlashes(path) {
            return path.toString().replace(/\/$/, '').replace(/^\//, '');
        }
    }
}

function defineRoutes(routes) {
    for (var k in routes) {
        if (routes.hasOwnProperty(k)) {
            var controller, method = routes[k].split('#');
            routes[k] = ((controller, method) => {
                return (request:Banksia.Request) => {
                    new Banksia.Route(controller, method)
                }
            })(controller, method);
        }
    }
    return routes;
}
