# Backstage Developer Portal: Project Structure and Functionality

This document provides an overview of the file structure and main functionality of the baseline Backstage developer portal project (`test-app`).

---

## Top-Level Structure

- **app-config.yaml / app-config.local.yaml / app-config.production.yaml**: Main configuration files for Backstage, supporting different environments.
- **backstage.json**: Specifies the Backstage version.
- **catalog-info.yaml**: Describes the Backstage app as a catalog component.
- **package.json / yarn.lock**: Project dependencies and scripts.
- **tsconfig.json**: TypeScript configuration.
- **README.md**: Basic project instructions.
- **dist-types/**: TypeScript declaration files for built packages.
- **examples/**: Example catalog entities, org data, and scaffolder templates.
- **packages/**: Contains the main application and backend code.
- **plugins/**: Placeholder for custom plugins.

---

## Key Folders and Files

### /packages/app (Frontend)
- **package.json**: Declares this as the frontend app and lists dependencies (Backstage plugins, React, etc.).
- **src/**: Main source code for the frontend.
  - **App.tsx**: Entry point for the app, sets up routes and plugin integration.
  - **index.tsx**: Renders the app to the DOM.
  - **apis.ts**: API factories for plugin integrations.
  - **components/**: Custom React components for the portal UI.
    - **Root/**: Sidebar and layout components.
    - **catalog/EntityPage.tsx**: Customizes the entity page layout and content.
    - **search/SearchPage.tsx**: Customizes the search page.
  - **e2e-tests/**: End-to-end Playwright tests for the app.
  - **public/**: Static assets (HTML, icons, manifest).

### /packages/backend (Backend)
- **package.json**: Declares this as the backend app and lists dependencies (Backstage backend plugins, database drivers, etc.).
- **src/index.ts**: Entry point for the backend, adds and configures all backend plugins (catalog, auth, techdocs, scaffolder, search, etc.).
- **Dockerfile**: For building the backend as a Docker image.
- **README.md**: Backend-specific instructions.

### /examples
- **entities.yaml**: Example catalog entities (System, Component, API).
- **org.yaml**: Example organization data (User, Group).
- **template/**: Example scaffolder template for creating new services.
  - **template.yaml**: Template definition.
  - **content/**: Files used by the template (catalog-info.yaml, index.js, package.json).

### /plugins
- Placeholder for custom Backstage plugins. Contains a README with instructions.

---

## Functionality Overview

- **Frontend**: Built with React and Backstage plugins. Provides catalog, docs, search, scaffolder, user settings, notifications, and more. Custom components extend the sidebar, entity pages, and search experience.
- **Backend**: Node.js app using Backstage backend plugins. Handles catalog ingestion, authentication, scaffolder actions, techdocs generation, search, notifications, and more. Configured for local development with SQLite, but can be extended for production.
- **Configuration**: Environment-specific YAML files control app settings, integrations, database, permissions, and more.
- **Templates & Examples**: Example entities and scaffolder templates help demonstrate catalog and onboarding workflows.

---

## Extensibility
- Add new plugins under `/plugins`.
- Add new modules or shared libraries under `/packages`.
- Customize frontend by editing `/packages/app/src/components`.
- Extend backend by adding plugins in `/packages/backend/src/index.ts`.

---

*This document is auto-generated and summarizes the baseline Backstage project structure and functionality as of October 14, 2025.*
