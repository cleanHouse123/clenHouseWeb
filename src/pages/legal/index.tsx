import { LegalDocumentPage } from "./LegalDocumentPage";
import { legalDocuments } from "./documents";

export const OfferPage = () => (
    <LegalDocumentPage document={legalDocuments.offer} />
);

export const PrivacyPolicyPage = () => (
    <LegalDocumentPage document={legalDocuments["privacy-policy"]} />
);

export const ConsentPersonalDataPage = () => (
    <LegalDocumentPage document={legalDocuments["consent-personal-data"]} />
);

export const ConsentMarketingPage = () => (
    <LegalDocumentPage document={legalDocuments["consent-marketing"]} />
);

export const TermsOfServicePage = () => (
    <LegalDocumentPage document={legalDocuments["terms-of-service"]} />
);

export { LegalDocumentPage } from "./LegalDocumentPage";
export * from "./documents";
