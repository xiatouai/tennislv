import Fastify from 'fastify';
import cors from '@fastify/cors';
import {
  mockAnalysisResult,
  MOCK_TEMPLATES,
  type AnalysisResult,
  type TrainingTemplate,
} from '@tennis/shared';

const PORT = parseInt(process.env.PORT || '3000', 10);

async function main() {
  const server = Fastify({ logger: true });

  await server.register(cors);

  // ── Health check ──
  server.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));

  // ── Mock: get analysis result ──
  server.get<{ Querystring: { strokeType?: string } }>(
    '/api/v1/analyses/mock',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: { strokeType: { type: 'string' } },
        },
      },
    },
    async (request): Promise<AnalysisResult> => {
      const strokeType = request.query.strokeType || 'forehand';
      return mockAnalysisResult(strokeType);
    },
  );

  // ── Mock: get training templates ──
  server.get<{ Querystring: { strokeType?: string; problemCode?: string } }>(
    '/api/v1/templates',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            strokeType: { type: 'string' },
            problemCode: { type: 'string' },
          },
        },
      },
    },
    async (request): Promise<{ templates: TrainingTemplate[] }> => {
      const { strokeType, problemCode } = request.query;
      let templates = MOCK_TEMPLATES;

      if (strokeType) {
        templates = templates.filter((t) => t.strokeType === strokeType);
      }
      if (problemCode) {
        templates = templates.filter((t) => t.problemCode === problemCode);
      }

      return { templates };
    },
  );

  try {
    await server.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`[tennis-api] Server running on http://localhost:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
