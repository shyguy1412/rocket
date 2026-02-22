declare module 'meta:api*' {
    const route: string;
    export default route;
}

//plugins only affect the language server
//so this is needed for tsc
declare module '*.module.css' {
    const style: Record<string, string>;
    export default style;
}
