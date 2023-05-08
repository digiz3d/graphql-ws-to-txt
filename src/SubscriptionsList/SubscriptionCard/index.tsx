import { gql } from "@apollo/client"
import { parse } from "graphql"
import { useAtom } from "jotai"
import { useCallback, useState } from "react"

import CustomApolloProvider from "../../CustomApolloProvider"
import { updateSubscriptionAtom } from "../../state"
import { type Subscription } from "../../state/types"

import SubscriptionState from "./SubscriptionState"

function tryParseGql(query: string) {
  try {
    const ast = parse(query)
    console.log("ast", ast)

    return gql(query)
  } catch (err) {
    return null
  }
}

function debounce(fn: any) {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), 1000)
  }
}

export default function SubscriptionCard({
  subscription,
}: {
  subscription: Subscription
}) {
  const parsedQuery = tryParseGql(subscription.graphql)
  const [params, setParams] = useState(subscription.params)
  const [_, updateSubscription] = useAtom(updateSubscriptionAtom)

  const debouncedPersistParams = useCallback(
    debounce(
      async (subscriptionName: string, newParams: Subscription["params"]) => {
        await updateSubscription({
          name: subscriptionName,
          params: newParams,
        })
      },
    ),
    [],
  )

  const updateParamVisual = useCallback(
    (subscriptionName: string, paramName: string, paramValue: string) => {
      setParams((prev) => {
        const newParams = {
          ...prev,
          [paramName]: {
            type: prev![paramName].type as any,
            value: paramValue,
          },
        }
        debouncedPersistParams(subscriptionName, newParams)
        return newParams
      })
    },
    [debouncedPersistParams],
  )

  return (
    <CustomApolloProvider url={subscription.url}>
      <div className="flex rounded-xl p-5 items-center justify-between bg-gray-50 dark:bg-gray-900">
        <div>{subscription.name}</div>
        <div>
          {params &&
            Object.keys(params).map((name) => (
              <div key={name}>
                <input
                  type="text"
                  placeholder={name}
                  value={params[name].value.toString()}
                  onChange={(e) => {
                    updateParamVisual(subscription.name, name, e.target.value)
                  }}
                />
              </div>
            ))}
        </div>
        {parsedQuery && (
          <SubscriptionState
            outputFile={subscription.outputFile}
            parsedQuery={parsedQuery}
            jsonPath={subscription.jsonPath}
            params={subscription.params}
          />
        )}
      </div>
    </CustomApolloProvider>
  )
}
