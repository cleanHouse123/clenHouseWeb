import { legalDocumentsList } from "@/pages/legal/documents";

export const footerLinks = {
  main: [
    { text: "Контакты", href: "/contacts" },
    // { text: "Услуги", href: "#" },
  ],
  support: [
    { text: "Оплата на сайте", href: "#" },
    //  { text: "Тех-поддержка", href: "#" },
  ],
};

// Оферта, политика и согласия должны быть доступны со всех страниц сайта
export const footerLegalLinks = legalDocumentsList.map((document) => ({
  text: document.shortTitle,
  href: document.path,
}));

export const footerContact = {
  title: "Связаться с нами:",
  phone: "8-800-775-63-65",
  telegram: "@chistodoma1",
  telegramLink: "https://t.me/chistodoma1",
};
