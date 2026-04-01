import { NextResponse } from "next/server";
import { getProvidersBySalon } from "@/lib/queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ salonId: string }> }
) {
  const { salonId } = await params;

  try {
    const providers = await getProvidersBySalon(salonId);
    return NextResponse.json(providers);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
