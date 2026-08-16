# Сайт Марианны Бельковой — многостраничный, стиль «Neon Estate»

## Структура
- index.html — главная
- about.html — обо мне (биография, регалии, Schema.org Person на главной)
- speaking.html — для организаторов (FAQ-схема для SEO/GEO)
- education.html — корпоративное обучение, курсы, наставничество
- blog/index.html — блог
- blog/nejroseti-dlya-rieltora.html — пример статьи (Article-схема) — используйте как шаблон новых статей
- contacts.html — форма заявки
- assets/style.css, assets/main.js — общие стили и скрипты
- sitemap.xml, robots.txt

## Что заменить перед публикацией
1. Домен: везде заменить https://marianna-belkova.ru/ на реальный (canonical, og:url, sitemap, robots).
2. Фото: блоки .scene3d и .photo-hint на главной и в about.html; обложки статей (.post-cover, .article-cover); og-cover.jpg (1200x630) в assets/.
3. Контакты: email hello@belkova.ru (в contacts.html и assets/main.js), телефон, ссылки Instagram*/MAX/YouTube.
4. Отзывы: тексты в блоках с классом .placeholder на главной.
5. Реквизиты ИП и ссылка на политику конфиденциальности в подвале.

## Куда подключать 3D
- Точка монтирования: window.BELKOVA_3D_MOUNTS в assets/main.js
  - hero — контейнер #scene3d (сейчас там плейсхолдер фото)
  - background — canvas #fx-canvas (сейчас лёгкая «нейросеть» из частиц; заменяется на three.js/Spline/Rive-сцену)
- Эффекты автоматически отключаются при prefers-reduced-motion.

## Форма
Сейчас работает через mailto (без бэкенда). Для продакшена подключить: Telegram-бот, Formspree, или бэкенд хостинга (в Claude Code это делается за один шаг).

## Новая статья блога
Скопируйте blog/nejroseti-dlya-rieltora.html, замените: title, description, canonical, og:*, JSON-LD (headline, даты, url), текст. Добавьте карточку в blog/index.html и строку в sitemap.xml.
