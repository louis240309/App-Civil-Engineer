-- Simulated insurance providers and their demo hospital network.
-- Idempotent: safe to re-run in a local or staging project.

insert into public.insurance_providers (code, name, plan_name, active, coverage)
values
  (
    'insurance-aarogya',
    'Aarogya Shield',
    'Essential Care 5L · demo plan',
    true,
    array['general-hospitalization', 'emergency', 'icu', 'surgery', 'diagnostics']
  ),
  (
    'insurance-novacare',
    'NovaCare Simulated Cover',
    'Family Plus 10L · demo plan',
    true,
    array['general-hospitalization', 'emergency', 'icu', 'diagnostics']
  ),
  (
    'insurance-sahayak',
    'Sahayak Health Demo',
    'Public scheme preview · demo plan',
    false,
    array['general-hospitalization', 'emergency', 'diagnostics']
  ),
  (
    'insurance-bluelotus',
    'BlueLotus Demo Cover',
    'Surgical Advantage · demo plan',
    true,
    array['surgery', 'icu', 'general-hospitalization']
  )
on conflict (code) do update
set
  name = excluded.name,
  plan_name = excluded.plan_name,
  active = excluded.active,
  coverage = excluded.coverage,
  updated_at = now();

insert into public.insurance_hospital_network (provider_id, hospital_id)
select p.id, h.id
from (
  values
    ('insurance-aarogya', 'apollo-jubilee-hills'),
    ('insurance-aarogya', 'care-banjara-hills'),
    ('insurance-aarogya', 'kims-secunderabad'),
    ('insurance-novacare', 'rainbow-banjara-hills'),
    ('insurance-novacare', 'continental-gachibowli'),
    ('insurance-sahayak', 'osmania-afzal-gunj'),
    ('insurance-sahayak', 'kims-secunderabad'),
    ('insurance-bluelotus', 'continental-gachibowli'),
    ('insurance-bluelotus', 'rainbow-banjara-hills')
) as network(provider_code, hospital_code)
join public.insurance_providers p on p.code = network.provider_code
join public.hospitals h on h.code = network.hospital_code
on conflict do nothing;
