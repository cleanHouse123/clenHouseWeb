import { useEffect } from "react";

const YANDEX_METRIKA_ID = "104850024";
declare global {
  interface Window {
    ym: (counterId: number, method: string, ...args: any[]) => void;
  }
}

export const useYandexMetrika = () => {
  useEffect(() => {
    if (!YANDEX_METRIKA_ID) {
      console.log("Яндекс.Метрика: ID счетчика не настроен");
      return;
    }

    // Загружаем скрипт Яндекс.Метрики
    const loadYandexMetrika = () => {
      // Проверяем, не загружен ли уже скрипт
      if (typeof window.ym === "function") {
        return;
      }

      // Загружаем основной скрипт
      (function (m: any, e: any, t: any, r: any, i: any, k: any, a: any) {
        m[i] =
          m[i] ||
          function () {
            (m[i].a = m[i].a || []).push(arguments);
          };
        m[i].l = Number(new Date());
        for (var j = 0; j < document.scripts.length; j++) {
          if (document.scripts[j].src === r) {
            return;
          }
        }
        k = e.createElement(t);
        a = e.getElementsByTagName(t)[0];
        k.async = 1;
        k.src = r;
        a.parentNode.insertBefore(k, a);
      })(
        window,
        document,
        "script",
        "https://mc.yandex.ru/metrika/tag.js",
        "ym",
        null,
        null
      );

      setTimeout(() => {
        if (window.ym) {
          window.ym(parseInt(YANDEX_METRIKA_ID), "init", {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
          });

          console.log("Яндекс.Метрика инициализирована ");
        }
      }, 100);
    };

    // Добавляем noscript fallback
    const addNoscriptFallback = () => {
      const noscript = document.createElement("noscript");
      const div = document.createElement("div");
      const img = document.createElement("img");

      img.src = `https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`;
      img.style.position = "absolute";
      img.style.left = "-9999px";
      img.alt = "";

      div.appendChild(img);
      noscript.appendChild(div);
      document.head.appendChild(noscript);
    };

    loadYandexMetrika();
    addNoscriptFallback();
  }, []);
};
