"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, RefreshCw, Settings, Wifi, WifiOff } from 'lucide-react'

interface ServiceStatusProps {
  serviceName?: string
  onRetry?: () => void
}

export function ServiceUnavailable({ 
  serviceName = "Backend Service", 
  onRetry 
}: ServiceStatusProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      if (onRetry) {
        await onRetry()
      } else {
        // Default retry behavior - reload the page
        window.location.reload()
      }
    } catch (error) {
      console.error('Retry failed:', error)
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 text-destructive">
            <WifiOff className="h-full w-full" />
          </div>
          <CardTitle className="text-xl">Service Unavailable</CardTitle>
          <CardDescription>
            {serviceName} is currently unavailable. This might be temporary while services are starting up.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm space-y-2">
                <p className="font-medium">Possible reasons:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Backend services are still starting up</li>
                  <li>Database connection issues</li>
                  <li>Network connectivity problems</li>
                  <li>Service configuration errors</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleRetry}
              disabled={isRetrying}
              className="flex-1"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'} 
              className="flex-1"
            >
              <Settings className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              If the problem persists, please contact technical support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="bg-destructive text-destructive-foreground px-4 py-2 text-center text-sm">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span>No internet connection. Some features may not work.</span>
      </div>
    </div>
  )
}