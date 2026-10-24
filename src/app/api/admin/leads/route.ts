import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin-auth";
import { getLeads, updateLead, deleteLead, LeadStatus } from "@/lib/leads";

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const leads = await getLeads();
  return NextResponse.json({ ok: true, leads });
}

export async function PATCH(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, adminNote } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ message: "Geçersiz talep kimliği" }, { status: 400 });
    }

    const updates: { status?: LeadStatus; adminNote?: string } = {};
    if (status && ["yeni", "arandi", "tamamlandi"].includes(status)) {
      updates.status = status as LeadStatus;
    }
    if (typeof adminNote === "string") {
      updates.adminNote = adminNote;
    }

    const res = await updateLead(id, updates);
    if (!res.success) {
      return NextResponse.json({ message: res.error || "Güncelleme başarısız" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Talep kimliği gerekli" }, { status: 400 });
    }

    const res = await deleteLead(id);
    if (!res.success) {
      return NextResponse.json({ message: res.error || "Silme başarısız" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
}
