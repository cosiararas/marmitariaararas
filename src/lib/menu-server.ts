import { createClient } from '@supabase/supabase-js';
import { MENU_DATA, MenuItem, MenuGroup } from '@/data/menu';

/**
 * Busca o cardapio server-side (para SSR/SEO).
 * Usa anon key (respeita RLS) — seguro para build e runtime.
 * Fallback para MENU_DATA estatico se Supabase falhar.
 */
export async function getMenuServer(): Promise<MenuItem[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("menu-server: env vars ausentes, usando MENU_DATA");
    return MENU_DATA;
  }

  try {
    const supabase = createClient(url, key);

    const { data: dishes, error } = await supabase
      .from('menu_items')
      .select(`
        id,
        name,
        description,
        base_price,
        image_url,
        category:category_id (name),
        groups:menu_groups (
          id,
          title,
          min_options,
          max_options,
          additions:menu_additions (
            id,
            name,
            price,
            is_active
          )
        )
      `)
      .eq('business_unit', 'marmitaria')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    if (!dishes || dishes.length === 0) return MENU_DATA;

    return dishes.map((item: any) => {
      const groups: MenuGroup[] = (item.groups || []).map((g: any) => ({
        id: g.id,
        title: g.title || "Opcoes",
        min: g.min_options || 0,
        max: g.max_options || 10,
        options: (g.additions || [])
          .filter((a: any) => a.is_active)
          .map((a: any) => ({
            id: a.id,
            name: a.name,
            price: Number(a.price),
          })),
      }));

      return {
        id: item.id,
        name: item.name,
        description: item.description || "",
        basePrice: Number(item.base_price || 0),
        price: Number(item.base_price || 0),
        image: item.image_url || "",
        category: item.category?.name || "Geral",
        groups,
      };
    });
  } catch (error) {
    console.error("menu-server: fallback para MENU_DATA estatico", error);
    return MENU_DATA;
  }
}
