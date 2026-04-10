import { NextResponse } from 'next/server';
import { db, interviewRounds } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');

    if (!applicationId) {
      return NextResponse.json({ error: 'applicationId is required' }, { status: 400 });
    }

    const rounds = db.select().from(interviewRounds)
      .where(eq(interviewRounds.applicationId, parseInt(applicationId)))
      .all();

    return NextResponse.json(rounds);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch rounds' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      applicationId, roundNumber, roundType,
      scheduledDate, duration, submissionDeadline,
      interviewerName, interviewerRole, notes, outcome,
    } = body;

    if (!applicationId || !roundType) {
      return NextResponse.json(
        { error: 'applicationId and roundType are required' },
        { status: 400 }
      );
    }

    db.insert(interviewRounds).values({
      applicationId,
      roundNumber,
      roundType,
      scheduledDate: scheduledDate || null,
      duration: duration || null,
      submissionDeadline: submissionDeadline || null,
      interviewerName: interviewerName || null,
      interviewerRole: interviewerRole || null,
      notes: notes || null,
      outcome: outcome || 'pending',
      createdAt: new Date().toISOString(),
    }).run();

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to save round' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...rest } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    db.update(interviewRounds).set(rest)
      .where(eq(interviewRounds.id, id)).run();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update round' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    db.delete(interviewRounds)
      .where(eq(interviewRounds.id, parseInt(id))).run();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete round' }, { status: 500 });
  }
}