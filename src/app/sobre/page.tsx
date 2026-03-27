import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre a Marmitaria Araras | Marmitex Caseiro em Araras SP",
  description: "Conheca a Marmitaria Araras. Marmitex caseiro com sabor de casa e preco justo. Nota 4.9 no iFood com Selo Super. Delivery seg-sex 11h as 15h em Araras SP.",
  alternates: {
    canonical: "https://marmitariaararas.com.br/sobre",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "Sobre a Marmitaria Araras",
  "url": "https://marmitariaararas.com.br/sobre",
  "mainEntity": {
    "@type": "Restaurant",
    "name": "Marmitaria Araras",
    "telephone": "+5519971644177",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Dona Renata, 564",
      "addressLocality": "Araras",
      "addressRegion": "SP",
      "addressCountry": "BR",
    },
  },
};

export default function SobrePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#f7f7f3] font-sans">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo Marmitaria Araras" className="h-12 w-12 object-contain rounded-full" />
              <div>
                <h2 className="font-bold text-base text-gray-900 leading-tight">Marmitaria Araras</h2>
                <p className="text-[10px] text-gray-500 italic">Sabor de Casa, Preco Justo</p>
              </div>
            </Link>
            <Link href="/" className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors">
              Ver Cardapio
            </Link>
          </div>
        </header>

        {/* Conteudo */}
        <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Marmitaria Araras</h1>
            <p className="text-gray-500 text-lg">Comida caseira de verdade, feita com carinho em Araras</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 text-gray-700 text-sm leading-relaxed">
            <p>
              Somos a Marmitaria Araras — marmitex caseiro com sabor de casa e preco justo. Nosso cardapio
              e preparado diariamente com ingredientes frescos e tempero caseiro, do jeito que voce gosta.
            </p>
            <p>
              Com nota 4.9 no iFood e mais de 125 avaliacoes em apenas 3 meses, conquistamos o Selo Super
              — dado apenas as melhores lojas da plataforma. Agora voce pode pedir direto, sem taxa de app.
            </p>
            <p>
              Fazemos delivery de segunda a sexta, das 11h as 15h, na regiao de Araras-SP. Peca pelo nosso
              site ou pelo WhatsApp e receba sua marmita fresquinha.
            </p>
          </div>

          {/* Prova social */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-6 text-center">
            <p className="text-2xl font-bold text-amber-700">4.9 / 5.0</p>
            <p className="text-sm text-amber-600 mt-1">125+ avaliacoes no iFood | Selo Super</p>
          </div>

          {/* Contato */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Onde estamos</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-amber-500"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                Av. Dona Renata, 564, Centro, Araras-SP
              </p>
              <p className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-green-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <a href="https://wa.me/5519971644177" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">(19) 97164-4177</a>
              </p>
              <p className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-pink-500"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                <a href="https://instagram.com/marmitariaararas" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">@marmitariaararas</a>
              </p>
              <p className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-amber-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Seg-Sex 11h as 15h
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-3">
            <Link
              href="/"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-xl transition-colors"
            >
              Ver Cardapio
            </Link>
            <p className="text-xs text-gray-400">ou</p>
            <a
              href="https://wa.me/5519971644177?text=Oi!%20Quero%20fazer%20um%20pedido%20🍱"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Pedir pelo WhatsApp
            </a>
          </div>
        </main>

        {/* Footer simples */}
        <footer className="bg-stone-900 text-stone-400 mt-8">
          <div className="max-w-2xl mx-auto px-4 py-6 flex items-center justify-between text-xs">
            <span>Marmitaria Araras | 4.9 no iFood | Selo Super</span>
            <Link href="/privacy" className="hover:text-stone-300 transition-colors">Privacidade</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
