import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { withProductPromotions } from "@/lib/promotions-server";
import { CreateProductInput } from "@/types/product";

// GET /api/products?search=...&category=...&department=...&brand=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const department = searchParams.get("department");
    const brand = searchParams.get("brand");

    let sql = `
      SELECT 
        id,
        name,
        slug,
        department,
        category,
        brand,
        COALESCE(images, ARRAY[image_url]) as images,
        COALESCE(options, '[]'::jsonb) as options,
        description,
        COALESCE(specifications, '{}'::jsonb) as specifications,
        price,
        original_price,
        installment_price,
        COALESCE(installments, 3) as installments,
        stock,
        is_featured,
        created_at,
        updated_at
      FROM public.products 
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length} OR brand ILIKE $${params.length})`;
    }

    if (category) {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    if (department) {
      params.push(department);
      sql += ` AND department = $${params.length}`;
    }

    if (brand) {
      params.push(brand);
      sql += ` AND brand = $${params.length}`;
    }

    sql += " ORDER BY created_at DESC";

    const products = await query(sql, params);
    const productsWithPromotions = await withProductPromotions(products);

    return NextResponse.json({ products: productsWithPromotions });
  } catch (error: any) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos no banco de dados." },
      { status: 500 }
    );
  }
}

// POST /api/products - Salva novo produto com todas as especificações
export async function POST(request: Request) {
  try {
    const body: CreateProductInput = await request.json();
    const {
      name,
      slug,
      department,
      category,
      brand,
      images = [],
      options = [],
      description = "",
      specifications = {},
      price,
      original_price,
      installment_price,
      installments = 3,
      stock = 100,
      is_featured = false,
    } = body;

    if (!name || price === undefined || price === null) {
      return NextResponse.json(
        { error: "Nome e preço são obrigatórios." },
        { status: 400 }
      );
    }

    // Gerar slug amigável
    const productSlug =
      slug ||
      name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
        "-" +
        Date.now();

    // Primeira imagem para compatibilidade retroativa com image_url legado
    const mainImageUrl = images.length > 0 ? images[0] : "";

    const result = await query(
      `INSERT INTO public.products (
        name,
        slug,
        department,
        category,
        brand,
        images,
        image_url,
        options,
        description,
        specifications,
        price,
        original_price,
        installment_price,
        installments,
        stock,
        is_featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        name,
        productSlug,
        department || "Medicamentos",
        category || "Geral",
        brand || "",
        images,
        mainImageUrl,
        JSON.stringify(options),
        description,
        JSON.stringify(specifications),
        parseFloat(String(price)),
        original_price ? parseFloat(String(original_price)) : null,
        installment_price ? parseFloat(String(installment_price)) : null,
        parseInt(String(installments), 10) || 3,
        parseInt(String(stock), 10) || 100,
        Boolean(is_featured),
      ]
    );

    return NextResponse.json(
      { message: "Produto cadastrado com sucesso!", product: result[0] },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erro ao salvar produto:", error);
    return NextResponse.json(
      { error: "Erro ao salvar produto no banco de dados." },
      { status: 500 }
    );
  }
}
