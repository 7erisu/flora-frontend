# Flora — Full-stack project

Frontend завершеного full-stack проєкту Flora.

- Живий сайт: https://7erisu.github.io/flora-frontend/
- Backend API: https://flora-api-cl5c.onrender.com/api
- Swagger UI: https://flora-api-cl5c.onrender.com/api-docs
- Backend repository: https://github.com/7erisu/flora-backend

## Final review

Frontend, backend API, PostgreSQL integration and Swagger documentation are ready for mentor review.

Адаптивна mobile-first верстка лендингу квіткової студії Flora за навчальним макетом.

## Реалізовано

- семантична HTML5-структура;
- нормалізація та власна система стилів;
- адаптивні стани для mobile, tablet і desktop;
- мобільне меню з керуванням клавіатурою;
- flex/grid-компонування, декоративні ефекти й анімації;
- оптимізовані WebP-зображення та відкладене завантаження контентних фото;
- доступні назви елементів, focus-стани та підтримка `prefers-reduced-motion`.
- Retina-графіка для mobile/tablet/desktop і DPR 1x/2x;
- модальне вікно заявки та форма підписки;
- axios + async/await і локальний json-server;
- повністю динамічні картки бестселерів і каталогу;
- пошук, категорії та посторінковий Load more без дублювання.

## Запуск

Встановіть залежності:

```bash
npm install
```

У першому терміналі запустіть mock API:

```bash
npm run api
```

У другому терміналі запустіть клієнт:

```bash
npm run dev
```

Production-збірка та локальний перегляд:

```bash
npm run build
npm run preview
```

На GitHub Pages застосунок використовує доступний через HTTP файл `db.json` і виконує фільтрацію та пагінацію на клієнті. У режимі розробки запити йдуть через Vite proxy до json-server з параметрами `_page`, `_limit`, `category` і `q`.

Для фінального режиму створіть `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Після деплою це значення задається як GitHub Actions variable і має містити публічну адресу backend із `/api`.

## Перевірки

- W3C Nu HTML Checker: 0 помилок;
- W3C CSS Validator: valid, 0 помилок (службові попередження лише про CSS variables та `@import`);
- Lighthouse mobile: Performance 87, Accessibility 100, Best Practices 100, SEO 100;
- FCP 2.6 s, LCP 3.5 s, CLS 0, TBT 0 ms;
- production preview: динамічні списки працюють із `db.json`, помилок у консолі немає.
