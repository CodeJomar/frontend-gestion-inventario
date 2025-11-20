import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { productsErrors } from "@/lib/errors/productsErrors"


type Params = Promise<{ id: string }>;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const FASTAPI_URL = `${API_URL}/productos/{id}`;
async function getAccessToken() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

async function getUserEmail() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email ?? null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const res = await fetch(FASTAPI_URL.replace("{id}", id))
    if (!res.ok) {
      console.error("FastAPI GET error:", await res.text())
      return NextResponse.json(productsErrors.notFound.body, {
        status: productsErrors.notFound.status
      })
    }
    const productItem = await res.json()
    if (!productItem || !productItem.id) {
      return NextResponse.json(productsErrors.notFound.body, {
        status: productsErrors.notFound.status
      })
    }
    return NextResponse.json(productItem)
  } catch (error) {
    console.error("GET /api/products/[id] error:", error)
    return NextResponse.json(productsErrors.notFound.body, {
      status: productsErrors.notFound.status
    })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body = await req.json()
    const token = await getAccessToken();
    if (!token) {
      console.warn("Warning: No auth token found for PUT request");
    }
    const currentProductRes = await fetch(FASTAPI_URL.replace("{id}", id));
    if (!currentProductRes.ok) {
      return NextResponse.json(productsErrors.notFound.body, { status: 404 });
    }
    const currentProduct = await currentProductRes.json();
    const mergedBody = { ...currentProduct, ...body };
    if (mergedBody.precio) mergedBody.precio = Number(mergedBody.precio);
    if (mergedBody.stock) mergedBody.stock = Number(mergedBody.stock);
    const res = await fetch(FASTAPI_URL.replace("{id}", id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(mergedBody),
    })
    if (!res.ok) {
      const errorText = await res.text();
      console.error("FastAPI PUT error:", errorText)
      if (res.status === 401 || res.status === 403) {
        return NextResponse.json({ error: "Unauthorized or Forbidden" }, { status: res.status });
      }
      if (res.status === 422) {
        return NextResponse.json({ error: "Validation Error", detail: errorText }, { status: 422 });
      }
      return NextResponse.json(productsErrors.updateFailed.body, {
        status: productsErrors.updateFailed.status
      })
    }
    const updatedProduct = await res.json()
    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error)
    return NextResponse.json(productsErrors.updateFailed.body, {
      status: productsErrors.updateFailed.status
    })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const res = await fetch(FASTAPI_URL.replace("{id}", id), {
      method: "DELETE",
    })
    if (!res.ok) {
      console.error("FastAPI DELETE error:", await res.text())
      return NextResponse.json(productsErrors.deleteFailed.body, {
        status: productsErrors.deleteFailed.status
      })
    }
    const deletedProduct = await res.json()
    return NextResponse.json(deletedProduct)
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error)
    return NextResponse.json(productsErrors.deleteFailed.body, {
      status: productsErrors.deleteFailed.status
    })
  }
}