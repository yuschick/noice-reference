import * as fm from "../fetch.pb";
export declare enum StreamDeploymentStatusComponentStatus {
    COMPONENT_STATUS_UNSPECIFIED = "COMPONENT_STATUS_UNSPECIFIED",
    COMPONENT_STATUS_DISABLED = "COMPONENT_STATUS_DISABLED",
    COMPONENT_STATUS_OFFLINE = "COMPONENT_STATUS_OFFLINE",
    COMPONENT_STATUS_DEPLOYMENT_STARTED = "COMPONENT_STATUS_DEPLOYMENT_STARTED",
    COMPONENT_STATUS_PROVISIONING_NODE = "COMPONENT_STATUS_PROVISIONING_NODE",
    COMPONENT_STATUS_DEPLOYING_POD = "COMPONENT_STATUS_DEPLOYING_POD",
    COMPONENT_STATUS_DEPLOYING_CONTAINERS = "COMPONENT_STATUS_DEPLOYING_CONTAINERS",
    COMPONENT_STATUS_CONTAINERS_UNREADY = "COMPONENT_STATUS_CONTAINERS_UNREADY",
    COMPONENT_STATUS_READY = "COMPONENT_STATUS_READY"
}
export type ListDeploymentOptionsRequest = {};
export type DeploymentOptionsListItem = {
    channelId?: string;
    options?: DeploymentOptions;
};
export type ListDeploymentOptionsResponse = {
    items?: DeploymentOptionsListItem[];
};
export type CreateDeploymentOptionsRequest = {
    channelId?: string;
    options?: DeploymentOptions;
};
export type CreateDeploymentOptionsResponse = {};
export type UpdateDeploymentOptionsRequest = {
    channelId?: string;
    options?: DeploymentOptions;
};
export type UpdateDeploymentOptionsResponse = {};
export type GetDeploymentOptionsRequest = {
    channelId?: string;
};
export type GetDeploymentOptionsResponse = {
    options?: DeploymentOptions;
};
export type DeleteDeploymentOptionsRequest = {
    channelId?: string;
};
export type DeleteDeploymentOptionsResponse = {};
export type DeploymentOptions = {
    mlDisabled?: boolean;
    mlImage?: string;
    crDisabled?: boolean;
    crImage?: string;
    recDisabled?: boolean;
    recImage?: string;
    crEnvVars?: {
        [key: string]: string;
    };
    mlTritonImage?: string;
    mlEnvVars?: {
        [key: string]: string;
    };
    restreamerDisabled?: boolean;
    restreamerImage?: string;
    restreamerEnvVars?: {
        [key: string]: string;
    };
    mlProxyImage?: string;
    matchGameRunnerImage?: string;
    matchGameRunnerEnvVars?: {
        [key: string]: string;
    };
    matchGameRunnerDisabled?: boolean;
};
export type StreamDeploymentStatus = {
    channelId?: string;
    updateTime?: string;
    crStatus?: StreamDeploymentStatusComponentStatus;
    mlStatus?: StreamDeploymentStatusComponentStatus;
    recStatus?: StreamDeploymentStatusComponentStatus;
    streamId?: string;
    restreamerStatus?: StreamDeploymentStatusComponentStatus;
    egressStatus?: StreamDeploymentStatusComponentStatus;
    gameRunnerStatus?: StreamDeploymentStatusComponentStatus;
};
export declare class StreamDeploymentOptionsService {
    static GetDeploymentOptions(req: GetDeploymentOptionsRequest, initReq?: fm.InitReq): Promise<GetDeploymentOptionsResponse>;
    static ListDeploymentOptions(req: ListDeploymentOptionsRequest, initReq?: fm.InitReq): Promise<ListDeploymentOptionsResponse>;
    static CreateDeploymentOptions(req: CreateDeploymentOptionsRequest, initReq?: fm.InitReq): Promise<CreateDeploymentOptionsResponse>;
    static UpdateDeploymentOptions(req: UpdateDeploymentOptionsRequest, initReq?: fm.InitReq): Promise<UpdateDeploymentOptionsResponse>;
    static DeleteDeploymentOptions(req: DeleteDeploymentOptionsRequest, initReq?: fm.InitReq): Promise<DeleteDeploymentOptionsResponse>;
}
//# sourceMappingURL=deployment.pb.d.ts.map