import { NextResponse } from "next/server"
import { productsErrors } from "@/lib/errors/productsErrors"
import { createClient } from "@/lib/supabase/server"


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const FASTAPI_URL = `${API_URL}/productos`;

async function getAccessToken() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token ?? null;
}

async function getUserEmail() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data?.user?.email ?? null;
}

export async function GET() {
  try {
    const token = await getAccessToken();
    const res = await fetch(FASTAPI_URL, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) {
      console.error("FastAPI GET error:", await res.text())
      return NextResponse.json(productsErrors.notFound.body, {
        status: productsErrors.notFound.status,
      })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("GET /api/products error:", error)
    return NextResponse.json(productsErrors.notFound.body, {
      status: productsErrors.notFound.status,
    })
  }
}

export async function POST(req: Request) {
  try {
    const token = await getAccessToken();
    const email = await getUserEmail();
    const body = await req.json()
    
    // Set required metadata
    body.created_by = email || "desconocido";
    body.modified_by = email || "desconocido";
    body.estado = true; // Set as boolean, not string
    
    console.log("Sending to FastAPI:", JSON.stringify(body, null, 2));
    
    const res = await fetch(FASTAPI_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), 
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const errorText = await res.text()
      console.error("FastAPI POST error:", errorText)
      console.error("Status:", res.status)
      return NextResponse.json(productsErrors.createFailed.body, {
        status: productsErrors.createFailed.status
      })
    }
    const newProduct = await res.json()
    return NextResponse.json(newProduct)
  } catch (error) {
    console.error("POST /api/products error:", error)
    return NextResponse.json(productsErrors.createFailed.body, {
      status: productsErrors.createFailed.status
    })
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    
    const { id } = await context.params;
    const token = await getAccessToken();
    const email = await getUserEmail();
    const body = await req.json();

    body.modified_by = email || "desconocido";

    const res = await fetch(`${FASTAPI_URL}/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // NECESARIO
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("FastAPI PUT error:", await res.text());
      return NextResponse.json(productsErrors.updateFailed.body, {
        status: productsErrors.updateFailed.status,
      });
    }

    const updatedProduct = await res.json();
    return NextResponse.json(updatedProduct);

  } catch (error) {
    console.error("PUT /api/products error:", error);
    return NextResponse.json(productsErrors.updateFailed.body, {
      status: productsErrors.updateFailed.status,
    });
  }
}



