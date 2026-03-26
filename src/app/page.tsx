import { getMenuServer } from "@/lib/menu-server";
import { MenuItem } from "@/data/menu";
import HomeClient from "./home-client";

export const revalidate = 300; // revalida a cada 5 minutos

export default async function Home() {
  const menu = await getMenuServer();

  return (
    <>
      <HomeClient initialMenu={menu} />

      {/* ── SEO: cardapio visivel no HTML para Google ── */}
      <section
        aria-label="Cardapio completo"
        className="sr-only"
        itemScope
        itemType="https://schema.org/Menu"
      >
        <h2>Cardapio Marmitaria Araras</h2>
        {menu.map((item: MenuItem) => (
          <div key={item.id} itemScope itemType="https://schema.org/MenuItem">
            <h3 itemProp="name">{item.name}</h3>
            {item.description && <p itemProp="description">{item.description}</p>}
            <p>
              <span itemProp="offers" itemScope itemType="https://schema.org/Offer">
                <meta itemProp="priceCurrency" content="BRL" />
                <span itemProp="price" content={String(item.basePrice)}>
                  R$ {item.basePrice.toFixed(2)}
                </span>
              </span>
            </p>
            <p>Categoria: {item.category}</p>
          </div>
        ))}
      </section>
    </>
  );
}
