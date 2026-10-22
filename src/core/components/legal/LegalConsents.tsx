import { useState } from 'react';
import { Checkbox } from '@/core/components/ui/inputs/checkbox';
import { cn } from '@/core/lib/utils';
import { legalDocuments } from '@/pages/legal/documents';

/**
 * Согласия, которые пользователь даёт до передачи персональных данных.
 * Требования: отдельные чек-боксы, галочки заранее не проставлены,
 * политика не выносится в отдельный чек-бокс (ссылка внутри согласия на ПДн).
 */
export interface LegalConsentsState {
    /** Оферта и пользовательское соглашение */
    terms: boolean;
    /** Согласие на обработку персональных данных (включает поручение третьим лицам) */
    personalData: boolean;
    /** Согласие на рекламную рассылку — необязательное */
    marketing: boolean;
}

export const EMPTY_LEGAL_CONSENTS: LegalConsentsState = {
    terms: false,
    personalData: false,
    marketing: false,
};

export const hasRequiredConsents = (consents: LegalConsentsState): boolean =>
    consents.terms && consents.personalData;

export const useLegalConsents = () => {
    const [consents, setConsents] = useState<LegalConsentsState>(EMPTY_LEGAL_CONSENTS);

    const resetConsents = () => setConsents(EMPTY_LEGAL_CONSENTS);

    return {
        consents,
        setConsents,
        resetConsents,
        hasRequired: hasRequiredConsents(consents),
    };
};

const DocumentLink = ({ path, children }: { path: string; children: string }) => (
    <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2"
        onClick={(event) => event.stopPropagation()}
    >
        {children}
    </a>
);

interface ConsentRowProps {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    children: React.ReactNode;
}

const ConsentRow = ({ id, checked, onChange, children }: ConsentRowProps) => (
    <div className="flex items-start gap-2.5">
        <Checkbox
            id={id}
            checked={checked}
            onCheckedChange={(value) => onChange(value === true)}
            className="mt-0.5 h-5 w-5 rounded-md"
        />
        <label htmlFor={id} className="text-xs leading-snug text-muted-foreground cursor-pointer">
            {children}
        </label>
    </div>
);

interface LegalConsentsProps {
    value: LegalConsentsState;
    onChange: (consents: LegalConsentsState) => void;
    /**
     * full — регистрация и первый заказ (оферта, ПДн, реклама);
     * order — оформление заказа, когда согласия уже даны при регистрации.
     */
    variant?: 'full' | 'order';
    className?: string;
}

export const LegalConsents = ({
    value,
    onChange,
    variant = 'full',
    className,
}: LegalConsentsProps) => {
    const idPrefix = variant === 'order' ? 'order-consent' : 'auth-consent';

    return (
        <div className={cn('space-y-2.5', className)}>
            <ConsentRow
                id={`${idPrefix}-terms`}
                checked={value.terms}
                onChange={(checked) => onChange({ ...value, terms: checked })}
            >
                Я принимаю условия{' '}
                <DocumentLink path={legalDocuments.offer.path}>Оферты</DocumentLink> и{' '}
                <DocumentLink path={legalDocuments['terms-of-service'].path}>
                    Пользовательского соглашения
                </DocumentLink>
            </ConsentRow>

            {variant === 'full' && (
                <>
                    <ConsentRow
                        id={`${idPrefix}-personal-data`}
                        checked={value.personalData}
                        onChange={(checked) => onChange({ ...value, personalData: checked })}
                    >
                        Я даю{' '}
                        <DocumentLink path={legalDocuments['consent-personal-data'].path}>
                            Согласие на обработку своих персональных данных
                        </DocumentLink>{' '}
                        в соответствии с{' '}
                        <DocumentLink path={legalDocuments['privacy-policy'].path}>
                            Политикой конфиденциальности
                        </DocumentLink>
                    </ConsentRow>

                    <ConsentRow
                        id={`${idPrefix}-marketing`}
                        checked={value.marketing}
                        onChange={(checked) => onChange({ ...value, marketing: checked })}
                    >
                        Я даю{' '}
                        <DocumentLink path={legalDocuments['consent-marketing'].path}>
                            Согласие на рекламную рассылку
                        </DocumentLink>{' '}
                        <span className="text-gray-400">(необязательно)</span>
                    </ConsentRow>
                </>
            )}
        </div>
    );
};
