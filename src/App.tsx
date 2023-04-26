import { useState } from "react"

import "./App.css"
import CustomApolloProvider from "./CustomApolloProvider"
import Subscriper from "./Subscriber"

function App() {
  const [serverUrl, setServerUrl] = useState("")
  const [query, setQuery] = useState("")
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
            onChange={(e) => setQuery(e.currentTarget.value)}
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
          {!!query && <Subscriper query={query} jsonPath={jsonPath} />}
        </div>
      </div>
    </CustomApolloProvider>
  )
}

export default App
