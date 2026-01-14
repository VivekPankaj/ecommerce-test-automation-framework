type Props = {
  loading: boolean
  result: any
  error: string | null
  retry: () => void
  waitingForRecovery?: boolean
  recoveryElapsedMs?: number
}

export default function ServiceStatusBanner({ loading, result, error, retry, waitingForRecovery, recoveryElapsedMs }: Props) {
  if (!loading && !error && result && result.checks && Object.values(result.checks).every((v: any) => v === 'ok')) {
    return null
  }

  return (
    <div className="w-full bg-yellow-50 border-b border-yellow-200 p-3 text-sm flex items-center justify-between">
      <div>
        {loading && <span>Checking services…</span>}
        {!loading && waitingForRecovery && (
          <span>Waiting for backend to recover… (elapsed {Math.round((recoveryElapsedMs||0)/1000)}s)</span>
        )}
        {!loading && error && <span className="text-red-600">Service check failed: {error}</span>}
        {!loading && !error && result && (
          <span>
            Backend: <strong>{result.checks?.backend}</strong> — Frontend: <strong>{result.checks?.frontend}</strong>
            {result.actions && result.actions.length > 0 && (
              <span className="ml-4">Actions: {result.actions.map((a: any) => a.status).join(', ')}</span>
            )}
          </span>
        )}
      </div>

      <div>
        <button
          onClick={retry}
          className="ml-4 px-3 py-1 bg-white border rounded text-sm hover:bg-gray-50"
          disabled={loading}
        >
          Retry
        </button>
      </div>
    </div>
  )
}
