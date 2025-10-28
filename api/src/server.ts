import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import { fastifyCors } from "@fastify/cors";
import ScalarApiReference from "@scalar/fastify-api-reference";

import { env } from "./env";

import { listWebhooks } from "./routes/list-webhooks";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  // credentials: true,
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Webhook Inspector API",
      description: "API for capturing and inspecting webhooks requests",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(ScalarApiReference, {
  routePrefix: "/docs",
});

app.register(listWebhooks);

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log(`🔥 HTTP server running on http://localhost:${env.PORT}`);
  console.log(`📚 HTTP server running on http://localhost:${env.PORT}/docs`);
});
