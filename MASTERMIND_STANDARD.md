Mastermind Standard (Lovable)

- Lovable = Product Layer uniquement (UI + orchestration fonctionnelle)
- Aucune logique metier, aucune execution
- Pas d’Edge Functions, pas de Supabase Cloud runtime
- Pattern obligatoire: jobs async + polling
- Config uniquement au runtime via public/env.js (jamais commite)
- Environnements strictement isoles: DEV / TEST / PROD
