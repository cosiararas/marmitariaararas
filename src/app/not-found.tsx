import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4 font-sans">
      <div className="text-center space-y-4">
        <p className="text-6xl">🍱</p>
        <h1 className="text-2xl font-bold text-stone-800">Pagina nao encontrada</h1>
        <p className="text-stone-500 text-sm">Essa pagina nao existe. Que tal ver nosso cardapio?</p>
        <Link
          href="/"
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          Ver Cardapio
        </Link>
      </div>
    </div>
  );
}
