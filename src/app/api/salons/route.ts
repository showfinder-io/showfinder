import { NextRequest, NextResponse } from "next/server";
import { getSalons, getSalonsBySector } from "@/lib/queries";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const search = params.get("search") ?? "";
  const sector = params.get("sector") ?? "";
  const city = params.get("city") ?? "";
  const page = Number(params.get("page") ?? "1");

  try {
    const result = sector
      ? await getSalonsBySector(sector, { search, city, page })
      : await getSalons({ search, city, page, sort: "date" });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ salons: [], total: 0, page: 1, pageSize: 20 }, { status: 500 });
  }
}
