import Backend from 'i18next-http-backend';
import {initReactI18next} from "react-i18next";
import i18n from 'i18next';

i18n.use(Backend) // Загрузка переводов из JSON-файлов
    .use(initReactI18next)
    .init({
        lng: 'ua',
        fallbackLng: 'en',
        // Оставляем совместимость со старым форматом ключей `general.date`
        // через единый namespace `translation.json`.
        // Новые/структурированные namespaces также можно использовать в формате `ns:key`.
        defaultNS: 'translation',
        ns: ['translation'],
        interpolation: {
            escapeValue: false // Отключаем экранирование для React
        },
        supportedLngs: ['ua', 'en'],
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json'
        },
        // чтобы на лету можно было грузить namespace при первом обращении
        react: {
            useSuspense: false
        }
    });

export default i18n;
