import { gql } from "@apollo/client"

import { type Subscription } from "../App"
import CustomApolloProvider from "../CustomApolloProvider"

import SubscriptionState from "./SubscriptionState"

function tryParseGql(query: string) {
  try {
    return gql(query)
  } catch (err) {
    return null
  }
}

export default function SubscriptionCard({
  subscription,
}: {
  subscription: Subscription
}) {
  const parsedQuery = tryParseGql(subscription.graphql)

  return (
    <CustomApolloProvider url={subscription.url}>
      <div className="flex rounded-xl p-5 items-center justify-between bg-gray-50 dark:bg-gray-900">
        <div>{subscription.name}</div>
        {parsedQuery && (
          <SubscriptionState
            outputFile={subscription.outputFile}
            parsedQuery={parsedQuery}
            jsonPath={subscription.jsonPath}
          />
        )}
      </div>
    </CustomApolloProvider>
  )
}
