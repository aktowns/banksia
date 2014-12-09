/// <reference path='banksia.d.ts' />

module Controllers {
    export class ApplicationController extends Banksia.Controller {

    }
}

module Banksia {
    export class Route {
        private controller;
        private method;

        constructor(controller, method) {
            this.controller = controller;
            this.method = method;
        }

        exec(request: Banksia.Request) {
            console.log(Controllers[this.controller]);
            (new Controllers[this.controller])[this.method](request);
        }
    }

    export class Router {
        private static sharedRouter = null;
        private mode = null;
        private routes = [];
        public root = null;

        constructor(root = "/", mode = "history") {
            this.root = root;
            this.mode = mode;
        }

        add(re: RegExp, handler: Route) {
            console.log("Adding: ", handler);
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
                .filter((check) => check.frag !== null)
                .forEach((check) => {
                    check.frag.shift();
                    console.log(check.route.handler);
                    check.route.handler.exec(new Banksia.Request())
                });
        }

        static getInstance() {
            if (Router.sharedRouter === null) {
                Router.sharedRouter = new Router()
            }
            return Router.sharedRouter;
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
    var router = Banksia.Router.getInstance();
    for (var k in routes) {
        if (routes.hasOwnProperty(k)) {
            var split = routes[k].split('#');
            var controller = split[0], method = split[1];
            ((controller, method) => {
                var route = new Banksia.Route(controller, method);
                router.add(new RegExp(k), route)
            })(controller, method);
        }
    }
}
