declare module 'randomatic' {
    interface RandomaticOptions {
        chars?: string;
        exclude?: string|Array<string>;
    }
    function randomatic(pattern: string, length?: number, options?: RandomaticOptions): string

    export = randomatic;
}

