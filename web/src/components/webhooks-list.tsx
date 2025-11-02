import { useSuspenseQuery } from '@tanstack/react-query'

import { WebhookListItem } from './webhooks-list-item'

import { webhookListSchema } from '../http/schemas/webhooks'

export function WebhookList() {
	const { data } = useSuspenseQuery({
		queryKey: ['webhooks'],
		queryFn: async () => {
			const response = await fetch('http://localhost:3333/api/webhooks')

			const data = await response.json()

			return webhookListSchema.parse(data)
		}
	})

	return (
		<div className="flex-1 overflow-y-auto">
			<div className="space-y-1 p-2">
				{data.webhooks.map(item => (
					<WebhookListItem key={item.id} webhook={item} />
				))}
			</div>
		</div>
	)
}
