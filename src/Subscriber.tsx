import { useSubscription, gql } from "@apollo/client"
import { invoke } from "@tauri-apps/api/tauri"
import { PropsWithChildren, useEffect } from "react"
import { desktopDir } from "@tauri-apps/api/path"
import { JSONPath } from "jsonpath-plus"

export default function Subscriper({
  jsonPath,
  query,
}: PropsWithChildren<{ jsonPath: string; query: string }>) {
  const { data, loading } = useSubscription(gql(query))

  useEffect(() => {
    async function greet() {
      const text = JSONPath({ path: jsonPath, json: data, wrap: false })
      try {
        const desktopPath = await desktopDir()
        await invoke("write_to_file", {
          path: `${desktopPath}/test.txt`,
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
