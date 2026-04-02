import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const search = request.nextUrl.searchParams.get("search") ?? "";
  const supabase = await createClient();

  let query = supabase
    .from("providers")
    .select(
      "id, company_name, slug, category, city, subscription_tier, is_verified"
    )
    .order("subscription_tier", { ascending: false })
    .order("company_name")
    .limit(200);

  if (search) {
    query = query.ilike("company_name", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Admin providers GET:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  return NextResponse.json({ providers: data });
}
