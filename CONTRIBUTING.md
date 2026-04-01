# Contribuer a Showfinder

## Demarrage rapide

1. Cloner le repo
2. Copier `.env.example` vers `.env.local` et remplir les valeurs
3. `npm install`
4. `npm run dev`

## Workflow Git

- `main` est protégé, déploie sur Vercel en production
- Créer des feature branches : `feat/jz-description` ou `feat/nc-description`
- Ouvrir une PR, review croisée, puis merge (squash)
- Commits en Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)

## Conventions de code

- TypeScript strict : pas de `any` sauf cas documenté
- Imports via alias `@/` pour tout le projet
- Composants : PascalCase, un composant par fichier
- Utilitaires : camelCase dans `src/lib/`
- Types DB auto-générés : ne jamais éditer `src/types/database.ts`
- Après changement de schéma : `npm run gen-types`

## Supabase

- Les changements de schéma passent par les migrations Supabase (`supabase/migrations/`)
- Après chaque migration : `npm run gen-types`
