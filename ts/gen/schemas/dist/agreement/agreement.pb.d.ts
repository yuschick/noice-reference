import * as fm from "../fetch.pb";
export type AgreementRevision = {
    name?: string;
    revision?: string;
    url?: string;
};
export type ListAgreementsRequest = {
    includeOldRevisions?: boolean;
};
export type ListAgreementResponse = {
    agreements?: AgreementRevision[];
};
export declare class AgreementService {
    static ListAgreements(req: ListAgreementsRequest, initReq?: fm.InitReq): Promise<ListAgreementResponse>;
}
//# sourceMappingURL=agreement.pb.d.ts.map