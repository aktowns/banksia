/// <reference path='banksia.d.ts' />

module Banksia {

    export class Request {
        public params: {string: string};
    }

    export interface IController {

    }

    export class Controller implements IController{
        public request: Request;
        constructor(request: Request) {
            this.request = request;
        }
    }
}