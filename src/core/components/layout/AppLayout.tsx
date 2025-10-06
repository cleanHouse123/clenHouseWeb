import { Header } from './Header';
import { FooterSection } from './footer/FooterSection';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-[60px] md:pt-24">
                {children}
            </main>
            <FooterSection />
        </div>
    );
};
