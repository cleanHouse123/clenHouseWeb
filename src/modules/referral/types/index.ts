export interface ReferralLink {
        id: string;
        token: string;
        type: AdTokenType.REFERRAL;
        reference: string;
        clickCount: number;
        createdAt: Date;
        users: any[];
}

export enum AdTokenType {
    ADS = 'ad',
    REFERRAL = 'referral',
}
  