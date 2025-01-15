// pages/api/socket.ts
import { type NextApiRequest, type NextApiResponse } from 'next'
import { Server } from 'socket.io'
import { type Server as NetServer } from 'http'
import { type Socket } from 'net'

interface SocketServer extends NetServer {
  io?: Server
}

interface ExtendedNextApiResponse extends NextApiResponse {
  socket: Socket & {
    server: SocketServer
  }
}

export default function handler(
  req: NextApiRequest,
  res: ExtendedNextApiResponse,
) {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO server...')

    const io = new Server(res.socket.server, {
      transports: ['websocket', 'polling'],
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    })

    io.on('connection', (socket) => {
      console.log('New connection established')

      socket.on('canvasImage', (data) => {
        socket.broadcast.emit('canvasImage', data)
      })

      socket.on('disconnect', () => {
        console.log('User disconnected')
      })
    })

    res.socket.server.io = io
  } else {
    console.log('Socket.IO server already initialized')
  }

  res.end()
}
