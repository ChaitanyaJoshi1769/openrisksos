import axios, { AxiosInstance } from 'axios';

describe('Risk Service Integration Tests', () => {
  let api: AxiosInstance;
  const baseURL = 'http://localhost:3001';
  const tenantId = 'test-tenant-123';
  let createdRiskId: string;

  beforeAll(() => {
    api = axios.create({
      baseURL,
      headers: {
        'X-Tenant-ID': tenantId,
        'Content-Type': 'application/json',
      },
      validateStatus: () => true,
    });
  });

  describe('Risk CRUD Operations', () => {
    test('POST /api/v1/risks - Should create a new risk', async () => {
      const riskData = {
        title: 'Data Breach Risk',
        description: 'Potential unauthorized access to customer data',
        riskCategory: 'cyber',
        probability: 3,
        impact: 5,
      };

      const response = await api.post('/api/v1/risks', riskData);
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.title).toBe(riskData.title);
      expect(response.data.inherentScore).toBe(15); // 3 * 5
      createdRiskId = response.data.id;
    });

    test('GET /api/v1/risks - Should list all risks', async () => {
      const response = await api.get('/api/v1/risks');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });

    test('GET /api/v1/risks/:id - Should get specific risk', async () => {
      const response = await api.get(`/api/v1/risks/${createdRiskId}`);
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(createdRiskId);
    });

    test('PUT /api/v1/risks/:id - Should update risk', async () => {
      const updateData = {
        title: 'Updated Data Breach Risk',
        probability: 4,
        impact: 5,
      };

      const response = await api.put(`/api/v1/risks/${createdRiskId}`, updateData);
      expect(response.status).toBe(200);
      expect(response.data.title).toBe(updateData.title);
      expect(response.data.inherentScore).toBe(20); // 4 * 5
    });

    test('DELETE /api/v1/risks/:id - Should delete risk (soft delete)', async () => {
      const response = await api.delete(`/api/v1/risks/${createdRiskId}`);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('deletedAt');
    });
  });

  describe('Risk Validation', () => {
    test('Should reject risk with invalid probability (< 1)', async () => {
      const invalidRisk = {
        title: 'Invalid Risk',
        probability: 0,
        impact: 3,
      };

      const response = await api.post('/api/v1/risks', invalidRisk);
      expect(response.status).toBe(400);
      expect(response.data.errors).toBeDefined();
    });

    test('Should reject risk with invalid impact (> 5)', async () => {
      const invalidRisk = {
        title: 'Invalid Risk',
        probability: 3,
        impact: 6,
      };

      const response = await api.post('/api/v1/risks', invalidRisk);
      expect(response.status).toBe(400);
    });

    test('Should reject risk without title', async () => {
      const invalidRisk = {
        description: 'No title',
        probability: 3,
        impact: 3,
      };

      const response = await api.post('/api/v1/risks', invalidRisk);
      expect(response.status).toBe(400);
    });
  });

  describe('Risk Filtering & Search', () => {
    test('GET /api/v1/risks?status=active - Should filter by status', async () => {
      const response = await api.get('/api/v1/risks?status=active');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      if (response.data.length > 0) {
        response.data.forEach((risk: any) => {
          expect(risk.status).toBe('active');
        });
      }
    });

    test('GET /api/v1/risks?skip=0&take=10 - Should support pagination', async () => {
      const response = await api.get('/api/v1/risks?skip=0&take=10');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeLessThanOrEqual(10);
    });

    test('GET /api/v1/risks?search=data - Should search risks', async () => {
      const response = await api.get('/api/v1/risks?search=data');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe('Risk Scoring', () => {
    test('Inherent score should be probability × impact', async () => {
      const testCases = [
        { probability: 1, impact: 1, expected: 1 },
        { probability: 3, impact: 5, expected: 15 },
        { probability: 5, impact: 5, expected: 25 },
      ];

      for (const testCase of testCases) {
        const response = await api.post('/api/v1/risks', {
          title: `Test Risk ${testCase.expected}`,
          probability: testCase.probability,
          impact: testCase.impact,
        });
        expect(response.data.inherentScore).toBe(testCase.expected);
      }
    });

    test('Residual score should consider mitigation effectiveness', async () => {
      const response = await api.post('/api/v1/risks', {
        title: 'Mitigated Risk',
        probability: 5,
        impact: 5,
        mitigationEffectiveness: 50, // 50% effective
      });

      expect(response.status).toBe(201);
      expect(response.data.inherentScore).toBe(25);
      // Residual = Probability × (Impact × (1 - Mitigation))
      // = 5 × (5 × (1 - 0.5)) = 5 × 2.5 = 12.5 ≈ 12 or 13
      expect(response.data.residualScore).toBeLessThan(response.data.inherentScore);
    });
  });

  describe('Risk Heatmap', () => {
    test('GET /api/v1/risks/heatmap - Should return risk matrix', async () => {
      const response = await api.get('/api/v1/risks/heatmap');
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('matrix');
      // 5x5 matrix
      expect(response.data.matrix).toHaveLength(5);
      response.data.matrix.forEach((row: any[]) => {
        expect(row).toHaveLength(5);
      });
    });
  });

  describe('Tenant Isolation', () => {
    test('Risk from one tenant should not be visible to another', async () => {
      const otherTenantApi = axios.create({
        baseURL,
        headers: {
          'X-Tenant-ID': 'other-tenant-456',
        },
        validateStatus: () => true,
      });

      const response = await otherTenantApi.get(`/api/v1/risks/${createdRiskId}`);
      expect(response.status).toBe(404);
    });
  });

  describe('Error Handling', () => {
    test('GET /api/v1/risks/{invalid-id} - Should return 404', async () => {
      const response = await api.get('/api/v1/risks/nonexistent-id');
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('statusCode', 404);
    });

    test('Should return consistent error format', async () => {
      const response = await api.post('/api/v1/risks', {});
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('statusCode');
      expect(response.data).toHaveProperty('message');
      expect(response.data).toHaveProperty('timestamp');
      expect(response.data).toHaveProperty('errors');
    });
  });
});
