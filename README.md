# MySK

Website dedicated to facilitating Suankularb Wittayalai school in collection and access of data.

## Development

### Commands

Run these at the project root.

| Command          | Description                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| `npm run dev`    | Start the development server. Access the web version of MySK locally [here](http://127.0.0.1:3000/). |
| `npm run format` | Format the entire project with Prettier. Required before pushing.                                    |
| `npm run build`  | Build the project for production. Prerequisite to `npm start` and installing MySK as a PWA.          |
| `npm start`      | Start the production server. Access the web version of MySK locally [here](http://127.0.0.1:3000/).  |

With the production build running, you can also install MySK as a Progressive Web App.

### Directories

| Directory         | Description                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| `@/components`    | Reusable React components.                                                                                 |
| `@/pages`         | Pages corresponding to a path.                                                                             |
| `@/public`        | Public static files.                                                                                       |
| `@/styles`        | Houses only `global.css` for globals and custom TailwindCSS utilities and components.                      |
| `@/utils`         | Utilities.                                                                                                 |
| `@/utils/backend` | Functions that interact with the Supabase backend. All must return `BackendReturn` or `BackendDataReturn`. |
| `@/utils/helpers` | Generic utility fucntions, i.e. manipulating arrays.                                                       |
| `@/utils/hooks`   | React Hooks.                                                                                               |
| `@/utils/types`   | TypeScript types. Any changes in `supabase.ts` must exactly reflect changes on Supabase.                   |
