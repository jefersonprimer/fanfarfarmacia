"use client";

import { useEffect, useState } from "react";
import CategoryCarousel, {
  type StoreCategory,
} from "@/components/CategoryCarousel";
import HomeBenefits from "@/components/HomeBenefits";
import ImageCarousel, { type CarouselImage } from "@/components/ImageCarousel";
import ProductCarousel from "@/components/ProductCarousel";
import type { Product } from "@/types/product";
import SubHeader from "@/components/SubHeader";

const HOME_BANNERS: CarouselImage[] = [
  {
    src: "/banners/Esquenta Black Ofertas Banner.png",
    alt: "Esquenta Black Ofertas",
    href: "/ofertas",
  },
  {
    src: "/banners/esquenta-black-fanfar-ofertas-70-off.png",
    alt: "Esquenta Black Fanfar Ofertas até 70% OF",
    href: "/ofertas",
  },
  {
    src: "/banners/Fanfar Green Sunscreen Sale Banner.png",
    alt: "Produtos de proteção solar ate 70% de desconto",
    href: "/ofertas",
  },
  {
    src: "/banners/Fanfar Infantil_ Ofertas em Verde.png",
    alt: "Produtos infantil ate 50% off",
    href: "/ofertas",
  },
  {
    src: "/banners/Mantenha Seu Tratamento com Desconto.png",
    alt: "Mantenha Seu Tratamento com Desconto ate 75% off",
    href: "/ofertas",
  },
  {
    src: "/banners/Green Bath & Wellness Sale.png",
    alt: "Green Bath & Wellness Sale",
    href: "/ofertas",
  },
];

const HOME_CATEGORIES: StoreCategory[] = [
  {
    name: "Infantil",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_3/all/20260720153500_6a35a4c6c6a9734f6559becd_0/mrtk246825h6jc.webp",
    href: "/departamento/infantil-e-gestante",
  },
  {
    name: "Protetor Solar",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_2/all/20260720153500_6a5e6838d200f902c3f45a73_10/mvfn9gd0li32il.webp",
    href: "/departamento/dermocosmeticos",
  },
  {
    name: "JK Beauty",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_1/mobile/20260828155500_6a94bf7eb9e6fb6d31eceae4_1/mtk6yee0cbmgl9.webp",
    href: "/departamento/beleza-e-perfumaria",
  },
  {
    name: "Higiene",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_3/all/20260720153500_6a35a4c6c6a9734f6559becd_2/mrtk2468y1j59l.webp",
    href: "/departamento/higiene-e-cuidados-pessoais",
  },
  {
    name: "Suplementos",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_2/all/20260720153500_6a5e6838d200f902c3f45a73_8/msxmg74ca5z528.webp",
    href: "/departamento/nutricao-e-suplementos",
  },
  {
    name: "Maquiagem",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_3/all/20260720153500_6a35a4c6c6a9734f6559becd_3/mrtk2468g9dhmo.webp",
    href: "/departamento/beleza-e-perfumaria",
  },
  {
    name: "Diabetes",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_1/desktop/20260921152000_6ab1754ab9e6fb6d31eceb9a_0/mucxu52d6obdh0.webp",
    href: "/departamento/medicamentos",
  },
];

const CARE_DEPARTMENTS = [
  "Dermocosméticos",
  "Higiene e Cuidados Pessoais",
  "Beleza e Perfumaria",
];

interface HomeProductSection {
  key: string;
  title: string;
  subtitle: string;
  products: Product[];
  variant?: "default" | "dark";
}

function discountPercentage(product: Product): number {
  const price = Number(product.price);
  const promotionalPrice =
    product.promotional_price == null
      ? null
      : Number(product.promotional_price);

  if (promotionalPrice !== null && promotionalPrice < price && price > 0) {
    return 1 - promotionalPrice / price;
  }

  const originalPrice =
    product.original_price == null ? null : Number(product.original_price);

  if (originalPrice === null || originalPrice <= price) {
    return 0;
  }

  return 1 - price / originalPrice;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (active && response.ok) {
          setProducts(data.products ?? []);
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const featured = products.filter((product) => product.is_featured);
  const remaining = products.filter((product) => !product.is_featured);
  const mostBought = [...featured, ...remaining];

  const discounted = [...products]
    .filter((product) => discountPercentage(product) > 0)
    .sort((a, b) => discountPercentage(b) - discountPercentage(a));
  const blackDeals =
    discounted.length > 0
      ? discounted
      : [...products].sort((a, b) => b.price - a.price);

  const mostViewed = [...products].reverse();
  const montaQueDesconta = [...products].sort((a, b) => a.price - b.price);

  const careProducts = products.filter((product) =>
    CARE_DEPARTMENTS.includes(product.department ?? ""),
  );
  const cares = careProducts.length > 0 ? careProducts : products;

  const productSections: HomeProductSection[] = [
    {
      key: "mais-comprados",
      title: "Mais comprados",
      subtitle: "Os queridinhos de quem compra na Fanfar.",
      products: mostBought,
    },
    {
      key: "black-do-dia",
      title: "Black do Dia",
      subtitle: "Com até 80% de desconto.",
      products: blackDeals,
      variant: "dark",
    },
    {
      key: "mais-vistos",
      title: "Mais Vistos",
      subtitle: "Os produtos que todo mundo está de olho.",
      products: mostViewed,
    },
    {
      key: "monta-que-desconta",
      title: "Monta que desconta",
      subtitle: "Combine produtos na sua compra e ganhe mais descontos.",
      products: montaQueDesconta,
    },
    {
      key: "cuidados",
      title: "Cuidados que você merece",
      subtitle: "Dermocosméticos, higiene e beleza para a sua rotina.",
      products: cares,
    },
  ];

  return (
    <main className="flex-1 bg-gray-50">
      <SubHeader />
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <ImageCarousel images={HOME_BANNERS} />
        </div>
      </section>

      <HomeBenefits />

      <CategoryCarousel
        categories={HOME_CATEGORIES}
        title="Navegue por categoria"
      />

      {loading ? (
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-5 h-7 w-56 animate-pulse rounded bg-gray-200" />
            <div className="flex gap-3 overflow-hidden">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-80 w-[190px] shrink-0 animate-pulse rounded-2xl bg-gray-200 sm:w-[230px] lg:w-[250px]"
                />
              ))}
            </div>
          </div>
        </section>
      ) : products.length > 0 ? (
        productSections.map((section) => (
          <ProductCarousel
            key={section.key}
            products={section.products}
            title={section.title}
            subtitle={section.subtitle}
            variant={section.variant}
          />
        ))
      ) : (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm text-gray-500">
              Nenhum produto disponível no momento.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
