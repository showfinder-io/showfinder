@AGENTS.md

# Showfinder

> Nom de travail, susceptible de changer. Nom centralisé dans `src/lib/config.ts`.

## Projet

Annuaire intelligent des salons professionnels B2B en France. Co-construit par Julien Zakoian (@julzak) et Nicolas Crestin (@NicoCrest).

## Stack

- **Framework** : Next.js 16 (App Router, TypeScript strict)
- **Base de données** : Supabase (PostgreSQL). PAS de Prisma, utiliser le client Supabase + types générés
- **Styling** : Tailwind CSS v4 + shadcn/ui
- **Analytics** : GA4
- **Déploiement** : Vercel
- **Repo** : GitHub privé

## Conventions

- Le nom de l'app est centralisé dans `src/lib/config.ts` : ne jamais hardcoder "Showfinder"
- Clients Supabase : `src/lib/supabase/client.ts` (browser), `src/lib/supabase/server.ts` (server)
- Types DB : `src/types/database.ts` (auto-généré, ne pas éditer)
- Pages dans `src/app/` (App Router)
- Composants dans `src/components/`, shadcn dans `src/components/ui/`
- Pas d'i18n au POC : tout le contenu en français, locale `fr-FR`
- Fichiers en `kebab-case`, composants en `PascalCase`
- Variables et fonctions en anglais (`camelCase`), commentaires en français
- Toujours inclure les accents français dans le contenu utilisateur
- Mobile-first : tout composant doit être responsive
- Commits : Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
- Branches : `feat/[initiales]-[description]`, `fix/[initiales]-[description]`

## Commandes

```bash
npm run dev              # Serveur de dev
npm run build            # Build production
npm run lint             # ESLint
npm run gen-types        # Régénérer les types Supabase
```

## Règles strictes

1. Ne JAMAIS hardcoder d'URL ou de clés. Toujours `.env`.
2. Chaque page doit exporter ses `metadata` (title, description).
3. Privilégier le SSG (`generateStaticParams`) pour les pages salon et secteur.
4. Pas de données fabriquées dans les seeds : chaque salon doit être un événement réel.
5. Ne jamais supprimer de code sans explication.
6. En cas de doute sur le scope, demander avant d'implémenter.
