import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { withProductPromotions } from "@/lib/promotions-server";
import type { CreateProductInput } from "@/types/product";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const products = await query(
      `SELECT 
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
      WHERE id::text = $1 OR slug = $1
      LIMIT 1`,
      [id]
    );

    if (products.length === 0) {
      return NextResponse.json(
        { error: "Produto não encontrado." },
        { status: 404 }
      );
    }

    const [product] = await withProductPromotions(products);

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produto no banco de dados." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: CreateProductInput = await request.json();

    const {
      name,
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

    const mainImageUrl = images.length > 0 ? images[0] : "";

    const result = await query(
      `UPDATE public.products SET
        name = $1,
        department = $2,
        category = $3,
        brand = $4,
        images = $5,
        image_url = $6,
        options = $7,
        description = $8,
        specifications = $9,
        price = $10,
        original_price = $11,
        installment_price = $12,
        installments = $13,
        stock = $14,
        is_featured = $15,
        updated_at = NOW()
      WHERE id::text = $16 OR slug = $16
      RETURNING *`,
      [
        name,
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
        id,
      ]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Produto não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Produto atualizado com sucesso!",
      product: result[0],
    });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar produto no banco de dados." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await query("DELETE FROM public.products WHERE id = $1", [id]);
    return NextResponse.json({ message: "Produto removido com sucesso." });
  } catch (error) {
    console.error("Erro ao remover produto:", error);
    return NextResponse.json(
      { error: "Erro ao remover produto." },
      { status: 500 }
    );
  }
}
