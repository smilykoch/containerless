declare class ServerlessPlugin {
    opts: any;
    tag: string;
    provider: string;
    private serverless;
    private applications;
    private commands;
    private hooks;
    constructor(serverless: any, options: any);
    compile: () => void;
    build: () => void;
    dockerBuildAndPush(app: {
        image: string;
        path: string;
    }): void;
    dockerPush(tag: string): void;
    dockerBuild(path: string, tag: string): void;
    getTag(): any;
    getOptions(): any;
    hasOptions(): any;
}
export = ServerlessPlugin;
