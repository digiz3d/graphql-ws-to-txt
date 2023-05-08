import { invoke } from "@tauri-apps/api/tauri"

import defaultConfig from "./default-config.json"
import { AppConfiguration, AppConfigurationSchema } from "./types"

const CONFIG_FILE_NAME = "config.json"

export async function readAppConfig() {
  const currentDir = await invoke<string>("get_current_dir")
  let configJSON
  try {
    configJSON = await invoke<string>("read_from_file", {
      path: `${currentDir}/${CONFIG_FILE_NAME}`,
    })
  } catch (err: any) {
    const defaultAppConfig = defaultConfig as AppConfiguration
    await writeAppConfig(defaultAppConfig)
    return defaultAppConfig
  }
  let configObject
  try {
    configObject = JSON.parse(configJSON)
  } catch (err: any) {
    throw new Error("Invalid config.json file")
  }
  try {
    return AppConfigurationSchema.parse(configObject)
  } catch (err: any) {
    throw new Error("Invalid config.json file: " + err.message)
  }
}

export async function writeAppConfig(config: AppConfiguration) {
  const currentDir = await invoke<string>("get_current_dir")
  await invoke("write_to_file", {
    path: `${currentDir}/${CONFIG_FILE_NAME}`,
    text: JSON.stringify(config, null, 2),
  })
}
