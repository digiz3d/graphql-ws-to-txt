import { type AppConfiguration } from "./App"
import SubscriptionCard from "./SubscriptionCard"

export default function HomePage({ config }: { config: AppConfiguration }) {
  return (
    <div className="flex flex-grow flex-col gap-5 p-5 ">
      {config.subscriptions.map((subscription) => (
        <SubscriptionCard
          key={subscription.graphql}
          subscription={subscription}
        />
      ))}
    </div>
  )
}
