import { faker } from '@faker-js/faker'
import { db } from '.'
import { webhooks } from './schema'

const stripeEvents = [
	'payment_intent.succeeded',
	'payment_intent.failed',
	'payment_intent.canceled',
	'charge.succeeded',
	'charge.failed',
	'charge.refunded',
	'invoice.created',
	'invoice.paid',
	'invoice.payment_failed',
	'customer.created',
	'customer.updated',
	'customer.deleted',
	'subscription.created',
	'subscription.updated',
	'subscription.deleted'
]

const generateStripeWebhook = () => {
	const event = faker.helpers.arrayElement(stripeEvents)
	const timestamp = faker.date.past()
	const customerId = `cus_${faker.string.alphanumeric(14)}`
	const paymentIntentId = `pi_${faker.string.alphanumeric(24)}`
	const chargeId = `ch_${faker.string.alphanumeric(24)}`
	const invoiceId = `in_${faker.string.alphanumeric(24)}`
	const subscriptionId = `sub_${faker.string.alphanumeric(24)}`

	const body = {
		id: `evt_${faker.string.alphanumeric(24)}`,
		object: 'event',
		api_version: '2023-10-16',
		created: Math.floor(timestamp.getTime() / 1000),
		data: {
			object: {
				id: event.startsWith('payment_intent')
					? paymentIntentId
					: event.startsWith('charge')
						? chargeId
						: event.startsWith('invoice')
							? invoiceId
							: event.startsWith('subscription')
								? subscriptionId
								: customerId,
				object: event.split('.')[0],
				amount: faker.number.int({ min: 1000, max: 100000 }),
				currency: 'brl',
				customer: customerId,
				status: event.endsWith('succeeded')
					? 'succeeded'
					: event.endsWith('failed')
						? 'failed'
						: 'canceled'
			}
		},
		type: event,
		livemode: false
	}

	return {
		method: 'POST',
		pathname: '/webhook',
		ip: faker.internet.ip(),
		statusCode: 200,
		contentType: 'application/json',
		contentLength: JSON.stringify(body).length,
		queryParams: {},
		headers: {
			'stripe-signature': `t=${Math.floor(timestamp.getTime() / 1000)},v1=${faker.string.alphanumeric(64)}`,
			'content-type': 'application/json',
			'user-agent': 'Stripe/1.0 (+https://stripe.com/webhooks)'
		},
		body: JSON.stringify(body, null, 2),
		createdAt: timestamp
	}
}

async function seed() {
	await db.delete(webhooks)

	const webhookRecords = Array.from({ length: 60 }, () =>
		generateStripeWebhook()
	)

	try {
		await db.insert(webhooks).values(webhookRecords)
		console.log('✅ Successfully seeded database with 60 webhook records')
	} catch (error) {
		console.error('❌ Error seeding database:', error)
	}
}

seed()
