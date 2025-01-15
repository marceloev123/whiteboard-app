import { Server } from 'socket.io';
const io = new Server({
  cors: {
    origin: '*',
  },
})
io.on('connection', function (socket) {
  socket.on('canvasImage', (data) => {
    socket.broadcast.emit('canvasImage', data)
  })
})

io.listen(5000)
