import { useState, useEffect } from 'react'

function App() {
  const [prompt, setPrompt] = useState('')
  const [jobId, setJobId] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  const generate = async () => {
    setStatus('starting...')
    setJobId(null)
    setVideoUrl(null)
    try {
      const res = await fetch('/api/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()
      setJobId(data.id)
      setStatus(data.status)
    } catch (e) {
      console.error(e)
      setStatus('error')
    }
  }

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (jobId && status !== 'completed' && status !== 'error') {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/generations/${jobId}`)
          const data = await res.json()
          setStatus(data.status)
          if (data.status === 'completed') {
            setVideoUrl(data.videoUrl)
          }
        } catch (e) {
          console.error(e)
        }
      }, 2000)
    }
    return () => clearInterval(interval)
  }, [jobId, status])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">AI Video Generator</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A cinematic shot of a cyberpunk city..."
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button 
          onClick={generate}
          disabled={!prompt || status === 'pending'}
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Generate Video
        </button>

        {status && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-600">Status: <span className="font-semibold text-gray-800">{status}</span></p>
            {jobId && <p className="text-xs text-gray-500 mt-1">Job ID: {jobId}</p>}
          </div>
        )}

        {videoUrl && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Result:</p>
            <video src={videoUrl} controls className="w-full rounded-md shadow-sm" />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
