-- Fonctions de désinscription des alertes (2026-10-03), étape 1 sur 2.
-- La route publique /api/alerts/unsubscribe lisait et modifiait la table
-- alerts avec la clé anon, ce qui exigeait des policies USING (true) :
-- la clé publique lisait alors les e-mails de tous les abonnés. Ces
-- fonctions limitent l'accès aux alertes de l'e-mail fourni. La fermeture
-- des policies suit dans 20261003020000 (après déploiement du code).

CREATE OR REPLACE FUNCTION public.alerts_for_email(p_email text)
RETURNS TABLE (id uuid, alert_type text, salon_slug text, sector_slug text, created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.id, a.alert_type::text, a.salon_slug::text, a.sector_slug::text, a.created_at
  FROM public.alerts a
  WHERE a.email = lower(trim(p_email)) AND a.is_active
  ORDER BY a.created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.alert_unsubscribe(p_id uuid, p_email text)
RETURNS boolean
LANGUAGE sql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH u AS (
    UPDATE public.alerts SET is_active = false
    WHERE id = p_id AND email = lower(trim(p_email))
    RETURNING 1
  )
  SELECT EXISTS (SELECT 1 FROM u);
$$;

REVOKE ALL ON FUNCTION public.alerts_for_email(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.alert_unsubscribe(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.alerts_for_email(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.alert_unsubscribe(uuid, text) TO anon, authenticated;
