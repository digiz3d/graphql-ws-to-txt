import { ApolloError, DocumentNode, useSubscription } from "@apollo/client"
import { invoke } from "@tauri-apps/api/tauri"
import { JSONPath } from "jsonpath-plus"
import { useEffect } from "react"

import { type Subscription } from "../../state/types"

function SubscriptionIndicator({
  error,
  loading,
}: {
  error?: ApolloError
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
    )
  }
  if (error) {
    return (
      <div
        className="w-3 h-3 rounded-full bg-red-400 animate-pulse"
        title={error.message}
      ></div>
    )
  }
  return <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
}

export default function SubscriptionState({
  outputFile,
  jsonPath,
  parsedQuery,
  params,
}: {
  outputFile: Subscription["outputFile"]
  jsonPath: Subscription["jsonPath"]
  parsedQuery: DocumentNode
  params?: Subscription["params"]
}) {
  const variables = params
    ? Object.keys(params).reduce((acc, key) => {
        const expectedKeyType = params[key].type
        if (expectedKeyType === "string") {
          acc[key] = String(params[key].value)
        } else if (expectedKeyType === "number") {
          acc[key] = Number(params[key].value)
        } else if (expectedKeyType === "boolean") {
          acc[key] = Boolean(params[key].value)
        }
        return acc
      }, {} as any)
    : undefined

  const { data, loading, error } = useSubscription(parsedQuery, {
    variables,
  })

  useEffect(() => {
    async function writeToFile() {
      const text = JSONPath({ path: jsonPath, json: data, wrap: false })
      if (!text) return
      try {
        const currentDir = await invoke<string>("get_current_dir")
        await invoke("write_to_file", {
          path: `${currentDir}/${outputFile}`,
          text,
        })
      } catch (err) {
        console.error("An error occurred: ", err)
      }
    }
    writeToFile()
  }, [jsonPath, data])

  return <SubscriptionIndicator loading={loading} error={error} />
}
