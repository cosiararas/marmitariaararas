export type MenuAddition = {
  id: string;
  name: string;
  price: number;
};

export type MenuGroup = {
  id: string;
  title: string;
  min: number;
  max: number;
  options: MenuAddition[];
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  price?: number;
  originalPrice?: number;
  image: string;
  category: string;
  groups: MenuGroup[];
};

export const MENU_DATA: MenuItem[] = [
  // ── Marmitas ──
  { id: "m-bife-cavalo", name: "Marmitex P - Bife a Cavalo", description: "Bife grelhado no ponto com ovo frito por cima. Acompanha arroz, feijao, macarrao, batata frita e farofa.", basePrice: 27.90, image: "/cardapio-fotos/bife-cavalo.png", category: "Marmitas", groups: getStandardGroups() },
  { id: "m-frango-empanado", name: "Marmitex P - Frango Empanado", description: "File de frango empanado crocante por fora e suculento por dentro. Com arroz, feijao, macarrao, batata frita e farofa.", basePrice: 26.90, image: "/cardapio-fotos/frango-empanado.png", category: "Marmitas", groups: getStandardGroups() },
  { id: "m-bife-acebolado", name: "Marmitex P - Bife Acebolado", description: "Bife bovino grelhado coberto com cebolas douradas e caramelizadas. Com arroz, feijao, macarrao, batata frita e farofa.", basePrice: 26.90, image: "/cardapio-fotos/bife-acebolado.png", category: "Marmitas", groups: getStandardGroups() },
  { id: "m-bisteca-suina", name: "Marmitex P - Bisteca Suina", description: "Bisteca suina temperada e grelhada ate dourar. Com arroz, feijao, macarrao, batata frita e farofa.", basePrice: 24.90, image: "/cardapio-fotos/bisteca.png", category: "Marmitas", groups: getStandardGroups() },
  { id: "m-maminha-assada", name: "Marmitex P - Maminha Assada", description: "Maminha assada lentamente, macia e suculenta. Com arroz, feijao, macarrao, batata frita e farofa.", basePrice: 28.90, image: "/cardapio-fotos/maminha.png", category: "Marmitas", groups: getStandardGroups() },
  { id: "m-cupim-assado", name: "Marmitex P - Cupim Assado", description: "Cupim bovino assado por horas ate desmanchar no garfo. Com arroz, feijao, macarrao, batata frita e farofa.", basePrice: 28.90, image: "/cardapio-fotos/cupim.png", category: "Marmitas", groups: getStandardGroups() },
  { id: "m-coxa-sobrecoxa", name: "Marmitex P - Coxa e Sobrecoxa", description: "Coxa e sobrecoxa de frango assadas com tempero caseiro. Com arroz, feijao, macarrao, batata frita e farofa.", basePrice: 28.90, image: "/cardapio-fotos/coxa-sobrecoxa.png", category: "Marmitas", groups: getStandardGroups() },

  // ── Marmitas Especiais ──
  { id: "me-maminha", name: "Marmitex P - Maminha", description: "Corte nobre de maminha assada no ponto, temperada com ervas. Com arroz, feijao, macarrao, batata frita e farofa.", basePrice: 28.90, image: "/cardapio-fotos/maminha.png", category: "Marmitas Especiais", groups: getStandardGroups() },
  { id: "me-cupim", name: "Marmitex P - Cupim Assado", description: "Cupim especial assado baixa temperatura, macio e saboroso. Com arroz, feijao, macarrao, batata frita e farofa.", basePrice: 28.90, image: "/cardapio-fotos/cupim.png", category: "Marmitas Especiais", groups: getStandardGroups() },
  { id: "me-carne-panela", name: "Marmitex P - Carne de Panela", description: "Carne bovina cozida lentamente no molho caseiro ate desmanchar. Com arroz, feijao, batata frita e farofa.", basePrice: 27.90, image: "/cardapio-fotos/carne-panela.png", category: "Marmitas Especiais", groups: getStandardGroups() },
  { id: "me-costelinha", name: "Marmitex P - Costelinha Suina", description: "Costelinha suina assada com molho barbecue caseiro, caindo do osso. Com arroz, feijao, batata frita e farofa.", basePrice: 27.90, image: "/cardapio-fotos/costelinha-suina.png", category: "Marmitas Especiais", groups: getStandardGroups() },
  { id: "me-macarrao", name: "Marmitex P - Especial de Macarrao", description: "Macarrao ao molho especial da casa, cremoso e bem temperado. Com arroz, feijao e salada fresca.", basePrice: 24.90, image: "/cardapio-fotos/macarrao-especial.png", category: "Marmitas Especiais", groups: getStandardGroups() },
  { id: "me-frango-parm", name: "Marmitex P - Frango a Parmegiana", description: "File de frango empanado gratinado com queijo e molho de tomate caseiro. Com arroz, feijao, batata frita e farofa.", basePrice: 27.90, image: "/cardapio-fotos/frango-parmegiana.png", category: "Marmitas Especiais", groups: getStandardGroups() },

  // ── Bebidas ──
  { id: "beb-coca-lata", name: "Coca-Cola Lata 350ml", description: "Coca-Cola original gelada, lata 350ml", basePrice: 7.00, image: "/cardapio-fotos/coca-lata.png", category: "Bebidas", groups: [] },
  { id: "beb-coca-zero-lata", name: "Coca-Cola Zero Lata 350ml", description: "Coca-Cola Zero acucar gelada, lata 350ml", basePrice: 7.00, image: "/cardapio-fotos/coca-zero-lata.png", category: "Bebidas", groups: [] },
  { id: "beb-coca-600", name: "Coca-Cola 600ml", description: "Coca-Cola original gelada, garrafa 600ml", basePrice: 10.00, image: "/cardapio-fotos/coca-600ml.png", category: "Bebidas", groups: [] },
  { id: "beb-coca-zero-600", name: "Coca-Cola Zero 600ml", description: "Coca-Cola Zero acucar gelada, garrafa 600ml", basePrice: 10.00, image: "/cardapio-fotos/coca-zero-600ml.png", category: "Bebidas", groups: [] },
  { id: "beb-coca-2l", name: "Coca-Cola 2 Litros", description: "Coca-Cola original gelada, garrafa 2 litros para compartilhar", basePrice: 16.00, image: "/cardapio-fotos/coca-2l.png", category: "Bebidas", groups: [] },
  { id: "beb-guarana-lata", name: "Guarana Antarctica Lata 350ml", description: "Guarana Antarctica gelado, lata 350ml", basePrice: 7.00, image: "/cardapio-fotos/guarana-lata.png", category: "Bebidas", groups: [] },
  { id: "beb-guarana-600", name: "Guarana Antarctica 600ml", description: "Guarana Antarctica gelado, garrafa 600ml", basePrice: 10.00, image: "/cardapio-fotos/guarana-600ml.png", category: "Bebidas", groups: [] },
  { id: "beb-guarana-2l", name: "Guarana Antarctica 2 Litros", description: "Guarana Antarctica gelado, garrafa 2 litros para compartilhar", basePrice: 15.00, image: "/cardapio-fotos/guarana-2l.png", category: "Bebidas", groups: [] },
  { id: "beb-h2oh", name: "H2oh Limao 500ml", description: "Agua saborizada com toque de limao, leve e refrescante, 500ml", basePrice: 7.00, image: "/cardapio-fotos/h2oh-limao.png", category: "Bebidas", groups: [] },
  { id: "beb-agua-gas", name: "Agua Mineral Lindoya c/ Gas 500ml", description: "Agua mineral com gas Lindoya, gelada, 500ml", basePrice: 7.00, image: "/cardapio-fotos/agua-gas.png", category: "Bebidas", groups: [] },
  { id: "beb-coca-zero-220", name: "Coca-Cola Zero 220ml", description: "Coca-Cola Zero acucar gelada, mini garrafa 220ml", basePrice: 5.00, image: "/cardapio-fotos/coca-zero-220ml.png", category: "Bebidas", groups: [] },
];

