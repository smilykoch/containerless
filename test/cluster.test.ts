import { suite, test, slow, timeout, skip, only } from "mocha-typescript";

import { expect } from "chai";

import { Cluster } from "../cluster";

import * as _ from "lodash";

declare function describe(desc: string, cb: any): any;

describe("with existing cluster", () => {
  @suite
  class ClusterTest {
    opts = {
      id:
        "arn:aws:ecs:ap-southeast-2:005213230316:cluster/vtha-ECSCluster-1A5ZYNUN7X46N",
      security_group: "sg-abcdef",
      vpcId: "vpc-1",
      subnets: ["subnet-12359e64", "subnet-b442c0d0", "subnet-a2b967fb"]
    };

    cluster: Cluster;

    before() {
      this.cluster = new Cluster(this.opts, "TestName");
    }

    @test
    id() {
      expect(this.cluster.id).to.eq(this.opts.id);
    }

    @test
    resources_empty() {
      expect(this.cluster.generate()).to.be.empty;
    }
  }
});

describe("create a new cluster with HTTPS", () => {
  @suite
  class ClusterTest {
    opts = {
      vpcId: "vpc-1",
      subnets: ["subnet-12359e64", "subnet-b442c0d0", "subnet-a2b967fb"],
      privateSubnets: [
        "privateSubnet-12359e64",
        "privateSubnet-b442c0d0",
        "privateSubnet-a2b967fb"
      ],
      protocol: "HTTPS",
      certificate:
        "arn:aws:acm:ap-southeast-2:000000000001:certificate/95898b22-e903-4d31-a50a-a0d4473aa077"
    };

    cluster: Cluster;
    before() {
      this.cluster = new Cluster(this.opts, "TestName");
    }

    @test
    id() {
      expect(this.cluster.id).to.eql({ Ref: "ClsCluster" });
    }

    @test
    resources_not_empty() {
      expect(this.cluster.generate()).to.not.be.empty;
    }

    @test
    sets_protocol() {
      expect(this.cluster.protocol).to.eql(["HTTPS"]);
    }

    @test
    sets_privateSubnets() {
      expect(this.cluster.privateSubnets).to.eql(this.opts.privateSubnets);
    }
  }
});

describe("create a new cluster with both HTTP and HTTPS", () => {
  @suite
  class ClusterTest {
    opts = {
      vpcId: "vpc-1",
      subnets: ["subnet-12359e64", "subnet-b442c0d0", "subnet-a2b967fb"],
      protocol: ["HTTP", "HTTPS"],
      certificate:
        "arn:aws:acm:ap-southeast-2:000000000001:certificate/95898b22-e903-4d31-a50a-a0d4473aa077"
    };

    cluster: Cluster;
    before() {
      this.cluster = new Cluster(this.opts, "TestName");
    }

    @test
    id() {
      expect(this.cluster.id).to.eql({ Ref: "ClsCluster" });
    }

    @test
    resources_not_empty() {
      expect(this.cluster.generate()).to.not.be.empty;
    }

    @test
    sets_protocol() {
      console.log(this.cluster.protocol);
      expect(this.cluster.protocol).to.eql(["HTTP", "HTTPS"]);
    }
  }
});

describe("create a new cluster with HTTP", () => {
  @suite
  class ClusterTest {
    opts = {
      vpcId: "vpc-1",
      subnets: ["subnet-12359e64", "subnet-b442c0d0", "subnet-a2b967fb"],
      protocol: "HTTP"
    };

    clusterName = "clsClusterName";

    cluster: Cluster;

    before() {
      this.cluster = new Cluster(this.opts, this.clusterName);
    }

    @test
    id() {
      expect(this.cluster.id).to.eql({ Ref: "ClsCluster" });
    }

    @test
    resources_not_empty() {
      expect(this.cluster.generate()).to.not.be.empty;
    }

    @test
    resources_cluster_name() {
      expect(this.cluster.name).to.eql("clsClusterName");
    }

    @test
    sets_protocol() {
      expect(this.cluster.protocol).to.eql(["HTTP"]);
    }
  }
});
