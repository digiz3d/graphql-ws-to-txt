import { DocumentNode, useSubscription } from "@apollo/client"
import { invoke } from "@tauri-apps/api/tauri"
import { JSONPath } from "jsonpath-plus"
import { useEffect } from "react"

function SubscriptionIndicator({
  status,
}: {
  status: "loading" | "error" | "success"
}) {
  if (status === "loading") {
    return (
      <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
    )
  }
  if (status === "error") {
    return <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
  }
  return <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
}

export default function SubscriptionState({
  outputFile,
  jsonPath,
  parsedQuery,
}: {
  outputFile: string
  jsonPath: string
  parsedQuery: DocumentNode
}) {
  const { data, loading, error } = useSubscription(parsedQuery)

  useEffect(() => {
    async function greet() {
      const text = JSONPath({ path: jsonPath, json: data, wrap: false })
      if (!text) return
      try {
        const currentDir = await invoke<string>("get_current_dir")
        await invoke("write_to_file", {
          path: `${currentDir}/${outputFile}`,
          text,
        })
      } catch (err) {
        console.error("An error occured: ", err)
      }
    }
    greet()
  }, [jsonPath, data])

  return (
    <SubscriptionIndicator
      status={loading ? "loading" : error ? "error" : "success"}
    />
  )
}
