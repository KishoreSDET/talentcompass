import { NextResponse } from 'next/server';
import { db, leads } from '@/lib/db';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const allLeads = db.select().from(leads).orderBy(desc(leads.id)).all();
    return NextResponse.json(allLeads);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type, company, role, priority, notes,
      source, url, applyBefore,
      employmentType, rateAmount, contractDuration,
      workArrangement, location,
      contactName, contactVia, contactDetail,
      theyAskedFor, respondBy,
      currentRoleType, currentRate, expectedRate,
      availability, noticePeriod, workRights,
      vevoCopy, resumeSent, responseNotes,
    } = body;

    if (!company || !role) {
      return NextResponse.json(
        { error: 'Company and role are required' },
        { status: 400 }
      );
    }

    db.insert(leads).values({
      type: type || 'outbound',
      company,
      role,
      priority: priority || 'warm',
      notes: notes || null,
      source: source || null,
      url: url || null,
      applyBefore: applyBefore || null,
      employmentType: employmentType || null,
      rateAmount: rateAmount || null,
      contractDuration: contractDuration || null,
      workArrangement: workArrangement || null,
      location: location || null,
      contactName: contactName || null,
      contactVia: contactVia || null,
      contactDetail: contactDetail || null,
      theyAskedFor: Array.isArray(theyAskedFor) ? theyAskedFor.join(',') : null,
      respondBy: respondBy || null,
      currentRoleType: currentRoleType || null,
      currentRate: currentRate || null,
      expectedRate: expectedRate || null,
      availability: availability || null,
      noticePeriod: noticePeriod || null,
      workRights: workRights || null,
      vevoCopy: vevoCopy || 'no',
      resumeSent: resumeSent || 'not_yet',
      responseNotes: responseNotes || null,
      status: 'new',
      createdAt: new Date().toISOString(),
    }).run();

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}