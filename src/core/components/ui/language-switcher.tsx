import { Button } from './button';
import { useLocale, Locale } from '@/core/feauture/locale/useLocale';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
    const { locale, setLocale } = useLocale();

    const toggleLanguage = () => {
        setLocale(locale === 'ru' ? 'en' : 'ru');
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2"
        >
            <Languages className="h-4 w-4" />
            {locale === 'ru' ? 'RU' : 'EN'}
        </Button>
    );
}
