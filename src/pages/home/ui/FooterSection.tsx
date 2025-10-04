import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@/core/components/ui';
import { FooterLink } from './components/FooterLink';
import { FooterText } from './components/FooterText';
import { footerLinks, footerLegalLinks, footerContact } from './components/FooterData';

export const FooterSection: React.FC = () => {
  return (
    <footer className="pt-[40px] sm:pt-[60px] md:pt-[80px] lg:pt-[100px] pb-6 sm:pb-8 md:pb-10">
      <div className="px-4 sm:px-8 lg:px-16">
        {/* Верхняя часть */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 sm:gap-8"
        >
          {/* Левая группа: только логотип на lg+ */}
          <motion.div 
            className="hidden lg:block lg:flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="h-[48px] flex items-center">
              <Logo size="xl" />
            </div>
          </motion.div>

          {/* Центральная группа: логотип на <lg, контакты на lg+ */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6 lg:gap-[50px] lg:flex-shrink-0">
            {/* Логотип только на мобильных и планшетах */}
            <motion.div 
              className="lg:hidden h-[48px] flex items-center justify-center sm:justify-start flex-shrink-0"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Logo size="xl" />
            </motion.div>
            
            {/* Контакты только на lg+ */}
            <motion.div 
              className="hidden lg:flex flex-col gap-2 flex-shrink-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <FooterText>{footerContact.title}</FooterText>
              <FooterText size="xl" weight="medium" opacity="90">{footerContact.phone}</FooterText>
              <FooterText size="lg" opacity="80">{footerContact.email}</FooterText>
            </motion.div>
          </div>

          {/* Правая группа: ссылки + контакты на <lg */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 md:gap-[40px] pt-0 sm:pt-3">
            {/* Контакты на мобильных и планшетах */}
            <motion.div 
              className="lg:hidden flex flex-col gap-2 w-full sm:w-auto text-center sm:text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FooterText>{footerContact.title}</FooterText>
              <FooterText size="xl" weight="medium" opacity="90">{footerContact.phone}</FooterText>
              <FooterText size="lg" opacity="80">{footerContact.email}</FooterText>
            </motion.div>
            
            {/* Ссылки */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 md:gap-[40px]"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col gap-[11px] w-full sm:w-[114px] text-center sm:text-left">
                {footerLinks.main.map((link, index) => (
                  <motion.div
                    key={link.text}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <FooterLink href={link.href}>
                      {link.text}
                    </FooterLink>
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col gap-[11px] w-full sm:w-auto text-center sm:text-left">
                {footerLinks.support.map((link, index) => (
                  <motion.div
                    key={link.text}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <FooterLink href={link.href}>
                      {link.text}
                    </FooterLink>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Нижняя полоса */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true, margin: "-50px" }}
          className="pt-6 sm:pt-8 md:pt-10 lg:pt-[50px] flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[40px]"
        >
          <FooterText opacity="40" className="order-2 sm:order-1">2025</FooterText>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-[40px] order-1 sm:order-2">
            {footerLegalLinks.map((link, index) => (
              <motion.div
                key={link.text}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <FooterLink 
                  href={link.href}
                  className="text-[12px] sm:text-[13px] md:text-[14px] hover:text-[rgba(0,0,0,0.6)] text-center"
                >
                  {link.text}
                </FooterLink>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};


