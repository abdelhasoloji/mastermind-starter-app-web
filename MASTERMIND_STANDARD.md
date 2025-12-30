Mastermind Standard (Lovable)

- Lovable = Product Layer uniquement (UI + orchestration fonctionnelle)
- Pas d’Edge Functions, pas de Supabase Cloud runtime
- Pattern obligatoire: jobs async + polling
- Config runtime only via public/env.js (jamais committé)
- Environnements isolés: DEV/TEST/PROD (Lovable + backend dédiés)
