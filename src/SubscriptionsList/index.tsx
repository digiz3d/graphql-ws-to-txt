import { useAtomValue } from "jotai"

import { subscriptionsAtom } from "../state"

import SubscriptionCard from "./SubscriptionCard"

export default function SubscriptionsList() {
  const subscriptions = useAtomValue(subscriptionsAtom)
  return (
    <div className="flex flex-grow flex-col gap-5 p-5 ">
      {subscriptions.map((subscription) => (
        <SubscriptionCard
          key={subscription.graphql}
          subscription={subscription}
        />
      ))}
    </div>
  )
}
