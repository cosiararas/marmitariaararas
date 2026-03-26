import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const playfair = Playfair_Display({ variable: "--font-serif", subsets: ["latin"] });
const outfit = Outfit({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marmitaria Araras SP | Marmitex Caseiro Delivery | Seg-Sex 11h-15h",
  description: "Marmitex caseiro em Araras SP. Nota 4.9 no iFood com Selo Super. Delivery seg-sex 11h as 15h. Peca direto sem taxa de app. A partir de R$18.",
  openGraph: {
    title: "Marmitaria Araras SP | Marmitex Caseiro Delivery",
    description: "Marmitex caseiro em Araras SP. Nota 4.9 no iFood com Selo Super. Delivery seg-sex 11h as 15h. Peca direto sem taxa de app.",
    url: "https://marmitariaararas.com.br",
    siteName: "Marmitaria Araras",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "https://marmitariaararas.com.br/logo.png", width: 512, height: 512, alt: "Marmitaria Araras" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marmitaria Araras SP | Marmitex Caseiro Delivery",
    description: "Marmitex caseiro em Araras SP. Nota 4.9 no iFood com Selo Super. Delivery seg-sex 11h as 15h.",
    images: ["https://marmitariaararas.com.br/logo.png"],
  },
  alternates: {
    canonical: "https://marmitariaararas.com.br",
  },
};

const PIXEL_ID = "1252153586858603";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Marmitaria Araras",
  "description": "Marmitex caseiro delivery em Araras SP",
  "url": "https://marmitariaararas.com.br",
  "telephone": "+5519971644177",
  "email": "contato@marmitariaararas.com.br",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. Dona Renata, 564",
    "addressLocality": "Araras",
    "addressRegion": "SP",
    "postalCode": "13600-000",
    "addressCountry": "BR",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -22.3567,
    "longitude": -47.3836,
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "11:00",
    "closes": "15:00",
  },
  "servesCuisine": "Comida Brasileira",
  "priceRange": "$$",
  "image": "https://marmitariaararas.com.br/logo.png",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "125",
    "bestRating": "5",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-92CWDB9YH2" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-92CWDB9YH2');
        `}</Script>
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','${PIXEL_ID}');
          fbq('track','PageView');
        `}</Script>
        <noscript><img height="1" width="1" style={{display:"none"}}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        /></noscript>
      </head>
      <body className={`${outfit.variable} ${playfair.variable} antialiased font-sans`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
