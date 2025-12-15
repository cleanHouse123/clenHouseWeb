import React from 'react';
import { Logo } from '@/core/components/ui';
import { FooterLink } from './components/FooterLink';
import { FooterText } from './components/FooterText';
import { footerLinks, footerLegalLinks, footerContact } from './components/FooterData';

export const FooterSection: React.FC = () => {
    const TelegramIcon = () => (
        <svg
            width="18"
            height="17"
            viewBox="0 0 18 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.18929 16.071L9.17996 16.0727L9.11973 16.1024L9.10277 16.1058L9.09089 16.1024L9.03066 16.0727C9.02162 16.0698 9.01483 16.0713 9.01031 16.0769L9.00691 16.0854L8.99249 16.4485L8.99673 16.4654L9.00522 16.4765L9.09344 16.5392L9.10616 16.5426L9.11634 16.5392L9.20456 16.4765L9.21474 16.4629L9.21813 16.4485L9.20371 16.0862C9.20145 16.0772 9.19664 16.0721 9.18929 16.071ZM9.41409 15.9751L9.40306 15.9768L9.24613 16.0557L9.23764 16.0642L9.2351 16.0735L9.25037 16.4383L9.25461 16.4485L9.2614 16.4544L9.4319 16.5333C9.44265 16.5361 9.45085 16.5339 9.4565 16.5265L9.45989 16.5146L9.43105 15.9938C9.42822 15.9836 9.42257 15.9774 9.41409 15.9751ZM8.80757 15.9768C8.80383 15.9746 8.79936 15.9738 8.79509 15.9748C8.79083 15.9757 8.78709 15.9783 8.78466 15.9819L8.77957 15.9938L8.75073 16.5146C8.7513 16.5248 8.75611 16.5316 8.76515 16.535L8.77788 16.5333L8.94838 16.4544L8.95686 16.4476L8.96026 16.4383L8.97468 16.0735L8.97213 16.0633L8.96365 16.0549L8.80757 15.9768Z"
                fill="#FF5E00"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.2834 0.0996432C15.493 0.0114145 15.7224 -0.019015 15.9478 0.0115216C16.1732 0.0420582 16.3862 0.132445 16.5648 0.273273C16.7434 0.414102 16.881 0.600224 16.9633 0.812268C17.0455 1.02431 17.0694 1.25452 17.0325 1.47895L15.1086 13.1487C14.922 14.2744 13.6869 14.9199 12.6545 14.3592C11.791 13.8901 10.5084 13.1674 9.35473 12.4133C8.7779 12.0358 7.01093 10.827 7.22809 9.96683C7.41471 9.23137 10.3837 6.46768 12.0802 4.82456C12.7461 4.17902 12.4425 3.80662 11.6561 4.40042C9.70337 5.87473 6.56813 8.11673 5.53153 8.74785C4.61709 9.30432 4.14036 9.39933 3.57031 9.30432C2.53032 9.13127 1.56583 8.86322 0.778625 8.53663C-0.285117 8.09552 -0.233372 6.63309 0.777777 6.20725L15.2834 0.0996432Z"
                fill="#FF5E00"
            />
        </svg>
    );

    return (
        <footer className="pt-[40px] sm:pt-[60px] md:pt-[80px] lg:pt-[100px] pb-6 sm:pb-8 md:pb-10">
            <div className="px-4 sm:px-8 lg:px-8">
                {/* Верхняя часть */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 sm:gap-8">
                    {/* Левая группа: логотип + контакты на lg+ */}
                    <div className="hidden lg:flex lg:items-start gap-6 lg:flex-shrink-0">
                        <div className="h-[48px] flex items-center">
                            <Logo size="xl" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <FooterText>{footerContact.title}</FooterText>
                            <a
                                href="tel:+78007756365"
                                className="cursor-pointer hover:opacity-70 transition-opacity underline decoration-1 underline-offset-2 hover:decoration-2"
                            >
                                <FooterText size="xl" weight="medium" opacity="90">{footerContact.phone}</FooterText>
                            </a>
                            <FooterText size="lg" opacity="80">
                                <a
                                    href={footerContact.telegramLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 underline underline-offset-2"
                                >
                                    <TelegramIcon />
                                    {footerContact.telegram}
                                </a>
                            </FooterText>
                        </div>
                    </div>

                    {/* Центральная группа: логотип на <lg */}
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6 lg:gap-[50px] lg:flex-shrink-0">
                        {/* Логотип только на мобильных и планшетах */}
                        <div className="lg:hidden h-[48px] flex items-center justify-center sm:justify-start flex-shrink-0">
                            <Logo size="xl" />
                        </div>
                    </div>

                    {/* Правая группа: ссылки + контакты на <lg */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 md:gap-[40px] pt-0 sm:pt-3">
                        {/* Контакты на мобильных и планшетах */}
                        <div className="lg:hidden flex flex-col gap-2 w-full sm:w-auto text-center sm:text-left">
                            <FooterText>{footerContact.title}</FooterText>
                            <a
                                href="tel:+78007756365"
                                className="cursor-pointer hover:opacity-70 transition-opacity underline decoration-1 underline-offset-2 hover:decoration-2"
                            >
                                <FooterText size="xl" weight="medium" opacity="90">{footerContact.phone}</FooterText>
                            </a>
                            <FooterText size="lg" opacity="80">
                                <a
                                    href={footerContact.telegramLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 underline underline-offset-2"
                                >
                                    <TelegramIcon />
                                    {footerContact.telegram}
                                </a>
                            </FooterText>
                        </div>


                    </div>
                </div>

                {/* Нижняя полоса */}
                <div className="pt-6 sm:pt-8 md:pt-10 lg:pt-[50px] flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[40px]">
                    <FooterText opacity="40" className="order-2 sm:order-1">Все права защищены © 2025</FooterText>
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

                        {footerLinks.main.map((link) => (
                            <FooterLink key={link.text} href={link.href}>
                                {link.text}
                            </FooterLink>
                        ))}


                        {footerLinks.support.map((link) => (
                            <FooterLink key={link.text} href={link.href}>
                                {link.text}
                            </FooterLink>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};
