import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { loadPresentationConfig } from './utils/configLoader'
import { ConfigProvider } from './context/ConfigContext'
import { Layout } from './components/Layout/Layout'
import { PresentationPage } from './pages/PresentationPage'
import { ConfigEditor } from './pages/ConfigEditor'
import './App.css'

function App() {
  // Load configuration
  let config
  try {
    config = loadPresentationConfig()
    console.log('Configuration loaded successfully:', config)
  } catch (err) {
    console.error('Failed to load configuration:', err)
    return (
      <div className="App">
        <h1>Configuration Error</h1>
        <p style={{ color: 'red' }}>
          {err instanceof Error ? err.message : 'Unknown error'}
        </p>
      </div>
    )
  }

  return (
    <ConfigProvider config={config}>
      <Router>
        <Routes>
          {/* Config editor route - standalone without Layout */}
          <Route path="/config" element={<ConfigEditor />} />

          {/* Presentation routes with Layout */}
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  {/* Dynamic routes from configuration */}
                  {config.pages.map((page) => (
                    <Route
                      key={page.id}
                      path={page.path}
                      element={<PresentationPage page={page} />}
                    />
                  ))}

                  {/* 404 - redirect to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </ConfigProvider>
  )
}

export default App
