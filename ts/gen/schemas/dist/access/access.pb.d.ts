import * as fm from "../fetch.pb";
export type Permit = {
    resourceType?: string;
    resourceId?: string;
};
export type RolesList = {
    roles?: string[];
};
export type GetRolesRequest = {
    userId?: string;
    permit?: Permit;
};
export type GetRolesResponse = {
    roles?: string[];
};
export type BatchGetRolesRequest = {
    userId?: string;
    permits?: Permit[];
};
export type BatchGetRolesResponse = {
    resourceRoles?: RolesList[];
};
export declare class RolesService {
    static GetRoles(req: GetRolesRequest, initReq?: fm.InitReq): Promise<GetRolesResponse>;
    static BatchGetRoles(req: BatchGetRolesRequest, initReq?: fm.InitReq): Promise<BatchGetRolesResponse>;
}
//# sourceMappingURL=access.pb.d.ts.map