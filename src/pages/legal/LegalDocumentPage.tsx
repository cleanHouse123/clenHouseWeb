import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import type { LegalDocument } from "./documents";
import { legalDocumentsList } from "./documents";

interface LegalDocumentPageProps {
    document: LegalDocument;
}

export const LegalDocumentPage = ({ document }: LegalDocumentPageProps) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <Helmet>
                <title>{document.title} — Чисто дома</title>
                <meta name="description" content={document.title} />
            </Helmet>

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-5 sm:p-8">
                <article
                    className="legal-doc"
                    dangerouslySetInnerHTML={{ __html: document.html }}
                />

                <nav className="mt-10 border-t pt-6">
                    <p className="text-sm font-medium text-gray-900 mb-3">
                        Другие документы
                    </p>
                    <ul className="space-y-2">
                        {legalDocumentsList
                            .filter((item) => item.slug !== document.slug)
                            .map((item) => (
                                <li key={item.slug}>
                                    <Link
                                        to={item.path}
                                        className="text-sm text-gray-600 underline hover:text-primary"
                                    >
                                        {item.shortTitle}
                                    </Link>
                                </li>
                            ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};
