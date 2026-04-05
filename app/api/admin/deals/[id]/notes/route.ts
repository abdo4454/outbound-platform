import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { DEMO_MODE } from "@/lib/demo-mode";

/** GET /api/admin/deals/[id]/notes */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const actor = await getCurrentMember();
  if (!actor || actor.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (DEMO_MODE) return NextResponse.json({ notes: [] });

  const notes = await db.dealNote.findMany({
    where: { dealId: params.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ notes });
}

/** POST /api/admin/deals/[id]/notes */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const actor = await getCurrentMember();
  if (!actor || actor.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (DEMO_MODE) return NextResponse.json({ ok: true, demo: true });

  const body = await req.json().catch(() => ({})) as { content?: string };
  if (!body.content?.trim()) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  const deal = await db.deal.findUnique({ where: { id: params.id } });
  if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });

  const note = await db.dealNote.create({
    data: {
      dealId: params.id,
      authorId: actor.id,
      content: body.content.trim(),
    },
  });

  return NextResponse.json({ ok: true, note });
}

/** DELETE /api/admin/deals/[id]/notes — delete a note by noteId in body */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const actor = await getCurrentMember();
  if (!actor || actor.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (DEMO_MODE) return NextResponse.json({ ok: true });

  const body = await req.json().catch(() => ({})) as { noteId?: string };
  if (!body.noteId) return NextResponse.json({ error: "noteId is required" }, { status: 400 });

  const note = await db.dealNote.findUnique({ where: { id: body.noteId } });
  if (!note || note.dealId !== params.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.dealNote.delete({ where: { id: body.noteId } });
  return NextResponse.json({ ok: true });
}
