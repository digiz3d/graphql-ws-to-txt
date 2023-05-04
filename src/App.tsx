import { gql } from "@apollo/client"
import { DocumentNode } from "graphql"
import { useState } from "react"

import CustomApolloProvider from "./CustomApolloProvider"
import Subscriper from "./Subscriber"

import "./App.css"

function tryParseGql(query: string) {
  try {
    return gql(query)
  } catch (err) {
    return null
  }
}

function App() {
  const [serverUrl, setServerUrl] = useState("")
  const [query, setQuery] = useState<string>("")
  const [parsedQuery, setParsedQuery] = useState<DocumentNode | null>(null)
  const [jsonPath, setJsonPath] = useState("$")

  return (
    <CustomApolloProvider url={serverUrl}>
      <div className="container">
        <div className="row">
          <input
            id="greet-input"
            onChange={(e) => setServerUrl(e.currentTarget.value)}
            placeholder="WS URL"
            value={serverUrl}
          />
        </div>
        <br />
        <div className="row">
          <textarea
            onChange={(e) => {
              setQuery(e.currentTarget.value)
              setParsedQuery(tryParseGql(e.currentTarget.value))
            }}
            placeholder="Enter the GQL subscription"
            value={query}
          />
        </div>
        <br />
        <div className="row">
          <input
            id="greet-input"
            onChange={(e) => setJsonPath(e.currentTarget.value)}
            placeholder="JSON path"
            value={jsonPath}
          />
        </div>
        <div className="row">
          {parsedQuery && (
            <Subscriper parsedQuery={parsedQuery} jsonPath={jsonPath} />
          )}
        </div>
      </div>
    </CustomApolloProvider>
  )
}

export default App
