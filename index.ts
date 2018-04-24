import * as _ from "lodash";

const execSync = require("child_process").execSync;

import { Command, Serverless } from "./serverless";

import { prepare } from "./factory";

class ServerlessPlugin {
  public opts: any;
  public tag: string;

  public provider: string;

  private serverless: Serverless;
  private applications: any[];

  private commands: { [key: string]: Command };
  private hooks: { [key: string]: any };

  constructor(serverless: any, options: any) {
    this.serverless = serverless;
    this.provider = this.serverless.getProvider("aws");

    this.tag = this.getTag();
    this.opts = this.getOptions();

    this.commands = {
      "cls-build": {
        usage: "Build an ECS cluster",
        lifecycleEvents: ["run"]
      }
    };

    this.hooks = {
      "package:compileFunctions": this.compile,
      "package:createDeploymentArtifacts": this.build,
      "cls-build:run": this.build
    };
  }

  public compile = () => {
    this.opts = this.getOptions();
    const Resources = this.serverless.service.provider
      .compiledCloudFormationTemplate.Resources;

    const resources = prepare(this.tag, this.opts);
    _.each(resources, resource => {
      this.serverless.cli.log(`Building resources for ${resource.name}`);
      _.merge(Resources, resource.generate());
    });
  };

  public build = () => {
    this.opts = this.getOptions();
    this.serverless.cli.log("Configuring containerless");
    _.each(this.opts.applications, (app, name: string) => {
      this.serverless.cli.log(`Building service ${name}`);

      if (!app.src) {
        app.src = name;
      }
      const opts = {
        path: `${this.serverless.config.servicePath}/${app.src}`,
        image: `${this.opts.repository}:${name}-${this.tag}`
      };
      this.dockerBuildAndPush(_.merge(opts, app));
    });
  };

  public dockerBuildAndPush(app: { image: string; path: string }) {
    this.dockerBuild(app.path, app.image);
    this.dockerLogin(this.serverless.service.provider.profile);
    this.dockerPush(app.image);
    this.serverless.cli.log(`Built with tag: ${this.tag}`);
  }

  public dockerLogin(profile: string) {
    const command = `eval $(aws ecr get-login --no-include-email --profile ${profile})`;

    this.serverless.cli.log(`Signing in to ECR with AWS profile [${profile}]`);

    let stdio = null;
    if (process.env.SLS_DEBUG) {
      this.serverless.cli.log(command);
      stdio = [0, 1, 2];
    }

    const result = execSync(command, { stdio });
    // this.serverless.cli.log(result);
  }

  public dockerPush(tag: string) {
    const command = `docker push ${tag}`;

    this.serverless.cli.log(`Pushing image ${tag}`);

    let stdio = null;
    if (process.env.SLS_DEBUG) {
      this.serverless.cli.log(command);
      stdio = [0, 1, 2];
    }

    const result = execSync(command, { stdio });
    // this.serverless.cli.log(result);
  }

  public dockerBuild(path: string, tag: string) {
    const command = `docker build -t ${tag} ${path}`;

    this.serverless.cli.log(`Building image ${tag} at ${path}`);

    let stdio = null;
    if (process.env.SLS_DEBUG) {
      this.serverless.cli.log(command);
      stdio = [0, 1, 2];
    }
    const result = execSync(command, { stdio });
    // this.serverless.cli.log(result);
  }

  public getTag() {
    if (this.serverless.processedInput.options.tag) {
      return this.serverless.processedInput.options.tag;
    } else {
      return Math.floor(Date.now() / 1000);
    }
  }

  public getOptions() {
    if (this.hasOptions) {
      return _.merge(
        { service: this.serverless.service.service },
        this.serverless.service.custom.containerless
      );
    }
  }

  public hasOptions() {
    return (
      this.serverless.service.custom &&
      this.serverless.service.custom.containerless
    );
  }
}

export = ServerlessPlugin;
