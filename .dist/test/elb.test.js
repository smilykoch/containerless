"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_typescript_1 = require("mocha-typescript");
var chai_1 = require("chai");
var cluster_1 = require("../cluster");
var elb_1 = require("../elb");
var _ = require("lodash");
describe("with an existing cluster", function () {
    var ELBTest = (function () {
        function ELBTest() {
            this.opts = {
                id: "arn:aws:ecs:ap-southeast-2:000000000001:cluster/ECSCluster-XXXXXXXXXXXXX",
                security_group: "sg-abcdef",
                vpcId: "vpc-1",
                protocol: ["HTTP"],
                subnets: ["subnet-12359e64", "subnet-b442c0d0", "subnet-a2b967fb"]
            };
        }
        ELBTest.prototype.before = function () {
            var cluster = new cluster_1.Cluster(this.opts, "TestName");
            this.elb = new elb_1.ELB(cluster);
            this.resources = this.elb.generate();
        };
        ELBTest.prototype.elb_resource = function () {
            var result = _.get(this.resources, "ClsELB.Type");
            chai_1.expect(result).to.eql("AWS::ElasticLoadBalancingV2::LoadBalancer");
        };
        ELBTest.prototype.elb_resource_security_group = function () {
            var result = _.get(this.resources, "ClsELB.Properties.SecurityGroups");
            chai_1.expect(result).to.eql([this.opts.security_group]);
        };
        ELBTest.prototype.elb_resource_subnets = function () {
            var result = _.get(this.resources, "ClsELB.Properties.Subnets");
            chai_1.expect(result).to.eql(this.opts.subnets);
        };
        ELBTest.prototype.elb_resource_vpcId = function () {
            var result = _.get(this.resources, "ClsHTTPTargetGroup.Properties.VpcId");
            chai_1.expect(result).to.eql(this.opts.vpcId);
        };
        return ELBTest;
    }());
    __decorate([
        mocha_typescript_1.test
    ], ELBTest.prototype, "elb_resource", null);
    __decorate([
        mocha_typescript_1.test
    ], ELBTest.prototype, "elb_resource_security_group", null);
    __decorate([
        mocha_typescript_1.test
    ], ELBTest.prototype, "elb_resource_subnets", null);
    __decorate([
        mocha_typescript_1.test
    ], ELBTest.prototype, "elb_resource_vpcId", null);
    ELBTest = __decorate([
        mocha_typescript_1.suite
    ], ELBTest);
});
describe("creating a new cluster with HTTP and HTTPS", function () {
    var ELBTest = (function () {
        function ELBTest() {
            this.opts = {
                vpcId: "vpc-1",
                subnets: ["subnet-12359e64", "subnet-b442c0d0", "subnet-a2b967fb"],
                protocol: ["HTTP", "HTTPS"],
                certificate: "arn:aws:acm:ap-southeast-2:000000000001:certificate/95898b22-e903-4d31-a50a-a0d4473aa077"
            };
        }
        ELBTest.prototype.before = function () {
            var cluster = new cluster_1.Cluster(this.opts, "TestName");
            this.elb = new elb_1.ELB(cluster);
            this.resources = this.elb.generate();
        };
        ELBTest.prototype.generates_http_listener = function () {
            var result = _.get(this.resources, "ClsHTTPTargetGroup.Properties.Port");
            chai_1.expect(result).to.eql(80);
        };
        ELBTest.prototype.generates_https_listener = function () {
            var result = _.get(this.resources, "ClsHTTPSTargetGroup.Properties.Port");
            chai_1.expect(result).to.eql(443);
        };
        return ELBTest;
    }());
    __decorate([
        mocha_typescript_1.test
    ], ELBTest.prototype, "generates_http_listener", null);
    __decorate([
        mocha_typescript_1.test
    ], ELBTest.prototype, "generates_https_listener", null);
    ELBTest = __decorate([
        mocha_typescript_1.suite
    ], ELBTest);
});
describe("creating a new cluster with HTTP", function () {
    var ELBTest = (function () {
        function ELBTest() {
            this.opts = {
                vpcId: "vpc-1",
                subnets: ["subnet-12359e64", "subnet-b442c0d0", "subnet-a2b967fb"],
                protocol: ["HTTP"]
            };
        }
        ELBTest.prototype.before = function () {
            var cluster = new cluster_1.Cluster(this.opts, "TestName");
            this.elb = new elb_1.ELB(cluster);
            this.resources = this.elb.generate();
        };
        ELBTest.prototype.elb_resource = function () {
            var result = _.get(this.resources, "ClsELB.Type");
            chai_1.expect(result).to.eql("AWS::ElasticLoadBalancingV2::LoadBalancer");
        };
        ELBTest.prototype.elb_listener_certificate = function () {
            var result = _.get(this.resources, "ClsHTTPListener.Properties.Certificates[0].CertificateArn");
            chai_1.expect(result).to.be.empty;
        };
        ELBTest.prototype.elb_resource_subnets = function () {
            var result = _.get(this.resources, "ClsELB.Properties.Subnets");
            chai_1.expect(result).to.eql(this.opts.subnets);
        };
        ELBTest.prototype.elb_resource_vpcId = function () {
            var result = _.get(this.resources, "ClsHTTPTargetGroup.Properties.VpcId");
            chai_1.expect(result).to.eql(this.opts.vpcId);
        };
        ELBTest.prototype.generates_http_listener = function () {
            var result = _.get(this.resources, "ClsHTTPTargetGroup.Properties.Port");
            chai_1.expect(result).to.eql(80);
        };
        return ELBTest;
    }());
    __decorate([
        mocha_typescript_1.test
    ], ELBTest.prototype, "elb_resource", null);
    __decorate([
        mocha_typescript_1.test
    ], ELBTest.prototype, "elb_listener_certificate", null);
    __decorate([
        mocha_typescript_1.test
    ], ELBTest.prototype, "elb_resource_subnets", null);
    __decorate([
        mocha_typescript_1.test
    ], ELBTest.prototype, "elb_resource_vpcId", null);
    __decorate([
        mocha_typescript_1.test
    ], ELBTest.prototype, "generates_http_listener", null);
    ELBTest = __decorate([
        mocha_typescript_1.suite
    ], ELBTest);
});
