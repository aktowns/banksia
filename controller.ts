/// <reference path='banksia.d.ts' />

module Banksia {

    export class Request {
        public params: {string: string};
    }

    export interface CRUD {
        index?(): Promise<IRenderable>
        create?(): Promise<IRenderable>
        show?(id: number): Promise<IRenderable>
        update?(id: number): Promise<IRenderable>
        destroy?(id: number): Promise<IRenderable>
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