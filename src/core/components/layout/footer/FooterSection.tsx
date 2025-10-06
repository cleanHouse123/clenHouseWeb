import React from 'react';
import { Logo } from '@/core/components/ui';
import { FooterLink } from './components/FooterLink';
import { FooterText } from './components/FooterText';
import { footerLinks, footerLegalLinks, footerContact } from './components/FooterData';

export const FooterSection: React.FC = () => {
    return (
        <footer className="pt-[40px] sm:pt-[60px] md:pt-[80px] lg:pt-[100px] pb-6 sm:pb-8 md:pb-10">
            <div className="px-4 sm:px-8 lg:px-16">
                {/* Верхняя часть */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 sm:gap-8">
                    {/* Левая группа: только логотип на lg+ */}
                    <div className="hidden lg:block lg:flex-shrink-0">
                        <div className="h-[48px] flex items-center">
                            <Logo size="xl" />
                        </div>
                    </div>

                    {/* Центральная группа: логотип на <lg, контакты на lg+ */}
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6 lg:gap-[50px] lg:flex-shrink-0">
                        {/* Логотип только на мобильных и планшетах */}
                        <div className="lg:hidden h-[48px] flex items-center justify-center sm:justify-start flex-shrink-0">
                            <Logo size="xl" />
                        </div>

                        {/* Контакты только на lg+ */}
                        <div className="hidden lg:flex flex-col gap-2 flex-shrink-0">
                            <FooterText>{footerContact.title}</FooterText>
                            <FooterText size="xl" weight="medium" opacity="90">{footerContact.phone}</FooterText>
                            <FooterText size="lg" opacity="80">{footerContact.email}</FooterText>
                        </div>
                    </div>

                    {/* Правая группа: ссылки + контакты на <lg */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 md:gap-[40px] pt-0 sm:pt-3">
                        {/* Контакты на мобильных и планшетах */}
                        <div className="lg:hidden flex flex-col gap-2 w-full sm:w-auto text-center sm:text-left">
                            <FooterText>{footerContact.title}</FooterText>
                            <FooterText size="xl" weight="medium" opacity="90">{footerContact.phone}</FooterText>
                            <FooterText size="lg" opacity="80">{footerContact.email}</FooterText>
                        </div>

                        {/* Ссылки */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 md:gap-[40px]">
                            <div className="flex flex-col gap-[11px] w-full sm:w-[114px] text-center sm:text-left">
                                {footerLinks.main.map((link) => (
                                    <FooterLink key={link.text} href={link.href}>
                                        {link.text}
                                    </FooterLink>
                                ))}
                            </div>
                            <div className="flex flex-col gap-[11px] w-full sm:w-auto text-center sm:text-left">
                                {footerLinks.support.map((link) => (
                                    <FooterLink key={link.text} href={link.href}>
                                        {link.text}
                                    </FooterLink>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Нижняя полоса */}
                <div className="pt-6 sm:pt-8 md:pt-10 lg:pt-[50px] flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[40px]">
                    <FooterText opacity="40" className="order-2 sm:order-1">2025</FooterText>
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-[40px] order-1 sm:order-2">
                        {footerLegalLinks.map((link) => (
                            <FooterLink
                                key={link.text}
                                href={link.href}
                                className="text-[12px] sm:text-[13px] md:text-[14px] hover:text-[rgba(0,0,0,0.6)] text-center"
                            >
                                {link.text}
                            </FooterLink>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};
