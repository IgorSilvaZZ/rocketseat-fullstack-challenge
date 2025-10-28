import { z } from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const listWebhooks: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/webhooks",
    {
      schema: {
        summary: "List all webhooks",
        tags: ["Webhooks"], // Agrupar/Criar categorias
        querystring: z.object({
          limit: z.coerce.number().min(1).max(100).default(20),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              method: z.string(),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const { limit } = request.query;

      return [
        {
          id: "123",
          method: "POST",
        },
      ];
    }
  );
};
