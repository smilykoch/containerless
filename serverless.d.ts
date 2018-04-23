export interface Config {
  servicePath: string;
}
export interface CLI {
  log(msg: string): void;
}
export interface Service {
  custom: any;
  provider: any;
  service: string;
}
export interface Input {
  options: any;
}
export interface Serverless {
  cli: CLI;
  config: Config;
  service: Service;
  processedInput: Input;
}
export interface Command {
  usage: String;
  lifecycleEvents: Array<string>;
  options?: {
    [key: string]: any;
  };
}
export interface CommandMap {
  [key: string]: Command;
}
export interface HookMap {
  [key: string]: any;
}
