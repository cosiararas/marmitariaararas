-- ============================================================================
-- SQL para atualizar URLs das fotos de Frango no Supabase
-- ============================================================================
--
-- Este script atualiza os campos image_url na tabela menu_items
-- para corrigir as fotos de Frango Empanado e Frango à Parmegiana
--
-- Execute este SQL no Supabase SQL Editor:
-- https://energetictriggerfish-supabase.cloudfy.live (SQL Editor)
-- ============================================================================

-- 1. Atualizar TODAS as variações de "Frango Empanado" (Mini, Média, Grande, P)
UPDATE menu_items
SET image_url = '/cardapio-fotos/frango-empanado.png'
WHERE business_unit = 'marmitaria'
  AND is_active = true
  AND (
    name ILIKE '%Frango Empanado%'
    OR name ILIKE '%Frango empanado%'
  );

-- 2. Atualizar TODAS as variações de "Frango à Parmegiana" (Mini, Média, Grande, P)
UPDATE menu_items
SET image_url = '/cardapio-fotos/frango-parmegiana.png'
WHERE business_unit = 'marmitaria'
  AND is_active = true
  AND (
    name ILIKE '%Frango%Parmegiana%'
    OR name ILIKE '%Frango a Parmegiana%'
  );

-- 3. (OPCIONAL) Verificar as atualizações
SELECT
  id,
  name,
  image_url,
  category_id
FROM menu_items
WHERE business_unit = 'marmitaria'
  AND is_active = true
  AND (
    name ILIKE '%Frango Empanado%'
    OR name ILIKE '%Frango%Parmegiana%'
  )
ORDER BY name;

-- ============================================================================
-- Resultado esperado:
-- - Todos os itens "Frango Empanado" → /cardapio-fotos/frango-empanado.png
-- - Todos os itens "Frango à Parmegiana" → /cardapio-fotos/frango-parmegiana.png
-- ============================================================================
