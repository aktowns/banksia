/// <reference path='banksia.d.ts' />

module Banksia {
    export interface IRenderable {
        render(): string
    }

    export interface IResponse extends IRenderable {

    }

    export class Status implements IResponse {
        private code = 0;
        private message = "";

        constructor(code, message) {
            this.code = code;
            this.message = message;
        }

        render() {
            return "200";
        }

        static Ok(message: string = "Ok") {
            return new Status(200, message);
        }

        static NotFound(message: string = "Not Found") {
            return new Status(404, message);
        }
    }

    export class View implements IRenderable {
        render() {
            return ""
        }
    }
}
