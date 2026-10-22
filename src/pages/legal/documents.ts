import consentMarketingHtml from "./content/consent-marketing.html?raw";
import consentPersonalDataHtml from "./content/consent-personal-data.html?raw";
import offerHtml from "./content/offer.html?raw";
import privacyPolicyHtml from "./content/privacy-policy.html?raw";
import termsOfServiceHtml from "./content/terms-of-service.html?raw";

export type LegalDocumentSlug =
    | "offer"
    | "privacy-policy"
    | "consent-personal-data"
    | "consent-marketing"
    | "terms-of-service";

export interface LegalDocument {
    slug: LegalDocumentSlug;
    /** Путь страницы документа на сайте */
    path: string;
    /** Полное название, выводится в заголовке страницы и в title */
    title: string;
    /** Короткое название для футера, меню и чек-боксов */
    shortTitle: string;
    /** Редакция документа */
    revision: string;
    html: string;
}

export const LEGAL_REVISION = "22 октября 2026 г.";

export const legalDocuments: Record<LegalDocumentSlug, LegalDocument> = {
    offer: {
        slug: "offer",
        path: "/offer",
        title: "Публичная оферта на оказание услуг по выносу бытовых отходов",
        shortTitle: "Публичная оферта",
        revision: LEGAL_REVISION,
        html: offerHtml,
    },
    "privacy-policy": {
        slug: "privacy-policy",
        path: "/privacy-policy",
        title: "Политика конфиденциальности",
        shortTitle: "Политика конфиденциальности",
        revision: LEGAL_REVISION,
        html: privacyPolicyHtml,
    },
    "consent-personal-data": {
        slug: "consent-personal-data",
        path: "/consent-personal-data",
        title: "Согласие на обработку персональных данных",
        shortTitle: "Согласие на обработку персональных данных",
        revision: LEGAL_REVISION,
        html: consentPersonalDataHtml,
    },
    "consent-marketing": {
        slug: "consent-marketing",
        path: "/consent-marketing",
        title: "Согласие на получение рекламной рассылки",
        shortTitle: "Согласие на рекламную рассылку",
        revision: LEGAL_REVISION,
        html: consentMarketingHtml,
    },
    "terms-of-service": {
        slug: "terms-of-service",
        path: "/terms-of-service",
        title: "Пользовательское соглашение",
        shortTitle: "Пользовательское соглашение",
        revision: LEGAL_REVISION,
        html: termsOfServiceHtml,
    },
};

/** Порядок документов для футера и меню */
export const legalDocumentsList: LegalDocument[] = [
    legalDocuments.offer,
    legalDocuments["privacy-policy"],
    legalDocuments["consent-personal-data"],
    legalDocuments["consent-marketing"],
    legalDocuments["terms-of-service"],
];
