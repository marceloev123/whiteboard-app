import { useState, useEffect, type RefObject, useCallback } from 'react'
import { type DefaultEventsMap } from 'socket.io'
import { type Socket } from 'socket.io-client'
import { useSettingsStore } from '~/stores/settings-store'
import { useToolbarStore } from '~/stores/toolbar-store'

type DrawingState = {
  isDrawing: boolean
  lastPos: { x: number; y: number }
}

export const useDrawing = (
  canvasRef: RefObject<HTMLCanvasElement> | null,
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null,
) => {
  const toolbarAction = useToolbarStore((state) => state.toolbarAction)
  const brushColor = useSettingsStore((state) => state.brushColor)
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    lastPos: { x: 0, y: 0 },
  })

  const startDrawing = (e: MouseEvent) => {
    setDrawingState({
      isDrawing: true,
      lastPos: { x: e.offsetX, y: e.offsetY },
    })
  }

  const draw = useCallback(
    (e: MouseEvent) => {
      if (!drawingState.isDrawing || !canvasRef) return

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.beginPath()
      ctx.moveTo(drawingState.lastPos.x, drawingState.lastPos.y)
      ctx.lineTo(e.offsetX, e.offsetY)
      ctx.stroke()

      // Update the last position
      setDrawingState({
        ...drawingState,
        lastPos: { x: e.offsetX, y: e.offsetY },
      })
    },
    [canvasRef, drawingState],
  )

  const endDrawing = useCallback(() => {
    setDrawingState({ ...drawingState, isDrawing: false })
    if (!canvasRef) return
    const canvas = canvasRef.current
    if (!canvas) return
    const dataURL = canvas.toDataURL()
    if (socket) {
      socket.emit('canvasImage', dataURL)
      console.log('drawing ended')
    }
  }, [canvasRef, drawingState, socket])

  useEffect(() => {
    if (!canvasRef) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = brushColor
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (toolbarAction === 'draw') {
      // Set up event listeners for mouse events
      const handleMouseDown = (e: MouseEvent) => startDrawing(e)
      const handleMouseMove = (e: MouseEvent) => draw(e)
      const handleMouseUp = () => endDrawing()
      const handleMouseOut = () => endDrawing()

      // Add event listeners with native DOM events
      canvas.addEventListener('mousedown', handleMouseDown as EventListener)
      canvas.addEventListener('mousemove', handleMouseMove as EventListener)
      canvas.addEventListener('mouseup', handleMouseUp as EventListener)
      canvas.addEventListener('mouseout', handleMouseOut as EventListener)

      // Clean up event listeners when component unmounts or when toolbarAction changes
      return () => {
        canvas.removeEventListener(
          'mousedown',
          handleMouseDown as EventListener,
        )
        canvas.removeEventListener(
          'mousemove',
          handleMouseMove as EventListener,
        )
        canvas.removeEventListener('mouseup', handleMouseUp as EventListener)
        canvas.removeEventListener('mouseout', handleMouseOut as EventListener)
      }
    }
  }, [brushColor, canvasRef, draw, endDrawing, toolbarAction])
}
