export declare enum PassportTokenSource {
    UNSPECIFIED = "UNSPECIFIED",
    NAKAMA = "NAKAMA"
}
export type PassportUserInfo = {
    id?: string;
    username?: string;
    roles?: string[];
    scopes?: string[];
};
export type Passport = {
    source?: PassportTokenSource;
    user?: PassportUserInfo;
};
//# sourceMappingURL=passport.pb.d.ts.map