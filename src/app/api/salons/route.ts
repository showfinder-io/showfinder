import { NextRequest, NextResponse } from "next/server";
import {
  getSalons,
  getSalonsBySector,
  SALON_CATEGORY_LABELS,
  type SalonCategory,
} from "@/lib/queries";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const search = params.get("search") ?? "";
  const sector = params.get("sector") ?? "";
  const city = params.get("city") ?? "";
  const period = params.get("period") ?? "";
  const sort = (params.get("sort") as "date" | "name") || "date";
  const page = Number(params.get("page") ?? "1");
  const rawCategory = params.get("category") ?? "";
  const category =
    rawCategory && rawCategory in SALON_CATEGORY_LABELS
      ? (rawCategory as SalonCategory)
      : undefined;

  try {
    const result = sector
      ? await getSalonsBySector(sector, { search, city, period, category, page, sort })
      : await getSalons({ search, city, period, category, page, sort });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ salons: [], total: 0, page: 1, pageSize: 20 }, { status: 500 });
  }
}
