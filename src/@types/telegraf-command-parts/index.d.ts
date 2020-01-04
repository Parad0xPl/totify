interface ParsedCommand {
    text: string;
    command: string;
    bot: string;
    args: string;
    splitArgs: Array<string>;
}

declare module "telegraf-command-parts" {
    import {Middleware, ContextMessageUpdate} from "telegraf"

    function middleware(): Middleware<ContextMessageUpdate>;
    export default middleware;
}