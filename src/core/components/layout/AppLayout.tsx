import { Header } from './Header';
import { FooterSection } from './footer/FooterSection';
import { ScrollToTop } from '../ScrollToTop';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background">
            <ScrollToTop />
            <Header />
            <main className="pt-[60px] md:pt-24">
                {children}
            </main>
            <FooterSection />
        </div>
    );
};
