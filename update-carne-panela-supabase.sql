-- ============================================================================
-- SQL para atualizar URL da foto de Carne de Panela no Supabase
-- ============================================================================
--
-- Execute este SQL no Supabase SQL Editor:
-- https://energetictriggerfish-supabase.cloudfy.live (SQL Editor)
-- ============================================================================

-- 1. Atualizar TODAS as variações de "Carne de Panela" (Mini, Média, Grande, P)
UPDATE menu_items
SET image_url = '/cardapio-fotos/carne-panela.png'
WHERE business_unit = 'marmitaria'
  AND is_active = true
  AND (
    name ILIKE '%Carne de Panela%'
    OR name ILIKE '%Carne%Panela%'
  );

-- 2. (OPCIONAL) Verificar as atualizações
SELECT
  id,
  name,
  image_url,
  category_id
FROM menu_items
WHERE business_unit = 'marmitaria'
  AND is_active = true
  AND (
    name ILIKE '%Carne de Panela%'
    OR name ILIKE '%Carne%Panela%'
  )
ORDER BY name;

-- ============================================================================
-- Resultado esperado:
-- - Todos os itens "Carne de Panela" → /cardapio-fotos/carne-panela.png
-- ============================================================================
