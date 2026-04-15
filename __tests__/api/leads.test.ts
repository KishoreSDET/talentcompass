import { GET, POST, PUT, DELETE } from '@/app/api/leads/route';
import {
    createLeadPayload,
    createInboundLeadPayload,
    createContractLeadPayload,
    missingCompanyPayload,
    missingRolePayload,
    emptyPayload,
} from '../factories/leadFactory';

// ─── Helper — create mock request ────────────────────────────────────────────
const createMockRequest = (
    method: string,
    body?: unknown,
    searchParams?: Record<string, string>
): Request => {
    const url = new URL(`http://localhost:3000/api/leads${searchParams
        ? '?' + new URLSearchParams(searchParams).toString()
        : ''
        }`);

    return new Request(url.toString(), {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(body !== undefined && { body: JSON.stringify(body) }),
    });
};

// ─── Helper — create lead and return it ──────────────────────────────────────
const createLead = async (overrides = {}) => {
    const payload = createLeadPayload(overrides);
    const req = createMockRequest('POST', payload);
    const res = await POST(req as Request);
    expect(res.status).toBe(201);

    const getRes = await GET();
    const leads = await getRes.json();
    return leads[0];
};

// ─── Test Suite ───────────────────────────────────────────────────────────────
describe('Leads API', () => {

    // ─── GET /api/leads ─────────────────────────────────────────────────────
    describe('GET /api/leads', () => {

        it('returns 200 with empty array when no leads exist', async () => {
            const res = await GET();

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(Array.isArray(body)).toBe(true);
        });

        it('returns all leads after creation', async () => {
            await createLead();
            await createLead();

            const res = await GET();
            const body = await res.json();

            expect(res.status).toBe(200);
            expect(body.length).toBeGreaterThanOrEqual(2);
        });

        it('responds within 2000ms', async () => {
            const start = Date.now();
            await GET();
            const duration = Date.now() - start;

            expect(duration).toBeLessThan(2000);
        });
    });

    // ─── POST /api/leads ─────────────────────────────────────────────────────
    describe('POST /api/leads', () => {

        it('creates outbound lead with valid payload → 201', async () => {
            const payload = createLeadPayload();
            const req = createMockRequest('POST', payload);
            const res = await POST(req);

            expect(res.status).toBe(201);
            const body = await res.json();
            expect(body.success).toBe(true);
        });

        it('creates inbound lead with valid payload → 201', async () => {
            const payload = createInboundLeadPayload();
            const req = createMockRequest('POST', payload);
            const res = await POST(req);

            expect(res.status).toBe(201);
        });

        it('creates contract lead with valid payload → 201', async () => {
            const payload = createContractLeadPayload();
            const req = createMockRequest('POST', payload);
            const res = await POST(req);

            expect(res.status).toBe(201);
        });

        it('returns 400 when company is missing', async () => {
            const payload = missingCompanyPayload();
            const req = createMockRequest('POST', payload);
            const res = await POST(req);

            expect(res.status).toBe(400);
            const body = await res.json();
            expect(body.error).toBeDefined();
        });

        it('returns 400 when role is missing', async () => {
            const payload = missingRolePayload();
            const req = createMockRequest('POST', payload);
            const res = await POST(req);

            expect(res.status).toBe(400);
            const body = await res.json();
            expect(body.error).toBeDefined();
        });

        it('returns 400 when body is empty', async () => {
            const payload = emptyPayload();
            const req = createMockRequest('POST', payload);
            const res = await POST(req);

            expect(res.status).toBe(400);
        });

        it('validates response schema on creation', async () => {
            const payload = createLeadPayload();
            const req = createMockRequest('POST', payload);
            const res = await POST(req);

            expect(res.status).toBe(201);
            const body = await res.json();
            expect(body).toMatchObject({
                success: expect.any(Boolean),
            });
        });

        it('responds within 2000ms', async () => {
            const payload = createLeadPayload();
            const req = createMockRequest('POST', payload);

            const start = Date.now();
            await POST(req);
            const duration = Date.now() - start;

            expect(duration).toBeLessThan(2000);
        });
    });

    // ─── PUT /api/leads ──────────────────────────────────────────────────────
    describe('PUT /api/leads', () => {

        it('updates existing lead → 200', async () => {
            const lead = await createLead();
            const req = createMockRequest('PUT', {
                id: lead.id,
                company: 'Updated Company',
                role: 'Updated Role',
            });
            const res = await PUT(req);

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.success).toBe(true);
        });

        it('returns 400 when id is missing', async () => {
            const req = createMockRequest('PUT', {
                company: 'Updated Company',
            });
            const res = await PUT(req);

            expect(res.status).toBe(400);
            const body = await res.json();
            expect(body.error).toBeDefined();
        });

        it('is idempotent — same update twice returns same result', async () => {
            const lead = await createLead();
            const updatePayload = {
                id: lead.id,
                company: 'Idempotent Company',
                role: 'Idempotent Role',
            };

            const req1 = createMockRequest('PUT', updatePayload);
            const res1 = await PUT(req1);

            const req2 = createMockRequest('PUT', updatePayload);
            const res2 = await PUT(req2);

            expect(res1.status).toBe(200);
            expect(res2.status).toBe(200);
        });
    });

    // ─── DELETE /api/leads ───────────────────────────────────────────────────
    describe('DELETE /api/leads', () => {

        it('deletes existing lead → 200', async () => {
            const lead = await createLead();
            const req = createMockRequest('DELETE', undefined, {
                id: lead.id.toString(),
            });
            const res = await DELETE(req);

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.success).toBe(true);
        });

        it('returns 400 when id is missing', async () => {
            const req = createMockRequest('DELETE');
            const res = await DELETE(req);

            expect(res.status).toBe(400);
            const body = await res.json();
            expect(body.error).toBeDefined();
        });

        it('verifies lead is gone after deletion', async () => {
            const lead = await createLead();

            // delete it
            const deleteReq = createMockRequest('DELETE', undefined, {
                id: lead.id.toString(),
            });
            await DELETE(deleteReq);

            // verify gone
            const getReq = createMockRequest('GET');
            const getRes = await GET(getReq);
            const leads = await getRes.json();
            const deletedLead = leads.find((l: { id: number }) => l.id === lead.id);

            expect(deletedLead).toBeUndefined();
        });
    });

    // ─── Contract Testing / Schema Validation ────────────────────────────────
    describe('Contract Testing — GET /api/leads response schema', () => {

        it('each lead has all required fields', async () => {
            await createLead();

            const res = await GET();
            const leads = await res.json();
            const lead = leads[0];

            // verify required fields exist
            expect(lead.id).toBeDefined();
            expect(lead.company).toBeDefined();
            expect(lead.role).toBeDefined();
            expect(lead.type).toBeDefined();
            expect(lead.priority).toBeDefined();
            expect(lead.status).toBeDefined();
            expect(lead.createdAt).toBeDefined();
        });

        it('id is a number', async () => {
            await createLead();
            const res = await GET();
            const leads = await res.json();

            expect(typeof leads[0].id).toBe('number');
        });

        it('priority is one of hot/warm/maybe', async () => {
            await createLead({ priority: 'hot' });
            await createLead({ priority: 'warm' });
            await createLead({ priority: 'maybe' });

            const res = await GET();
            const leads = await res.json();

            const validPriorities = ['hot', 'warm', 'maybe'];
            leads.forEach((lead: { priority: string }) => {
                expect(validPriorities).toContain(lead.priority);
            });
        });

        it('createdAt is a valid ISO date string', async () => {
            await createLead();
            const res = await GET();
            const leads = await res.json();

            const date = new Date(leads[0].createdAt);
            expect(date.toString()).not.toBe('Invalid Date');
        });

        it('type is one of outbound/inbound', async () => {
            await createLead({ type: 'outbound' });
            await createLead({ type: 'inbound' });

            const res = await GET();
            const leads = await res.json();

            const validTypes = ['outbound', 'inbound'];
            leads.forEach((lead: { type: string }) => {
                expect(validTypes).toContain(lead.type);
            });
        });

        it('returns 200 with leads array when leads exists', async () => {
            await createLead();
            const res = await GET();
            const body = await res.json();
            expect(res.status).toBe(200);
            expect(Array.isArray(body)).toBe(true);
            expect(body.length).toBeGreaterThanOrEqual(1);
        });

        it('returns 400 for leads creation with missing company', async () => {
            const payLoad = missingCompanyPayload();
            const req = createMockRequest('POST', payLoad);
            const res = await POST(req as Request);
            const body = await res.json();
            expect(res.status).toBe(400);
            expect(body.error).toBeDefined();
        });

        it('returns 200 with specific company for the created lead', async () => {
            type leadBlueprint = {
                id: number;
                company: string;
                role: string;
                priority: string;
                type: string;
                status: string;
                createdAt: string;
            };
            const payLoad = createLeadPayload({ company: 'UniqueCompany_123' });
            const req = createMockRequest('POST', payLoad);
            const res = await POST(req as Request);
            const body = await res.json();
            expect(res.status).toBe(201);
            expect(body.success).toBe(true);
            const leadsRes = await GET();
            const leadsBody = await leadsRes.json();
            const found = leadsBody.find((lead: leadBlueprint) => lead.company === 'UniqueCompany_123');
            expect(found).toBeDefined();
            expect(found.company).toEqual('UniqueCompany_123');

        });


    });

});