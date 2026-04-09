import { NextResponse } from 'next/server';
import { db, applications } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allApplications = db.select().from(applications)
      .orderBy(desc(applications.id)).all();
    return NextResponse.json(allApplications);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      leadId, company, role, employmentType,
      location, workArrangement, jobUrl, appliedVia,
      dateApplied, resumeVersion, coverLetterSent,
      portfolioSent, salaryDiscussed, salaryDetails,
      hiringManager, recruiterName, internalContact,
      nextAction, nextActionDate, notes,
    } = body;

    if (!company || !role || !dateApplied) {
      return NextResponse.json(
        { error: 'Company, role and date applied are required' },
        { status: 400 }
      );
    }

    db.insert(applications).values({
      leadId: leadId || null,
      company,
      role,
      employmentType: employmentType || null,
      location: location || null,
      workArrangement: workArrangement || null,
      jobUrl: jobUrl || null,
      appliedVia: appliedVia || null,
      dateApplied,
      resumeVersion: resumeVersion || null,
      coverLetterSent: coverLetterSent || 'no',
      portfolioSent: portfolioSent || 'no',
      salaryDiscussed: salaryDiscussed || 'no',
      salaryDetails: salaryDetails || null,
      hiringManager: hiringManager || null,
      recruiterName: recruiterName || null,
      internalContact: internalContact || null,
      status: 'applied',
      lastActivityDate: new Date().toISOString(),
      nextAction: nextAction || null,
      nextActionDate: nextActionDate || null,
      notes: notes || null,
      createdAt: new Date().toISOString(),
    }).run();

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to save application' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...rest } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    db.update(applications).set({
      ...rest,
      lastActivityDate: new Date().toISOString(),
    }).where(eq(applications.id, id)).run();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    db.delete(applications).where(eq(applications.id, parseInt(id))).run();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
  }
}