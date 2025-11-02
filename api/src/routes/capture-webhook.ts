import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { webhooks } from '@/db/schema'

import { db } from '@/db'

export const captureWebhook: FastifyPluginAsyncZod = async app => {
	app.all(
		'/api/capture/*',
		{
			schema: {
				summary: 'Capture incoming webhook requests',
				tags: ['External'], // Agrupar/Criar categorias
				hide: true,
				response: {
					201: z.object({ id: z.uuidv7() })
				}
			}
		},
		async (request, reply) => {
			const {
				method,
				ip,
				headers: requestHeaders,
				body: requestBody,
				url
			} = request
			const contentType = requestHeaders['content-type']
			const contentLength = requestHeaders['content-length']
				? Number(requestHeaders['content-length'])
				: null
			const pathname = new URL(url).pathname.replace('/capture', '')
			const headers = Object.fromEntries(
				Object.entries(requestHeaders).map(([key, value]) => [
					key,
					Array.isArray(value) ? value.join(', ') : value || ''
				])
			)

			let body: string | null = null

			if (requestBody) {
				body =
					typeof requestBody === 'string'
						? requestBody
						: JSON.stringify(requestBody, null, 2)
			}

			const result = await db
				.insert(webhooks)
				.values({
					pathname,
					method,
					ip,
					contentType,
					contentLength,
					body,
					headers
				})
				.returning()

			return reply.send({ id: result[0].id })
		}
	)
}
