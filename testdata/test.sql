SELECT data->'title', to_tsvector(data->'title') || to_tsvector(data->'description') || to_tsvector(jsonb_array_elements(data->'tags')->>'id') AS document FROM tables WHERE id ='4366cddd-b377-4ad1-a4a0-21234418559f';
SELECT string_agg((jsonb_array_elements(data->'tags')->>'id'), ' ') AS document FROM tables WHERE id ='4366cddd-b377-4ad1-a4a0-21234418559f';

SELECT to_tsvector(sub2.title) || to_tsvector(sub2.description) || to_tsvector(coalesce(string_agg(sub2.tags, ' '), '')) FROM (SELECT data FROM tables WHERE id ='4366cddd-b377-4ad1-a4a0-21234418559f' GROUP BY id) AS sub1 LEFT JOIN LATERAL (SELECT jsonb_array_elements(sub1.data->'tags')->>'id' as tags, data->'title' as title, data->'description' as description) as sub2 ON true;


SELECT to_tsvector(coalesce(string_agg(sub2.tags, ' '), '')) FROM (SELECT data FROM tables WHERE id ='4366cddd-b377-4ad1-a4a0-21234418559f') AS sub1 LEFT JOIN LATERAL (SELECT jsonb_array_elements(sub1.data->'tags')->>'id' as tags) as sub2 ON true;


﻿SELECT to_tsvector(sub1.title) || to_tsvector(coalesce(string_agg(sub2.tags, ' '), '')) FROM (SELECT data, data->'title' as title FROM tables WHERE id ='4366cddd-b377-4ad1-a4a0-21234418559f') AS sub1 LEFT JOIN LATERAL (SELECT jsonb_array_elements(sub1.data->'tags')->>'id' as tags) as sub2 ON true;

SELECT to_tsvector(sub1.title) || to_tsvector(coalesce(string_agg(sub2.tags, ' '), '')) FROM (SELECT data, data->'title' as title FROM tables WHERE id ='4366cddd-b377-4ad1-a4a0-21234418559f' GROUP BY id, title) AS sub1 LEFT JOIN LATERAL (SELECT jsonb_array_elements(sub1.data->'tags')->>'id' as tags) as sub2 ON true;


﻿SELECT to_tsvector(string_agg(sub1.title, ' ')) || to_tsvector(coalesce(string_agg(sub2.tags, ' '), '')) FROM (SELECT data, data->>'title' as title FROM tables WHERE id ='4366cddd-b377-4ad1-a4a0-21234418559f' GROUP BY id, title) AS sub1 LEFT JOIN LATERAL (SELECT jsonb_array_elements(sub1.data->'tags')->>'id' as tags) as sub2 ON true;

﻿SELECT to_tsvector(string_agg(data->>'title', ' ')) || to_tsvector(string_agg(data->>'description', ' ')) ||to_tsvector(coalesce(string_agg(sub2.tags, ' '), '')) FROM (SELECT data FROM tables WHERE id ='59b4a733-36ce-4b5d-be08-d2fa5ad88197' GROUP BY id) AS sub1 LEFT JOIN LATERAL (SELECT jsonb_array_elements(sub1.data->'tags')->>'id' as tags) as sub2 ON true;

﻿SELECT string_agg(data->>'title', ' ') as title, string_agg(data->>'description', ' ') as description, coalesce(string_agg(sub2.tags, ' '), '') as tags FROM (SELECT data FROM tables WHERE id ='59b4a733-36ce-4b5d-be08-d2fa5ad88197' GROUP BY id) AS sub1 JOIN LATERAL (SELECT jsonb_array_elements(sub1.data->'tags')->>'id' as tags) as sub2 ON true;

select data from tableinfos where id = '5213aec5-b1d7-4044-9698-61ff02a3e50b';

select data from (SELECT data, tableinfos_fts_gin(data) as document FROM tableinfos) AS fts WHERE fts.document @@ to_tsquery('Shirt & Copy') ORDER BY ts_rank(fts.document, to_tsquery('Shirt & Copy')) DESC;


SELECT data
FROM (SELECT data,
             setweight(to_tsvector(data->'title'), 'A') ||
             setweight(to_tsvector(data->'tags'), 'B') ||
             setweight(to_tsvector(data->'description'), 'C') ||
             setweight(to_tsvector(data->'fields'), 'D') as document
      FROM tableinfos) AS fts
WHERE fts.document @@ to_tsquery('Shoes & Shirt')
ORDER BY ts_rank(fts.document, to_tsquery('Shoes & Shirt')) DESC;

select * from tags ORDER BY data->'count' DESC;

SELECT ts_rank(fts.document, to_tsquery('finance & Shirt')) as rank, data
FROM (SELECT data,
             setweight(to_tsvector(data->'title'), 'A') ||
             setweight(to_tsvector(data->'tags'), 'B') ||
             setweight(to_tsvector(data->'description'), 'C') ||
             setweight(to_tsvector(data->'fields'), 'D') as document
      FROM tableinfos) AS fts
WHERE fts.document @@ to_tsquery('finance & Shirt')
ORDER BY ts_rank(fts.document, to_tsquery('finance & Shirt')) DESC;

SELECT ts_rank(fts.document, to_tsquery('linguistics & Agent')) as rank, title, data
FROM (SELECT
      		data,
      		data->'title' as title,
             setweight(to_tsvector(data->'title'), 'A') ||
             setweight(to_tsvector(data->'tags'), 'B') ||
             setweight(to_tsvector(data->'description'), 'C') ||
             setweight(to_tsvector(data->'fields'), 'D') as document
      FROM tableinfos) AS fts
WHERE fts.document @@ to_tsquery('linguistics & Agent')
ORDER BY ts_rank(fts.document, to_tsquery('linguistics & Agent')) DESC;
