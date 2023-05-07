import { invoke } from "@tauri-apps/api/tauri"
import { useEffect, useState } from "react"

import defaultConfig from "./default-config.json"
import HomePage from "./HomePage"

export type Subscription = {
  name: string
  url: string
  graphql: string
  jsonPath: string
  outputFile: string
}

export type AppConfiguration = {
  subscriptions: Subscription[]
}

const CONFIG_FILE_NAME = "config.json"

export default function App() {
  const [appConfiguration, setAppConfiguration] =
    useState<AppConfiguration | null>(null)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    async function fn() {
      const currentDir = await invoke<string>("get_current_dir")
      let configFile
      try {
        configFile = await invoke<string>("read_from_file", {
          path: `${currentDir}/${CONFIG_FILE_NAME}`,
        })
      } catch (err: any) {
        await invoke("write_to_file", {
          path: `${currentDir}/${CONFIG_FILE_NAME}`,
          text: JSON.stringify(defaultConfig),
        })
        setAppConfiguration(defaultConfig)
        return
      }
      try {
        const configJSON = JSON.parse(configFile)
        setAppConfiguration(configJSON)
      } catch (err: any) {
        setError(true)
      }
    }
    fn()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-white dark:bg-black text-gray-800 dark:text-gray-200 p-4">
        <div className="inline">
          Please check the
          <span className="px-2 italic">config.json</span> file
        </div>
      </div>
    )
  }
  if (!appConfiguration) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-white dark:bg-black text-gray-800 dark:text-gray-200 p-4">
        loading...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-screen flex-col bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      <HomePage config={appConfiguration} />
    </div>
  )
}
