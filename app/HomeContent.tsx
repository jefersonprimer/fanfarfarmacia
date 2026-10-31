"use client";

import { useEffect, useState } from "react";
import CategoryCarousel, {
  type StoreCategory,
} from "@/components/CategoryCarousel";
import BrandCarousel, { type StoreBrand } from "@/components/BrandCarousel";
import HomeBenefits from "@/components/HomeBenefits";
import ImageCarousel, { type CarouselImage } from "@/components/ImageCarousel";
import ProductCarousel from "@/components/ProductCarousel";
import type { Product } from "@/types/product";
import SubHeader from "@/components/SubHeader";

const HOME_BANNERS: CarouselImage[] = [
  {
    src: "/banners/Esquenta Black Ofertas Banner.png",
    mobileSrc: "/banners/Esquenta Black Ofertas Banner-mobile.png",
    alt: "Esquenta Black Ofertas",
    href: "/ofertas",
  },
  {
    src: "/banners/esquenta-black-fanfar-ofertas-70-off.png",
    mobileSrc: "/banners/esquenta-black-fanfar-ofertas-70-off-mobile.png",
    alt: "Esquenta Black Fanfar Ofertas até 70% OF",
    href: "/ofertas",
  },
  {
    src: "/banners/Fanfar Green Sunscreen Sale Banner.png",
    mobileSrc: "/banners/Fanfar Green Sunscreen Sale Banner-mobile.png",
    alt: "Produtos de proteção solar ate 70% de desconto",
    href: "/ofertas",
  },
  {
    src: "/banners/Fanfar Infantil_ Ofertas em Verde.png",
    mobileSrc: "/banners/Fanfar Infantil_ Ofertas em Verde.png-mobile.png",
    alt: "Produtos infantil ate 50% off",
    href: "/ofertas",
  },
  {
    src: "/banners/Mantenha Seu Tratamento com Desconto.png",
    alt: "Mantenha Seu Tratamento com Desconto ate 75% off",
    mobileSrc: "/banners/Mantenha Seu Tratamento com Desconto-mobile.png",
    href: "/ofertas",
  },
  {
    src: "/banners/Green Bath & Wellness Sale.png",
    mobileSrc: "/banners/Green Bath & Wellness Sale-mobile.png",
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
    href: "/departamento/cuidado-diario",
  },
  {
    name: "JK Beauty",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_1/mobile/20260828155500_6a94bf7eb9e6fb6d31eceae4_1/mtk6yee0cbmgl9.webp",
    href: "/departamento/marcas-asiaticas",
  },
  {
    name: "Higiene",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_3/all/20260720153500_6a35a4c6c6a9734f6559becd_2/mrtk2468y1j59l.webp",
    href: "/departamento/cuidado-diario",
  },
  {
    name: "Suplementos",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_2/all/20260720153500_6a5e6838d200f902c3f45a73_8/msxmg74ca5z528.webp",
    href: "/departamento/bem-estar",
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

const HOME_BRANDS: StoreBrand[] = [
  {
    name: "Nivea",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/brand/all/20251201080000_67fceff7d9a18f57f8389093_1/mjirbhybxo9bn7.webp",
    href: "/marca/nivea",
  },
  {
    name: "Pampers",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/brand/all/20251223131500_67fceff7d9a18f57f8389093_5/mjisiegtqwmls5.webp",
    href: "/marca/pampers",
  },
  {
    name: "Dove",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/brand/all/20251201080000_67fceff7d9a18f57f8389093_2/mjirbhyb13je7z.webp",
    href: "/marca/dove",
  },
  {
    name: "Principia",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/brand/all/20260529173600_6a19f68092169b007cec4b7b_0/mprdi82ehrzuhp.webp",
    href: "/marca/principia",
  },
  {
    name: "Rexona",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/brand/all/20251201080000_67fceff7d9a18f57f8389093_8/mjirbhybk9q4zq.webp",
    href: "/marca/rexona",
  },
  {
    name: "Huggies",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/brand/all/20251201080000_67fceff7d9a18f57f8389093_7/mjirbhyb464eo0.webp",
    href: "/marca/huggies",
  },
  {
    name: "Eucerin",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/category/promotional_1/all/20260430110000_69f35c970e4a40435f3153fc_10/molp7khnioyr2f.webp",
    href: "/marca/eucerin",
  },
  {
    name: "Condres",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_7/all/20260703150000_6a4805c615d04446474d3802_0/mr5ao733nrg1xz.webp",
    href: "/marca/condres",
  },
  {
    name: "Danone",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_9/all/20261022135000_6ada3780d126397280483eef_0/mvjqz4fb7s3kef.webp",
    href: "/marca/danone",
  },
  {
    name: "Lux",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_9/all/20260826153500_6a4805c615d04446474d3802_0/mtafhwlzf81ag1.webp",
    href: "/marca/lux",
  },
  {
    name: "Elmex",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_9/all/20260826153500_6a4805c615d04446474d3802_0/mtafiqvp4pjsat.webp",
    href: "/marca/elmex",
  },
  {
    name: "Johnson's",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_9/all/20260930105000_6abd0c4f193ad5761019f7dd_0/muo4zggqc4w0qd.webp",
    href: "/marca/johnson-s",
  },
  {
    name: "Libbs",
    image:
      "https://sjdigital.vtexassets.com/assets/vtex.file-manager-graphql/images/88f148ff-2443-4add-aad9-e9e09593c9b8___dac57c0c26da8531ea733026595d6181.webp",
    href: "/marca/libbs",
  },
  {
    name: "EMS",
    image:
      "https://sjdigital.vtexassets.com/assets/vtex.file-manager-graphql/images/468535dd-4064-44f8-9a35-2ec81b8d6a04___2aa05ff9a1fd9ce351147eaa2925f838.webp",
    href: "/marca/ems",
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

export default function HomeContent({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);

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
  const newArrivals = products.filter((product) => product.is_new);

  const productSections: HomeProductSection[] = [
    {
      key: "novidades",
      title: "Acabou de chegar",
      subtitle: "Conheça as novidades que chegaram na Fanfar.",
      products: newArrivals,
    },
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
    <main className="flex-1 bg-white">
      <SubHeader />
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <ImageCarousel images={HOME_BANNERS} />
        </div>
      </section>

      <HomeBenefits />

      <CategoryCarousel categories={HOME_CATEGORIES} />

      {loading ? (
        productSections.map((section) => (
          <section
            key={section.key}
            aria-hidden="true"
            className={`${section.variant === "dark" ? "bg-gray-900" : ""} py-8`}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div
                className={`mb-2 h-7 w-56 animate-pulse rounded ${section.variant === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
              />
              <div
                className={`mb-5 h-4 w-72 max-w-full animate-pulse rounded ${section.variant === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
              />
              <div className="flex gap-3 overflow-hidden">
                {[0, 1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className={`h-80 w-[190px] shrink-0 animate-pulse rounded-2xl sm:w-[230px] lg:w-[250px] ${section.variant === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
                  />
                ))}
              </div>
            </div>
          </section>
        ))
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

      <BrandCarousel brands={HOME_BRANDS} />
    </main>
  );
}
