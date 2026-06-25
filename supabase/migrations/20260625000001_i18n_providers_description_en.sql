-- Phase 2 i18n : descriptions prestataires traduites en anglais (en-GB).
-- Traduction fidèle FR->EN des 29 descriptions existantes (aucune donnée factuelle inventée).
-- Le picking FR/EN se fait côté app selon la locale (fallback FR si _en NULL).

ALTER TABLE providers ADD COLUMN IF NOT EXISTS description_en text;

UPDATE providers SET description_en = 'Dedicated service from the Accor Group for event accommodation in Lyon. Close to Eurexpo and the Centre de Congrès.' WHERE slug = 'accor-events-lyon';
UPDATE providers SET description_en = 'Design stand creation for wine, food and lifestyle trade shows in Nouvelle-Aquitaine.' WHERE slug = 'atelier-stand-bordeaux';
UPDATE providers SET description_en = 'Hotel network with dedicated offers for trade show exhibitors and visitors. Negotiated rates at venues close to exhibition centres.' WHERE slug = 'bhotel-paris';
UPDATE providers SET description_en = 'International event logistics. Transport, storage and handling of exhibition materials.' WHERE slug = 'db-schenker-paris';
UPDATE providers SET description_en = 'Technical event services provider. Sound, lighting and video control for trade shows, conventions and product launches.' WHERE slug = 'dushow-paris';
UPDATE providers SET description_en = 'Large-scale event catering. Official partner of numerous exhibition centres across France.' WHERE slug = 'elior-events-paris';
UPDATE providers SET description_en = 'Stand builder in northern France specialising in industrial and construction trade shows. Over 20 years of experience.' WHERE slug = 'euro-stands-lille';
UPDATE providers SET description_en = 'Photography agency specialising in B2B events. Trade show reports, exhibitor portraits and stand photography.' WHERE slug = 'evenementiel-photo-paris';
UPDATE providers SET description_en = 'Freight forwarder specialising in trade shows and fairs. Customs management, transport and installation.' WHERE slug = 'expo-logistics-paris';
UPDATE providers SET description_en = 'Design and construction of bespoke stands for trade shows since 1990. Full support from design through to installation.' WHERE slug = 'expocom-paris';
UPDATE providers SET description_en = 'Design and assembly of custom stands across the Grand Ouest region. Specialist in food and agriculture and industry.' WHERE slug = 'expovista-nantes';
UPDATE providers SET description_en = 'Event photographer and videographer in the Hauts-de-France region. Full coverage of trade shows.' WHERE slug = 'flash-expo-lille';
UPDATE providers SET description_en = 'French leader in event management and exhibition venue operations. Present at over 50 sites across France.' WHERE slug = 'gl-events-venues-lyon';
UPDATE providers SET description_en = 'Catering service dedicated to trade shows. Packages tailored to exhibition spaces.' WHERE slug = 'gourmet-salon-paris';
UPDATE providers SET description_en = 'Professional event photographer. Coverage of trade shows, congresses and corporate events for 15 years.' WHERE slug = 'joel-vieillard-paris';
UPDATE providers SET description_en = 'French gastronomy house. Event catering service for cocktail receptions, lunches and gala dinners at trade shows.' WHERE slug = 'lenotre-paris';
UPDATE providers SET description_en = 'Audiovisual technical services for professional events in Lyon and the south-east quarter of France.' WHERE slug = 'magnum-lyon';
UPDATE providers SET description_en = 'Event communications agency and stand builder. Creation of immersive and experiential stands.' WHERE slug = 'mci-france-paris';
UPDATE providers SET description_en = 'Merci Gustave is a stand design agency based in Paris and Montreal, specialising in the design of bespoke, modular and portable exhibition stands. With over 25 years of experience in exhibition stand design, a presence in Europe and North America, and an enduring passion for creativity and client service, we turn every trade show into an opportunity for visibility and performance. Whether you are exhibiting in Paris, Montreal, Las Vegas or Lyon, we design and deliver high-impact stands tailored to your business objectives and target markets.' WHERE slug = 'merci-gustave';
UPDATE providers SET description_en = 'Leading event audiovisual provider in France. Sound, lighting, video and set design for trade shows and congresses.' WHERE slug = 'novelty-paris';
UPDATE providers SET description_en = 'International group specialising in stand design and brand environments. Present in 40 countries.' WHERE slug = 'pico-international-paris';
UPDATE providers SET description_en = 'Prestige caterer since 1820. The benchmark in event gastronomy for high-end trade shows.' WHERE slug = 'potel-et-chabot-paris';
UPDATE providers SET description_en = 'Hotel booking platform specialising in trade shows. Room blocks and group rates.' WHERE slug = 'salon-hotels-paris';
UPDATE providers SET description_en = 'Hire and installation of audiovisual equipment for trade shows across the Grand Sud-Ouest region.' WHERE slug = 'sono-plus-toulouse';
UPDATE providers SET description_en = 'Lyon-based stand builder specialising in eco-friendly stands. Recycled materials and sustainable design.' WHERE slug = 'stands-plus-lyon';
UPDATE providers SET description_en = 'Event photo and video studio based in Lyon. Specialist in trade shows across the Auvergne-Rhône-Alpes region.' WHERE slug = 'studio-lumieres-lyon';
UPDATE providers SET description_en = 'Lyon caterer specialising in B2B event catering. Buffets, cocktail receptions and packed lunches for trade shows.' WHERE slug = 'traiteur-lefevre-lyon';
UPDATE providers SET description_en = 'Transport and logistics dedicated to trade shows. Delivery to exhibition centres, storage and return.' WHERE slug = 'transpost-lyon';
UPDATE providers SET description_en = 'Integrated audiovisual solutions for events. Large screens, sound systems and live streaming.' WHERE slug = 'videlio-paris';
