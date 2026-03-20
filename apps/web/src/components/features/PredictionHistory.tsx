import { useState, useEffect } from "react"
import { Clock, Trash2, ExternalLink } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserPredictions, deletePrediction } from "@/lib/database"
import type { Prediction } from "@/lib/database"

export function PredictionHistory() {
  const { user } = useAuth()
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const loadPredictions = async () => {
      try {
        const data = await getUserPredictions(user.id)
        setPredictions(data)
      } catch (error) {
        console.error("Failed to load predictions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPredictions()
  }, [user])

  const handleDelete = async (predictionId: string) => {
    if (!user) return

    setDeletingId(predictionId)
    try {
      await deletePrediction(user.id, predictionId)
      setPredictions(prev => prev.filter(p => p.id !== predictionId))
    } catch (error) {
      console.error("Failed to delete prediction:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateDescription = (description: string, maxLength: number = 100) => {
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength) + '...'
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-ink-muted">Please sign in to view your prediction history.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-surface-1 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-surface-2 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-surface-2 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (predictions.length === 0) {
    return (
      <div className="bg-surface-1 rounded-lg p-8 text-center border border-border-subtle">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-ink-muted" />
          </div>
          <h3 className="text-lg font-semibold text-ink-primary mb-2">No predictions yet</h3>
          <p className="text-ink-secondary">
            Make your first AI-powered tech stack prediction to see it here!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-ink-primary">Your Prediction History</h2>
        <div className="flex items-center gap-2 text-sm text-ink-muted bg-surface-1 px-3 py-1.5 rounded-lg border">
          <span className="font-medium">{predictions.length}</span>
          <span>predictions</span>
        </div>
      </div>
      
      <div className="grid gap-4">
        {predictions.map((prediction) => (
          <div
            key={prediction.id}
            className="bg-surface-1 rounded-lg p-5 border border-border-subtle hover:border-border-default transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-2">
                <h4 className="font-medium text-ink-primary text-sm leading-tight line-clamp-2">
                  {truncateDescription(prediction.project_description)}
                </h4>
                
                <div className="flex items-center gap-4 text-xs text-ink-muted">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(prediction.created_at)}</span>
                  </div>
                  <div className="px-2 py-0.5 bg-surface-2 rounded text-[10px] font-mono">
                    AI Scored
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    const state = { result: prediction.prediction_result }
                    const newWindow = window.open(`/results`, '_blank')
                    if (newWindow && 'result' in newWindow) {
                      (newWindow as any).result = state
                    }
                  }}
                  className="p-2 rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-surface-2 transition-all duration-200"
                  title="View full prediction"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleDelete(prediction.id)}
                  disabled={deletingId === prediction.id}
                  className="p-2 rounded-lg text-ink-secondary hover:text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
                  title="Delete prediction"
                >
                  {deletingId === prediction.id ? (
                    <div className="w-4 h-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
