import { Resource } from "./resource";
export declare class Cluster implements Resource {
    amiIds: any;
    clusterName: string;
    subnets: string;
    privateSubnets: string;
    vpcId: string;
    certificate: string;
    protocol: Array<string>;
    private _id;
    private _securityGroup;
    private capacity;
    private instance_type;
    private key_name;
    private max_size;
    private min_size;
    private region;
    private size;
    private max_memory_threshold;
    constructor(opts: any, clusterName: string);
    readonly defaultListenerName: string;
    readonly defaultTargetGroupName: string;
    requireVpcId(): void;
    requireCertificate(): void;
    requireSubnets(): void;
    requireSecurityGroup(): void;
    ami(): any;
    readonly name: string;
    readonly id: string | {
        Ref: string;
    };
    readonly securityGroup: string | {
        Ref: string;
    };
    readonly elbRole: {
        Ref: string;
    };
    generate(): any;
}
