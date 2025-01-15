import React, { useEffect, useRef, useState } from 'react'
import { useWindowSize } from 'usehooks-ts'
import { useDrawing } from '~/hooks/use-draw'
import io, { type Socket } from 'socket.io-client'
import { type DefaultEventsMap } from 'socket.io'
import { env } from '~/env'

export const WhiteBoard = () => {
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null)
  console.log(env.NEXT_PUBLIC_DEPLOYMENT)
  useEffect(() => {
    fetch('/api/live-socket')
      .then(() => {
        const newSocket = io(env.NEXT_PUBLIC_DEPLOYMENT)
        console.log(newSocket, 'Connected to socket')
        setSocket(newSocket)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { width, height } = useWindowSize({
    initializeWithValue: false,
  })

  useEffect(() => {
    // Emit canvas image to the server
    if (socket) {
      const handleCanvasImage = (data: string) => {
        const image = new Image()
        image.src = data

        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')

        image.onload = () => {
          ctx?.drawImage(image, 0, 0)
        }
      }

      socket.on('canvasImage', handleCanvasImage)

      return () => {
        socket.off('canvasImage', handleCanvasImage)
      }
    }
  }, [socket])

  useDrawing(canvasRef, socket)

  return <canvas id="canvas" ref={canvasRef} width={width} height={height} />
}
