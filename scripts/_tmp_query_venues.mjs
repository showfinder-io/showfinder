import { createClient } from '@supabase/supabase-js'
import { writeFileSync, appendFileSync } from 'node:fs'
const OUT = '/tmp/venues_dump.txt'
writeFileSync(OUT, 'start\n')
try {
  const supabase = createClient(
    'https://pquihkwoxhkmneymazcb.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxdWloa3dveGhrbW5leW1hemNiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTAyOTQ4NiwiZXhwIjoyMDkwNjA1NDg2fQ.g6w1tk2v3V0QvN8B2iRtbHKcqSnV6qnLp6NY8RSCAgY'
  )
  const { data, error } = await supabase
    .from('venues')
    .select('slug,name,city,halls_count,editorial_mdx,editorial_updated_at')
    .in('slug', ['eurexpo-lyon', 'parc-expositions-toulouse', 'grande-halle-villette', 'parc-des-expositions-de-bordeaux'])
  if (error) { appendFileSync(OUT, 'ERR ' + JSON.stringify(error) + '\n'); process.exit(1) }
  appendFileSync(OUT, 'rows=' + data.length + '\n')
  for (const v of data) {
    appendFileSync(OUT, '===' + v.slug + '|' + v.name + '|' + v.city + '|halls=' + v.halls_count + '\n')
    appendFileSync(OUT, (v.editorial_mdx || '').slice(0, 3000) + '\n\n')
  }
} catch (e) {
  appendFileSync(OUT, 'CATCH ' + e.message + '\n')
  process.exit(2)
}
