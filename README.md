# MySK

The flagship project of SK IT Solutions, MySK aims to provide a unified platform for Suankularb Wittayalai students and teachers to access school resources and information.

## Issues and Requests

If you have any issues or requests, use our issue forms [here](https://github.com/suankularb-wittayalai-school/mysk-frontend/issues). Please look through the existing issues before submitting a new one. Both Thai and English are welcome.

## Development

### Commands

Run these while at the project root.

| Command          | Description                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| `npm run dev`    | Start the development server. Access the web version of MySK locally [here](http://localhost:3000/). |
| `npm run format` | Format the entire project with Prettier. Required before pushing.                                    |
| `npm run build`  | Build the project for production. Prerequisite to `npm start` and installing MySK as a PWA.          |
| `npm start`      | Start the production server. Access the web version of MySK locally [here](http://localhost:3000/).  |

With the production build running, you can also install MySK as a Progressive Web App.

> **Note:** you cannot log in with Google using any domain other than `localhost:3000` or `mysk.school`. When running MySK locally, you must use `localhost:3000` to log in with Google.

### Directories

| Directory         | Description                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------- |
| `@/components`    | Reusable React components.                                                               |
| `@/pages`         | Pages corresponding to a path.                                                           |
| `@/public`        | Public static files.                                                                     |
| `@/styles`        | Houses only `global.css` for globals and custom TailwindCSS utilities and components.    |
| `@/utils`         | Utilities.                                                                               |
| `@/utils/backend` | Functions that interact with the Supabase backend. All must return `BackendReturn`.      |
| `@/utils/helpers` | Reusable functions and hooks. Don’t duplicate Radash functionality here.                 |
| `@/utils/types`   | TypeScript types. Any changes in `supabase.ts` must exactly reflect changes on Supabase. |

> **Note:** file names in `@/components`, `@/utils/backend`, and `@/utils/helpers` must match the name of the component or function they export.

## Preview

The preview of the current upcoming version of MySK is available [here](https://preview.mysk.school/).
