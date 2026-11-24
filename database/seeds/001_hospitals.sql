-- Simulated Hyderabad hospital directory. `code` values match the frontend
-- demo catalog so bookings can resolve the matching Supabase row.

insert into public.hospitals (
  code, name, short_name, type, area, address, distance_km, availability,
  available_beds, total_beds, emergency, facilities, specialties, map_position
)
values
  (
    'apollo-jubilee-hills', 'Apollo Hospitals', 'Apollo', 'Private', 'Jubilee Hills',
    'Road No. 72, Jubilee Hills, Hyderabad', 1.2, 'available', 42, 300, true,
    array['icu', 'ambulance', 'diagnostics', 'pharmacy', 'bloodBank'],
    array['Cardiology', 'Emergency medicine', 'Orthopaedics'],
    '{"x": 22, "y": 56}'::jsonb
  ),
  (
    'care-banjara-hills', 'Care Hospitals', 'Care', 'Private', 'Banjara Hills',
    'Road No. 1, Banjara Hills, Hyderabad', 2.8, 'limited', 8, 120, true,
    array['icu', 'ambulance', 'diagnostics', 'pharmacy'],
    array['Cardiology', 'Critical care', 'General medicine'],
    '{"x": 64, "y": 30}'::jsonb
  ),
  (
    'rainbow-banjara-hills', 'Rainbow Children''s Hospital', 'Rainbow', 'Private', 'Banjara Hills',
    'Road No. 2, Banjara Hills, Hyderabad', 3.4, 'limited', 6, 90, true,
    array['icu', 'ambulance', 'diagnostics', 'pharmacy'],
    array['Paediatrics', 'Neonatology', 'Emergency medicine'],
    '{"x": 47, "y": 46}'::jsonb
  ),
  (
    'osmania-afzal-gunj', 'Osmania General Hospital', 'Osmania', 'Government', 'Afzal Gunj',
    'Afzal Gunj, Hyderabad', 6.4, 'full', 0, 400, true,
    array['icu', 'ambulance', 'diagnostics', 'pharmacy', 'bloodBank'],
    array['General medicine', 'Trauma', 'Emergency medicine'],
    '{"x": 77, "y": 72}'::jsonb
  ),
  (
    'continental-gachibowli', 'Continental Hospitals', 'Continental', 'Private', 'Gachibowli',
    'Nanakramguda Road, Gachibowli, Hyderabad', 8.1, 'available', 18, 250, true,
    array['icu', 'ambulance', 'diagnostics', 'pharmacy'],
    array['Orthopaedics', 'Neurology', 'Cardiology'],
    '{"x": 16, "y": 40}'::jsonb
  ),
  (
    'kims-secunderabad', 'KIMS Hospitals', 'KIMS', 'Private', 'Secunderabad',
    'Minister Road, Secunderabad, Hyderabad', 9.3, 'available', 26, 200, true,
    array['icu', 'ambulance', 'diagnostics', 'pharmacy', 'bloodBank'],
    array['Neurology', 'Cardiology', 'Emergency medicine'],
    '{"x": 86, "y": 52}'::jsonb
  )
on conflict (code) do update
set
  name = excluded.name,
  short_name = excluded.short_name,
  type = excluded.type,
  area = excluded.area,
  address = excluded.address,
  distance_km = excluded.distance_km,
  availability = excluded.availability,
  available_beds = excluded.available_beds,
  total_beds = excluded.total_beds,
  emergency = excluded.emergency,
  facilities = excluded.facilities,
  specialties = excluded.specialties,
  map_position = excluded.map_position,
  updated_at = now();