function getStandardGroups(): MenuGroup[] {
  return [
    {
      id: "g1", title: "Deseja Uma Marmita Maior?", min: 0, max: 1, options: [
        { id: "opt-g1-m", name: "Marmita M - aprox. 750G", price: 6.90 },
        { id: "opt-g1-g", name: "Marmita G - aprox. 1KG", price: 10.90 },
      ]
    },
    {
      id: "g2", title: "Turbine a Sua Marmita / Adicionais", min: 0, max: 8, options: [
        { id: "opt-g2-salada", name: "Salada", price: 3.90 },
        { id: "opt-g2-ovo", name: "Ovo", price: 3.90 },
        { id: "opt-g2-batata", name: "Batata Frita 150g", price: 4.90 },
        { id: "opt-g2-frango", name: "File de Frango Grelhado", price: 7.90 },
        { id: "opt-g2-bisteca-s", name: "Bisteca Suina", price: 7.90 },
        { id: "opt-g2-bisteca-b", name: "Bisteca Bovina", price: 8.90 },
        { id: "opt-g2-bife-a", name: "Bife Acebolado", price: 8.90 },
        { id: "opt-g2-bife", name: "Bife", price: 8.90 },
      ]
    },
    {
      id: "g3", title: "Vai Um Docinho? / Sobremesas", min: 0, max: 5, options: [
        { id: "opt-g3-brigadeiro", name: "Brigadeiro Tradicional 30g", price: 6.00 },
        { id: "opt-g3-palha", name: "Palha Italiana Classica 120g", price: 7.00 },
        { id: "opt-g3-bomba", name: "Bomba de Chocolate 110g", price: 9.00 },
        { id: "opt-g3-gelatina", name: "Gelatina Colorida 100g", price: 9.00 },
        { id: "opt-g3-pudim", name: "Pudim de Leite Condensado 120g", price: 11.00 },
      ]
    },
  ];
}
