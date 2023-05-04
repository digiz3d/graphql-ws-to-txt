import { DocumentNode, useSubscription } from "@apollo/client"
import { desktopDir, sep } from "@tauri-apps/api/path"
import { invoke } from "@tauri-apps/api/tauri"
import { JSONPath } from "jsonpath-plus"
import { PropsWithChildren, useEffect } from "react"

export default function Subscriper({
  jsonPath,
  parsedQuery,
}: PropsWithChildren<{ jsonPath: string; parsedQuery: DocumentNode }>) {
  const { data, loading } = useSubscription(parsedQuery)

  useEffect(() => {
    async function greet() {
      const text = JSONPath({ path: jsonPath, json: data, wrap: false })
      if (!text) return
      try {
        const desktopPath = await desktopDir()
        await invoke("write_to_file", {
          path: `${desktopPath}${sep}test.txt`,
          text,
        })
      } catch (err) {
        console.error("An error occured: ", err)
      }
    }
    greet()
  }, [jsonPath, data])

  return (
    <div>
      <div>Subscriper loading: {loading ? "yes" : "no"}</div>
      {data && <div>{JSON.stringify(data, null, 2)}</div>}
    </div>
  )
}
