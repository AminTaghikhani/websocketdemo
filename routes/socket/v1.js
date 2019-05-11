class Socket {
  constructor(io = null) {
    this.io = io;
    this.panel = null;
    this.users = [];
  }

  init(io = null) {
    if (io != null)
      this.io = io;
    this.io.on('connection', onConnection);
  }

  userJoin(socket, name) {
    this.users.push(socket)
    this.sendUser(this.panel.id, 'join', { id: socket.id, name })
  }

  userLeft(socket) {
    this.users = this.users.filter((user) => user.id !== socket.id)
    this.sendUser(this.panel.id, 'leave', { id: socket.id })
  }
  userKick(data) {
    const user = this.users.find((user) => user.id === data.id)
    user.disconnect()
  }
  send(name, data) {
    this.io.emit(name, data);
  }
  sendUser(user, name, data) {
    this.io.to(`${user}`).emit(name, data);
  }
  sendToUser(data) {
    this.sendUser(data.targetId, 'receive', {message:data.message})
  }
  sendToAdmin(data,socket) {
    this.sendUser(this.panel.id, 'receive', { id: socket.id, message: data })
  }
}

const instance = new Socket();

const onConnection = (socket) => {
  const type = socket.handshake.query.UserType;
  if (type === 'App') {
    const userName = socket.handshake.query.Name;
    instance.userJoin(socket, userName);
  } else {
    instance.panel = socket;
  }
  // instance.userJoin(socket);
  console.log('user connected: ', socket.id);
  socket.on('disconnect', () => {
    instance.userLeft(socket);
    console.log('user disconnect: ', socket.id);
  });
  socket.on('kick', (data) => instance.userKick(data))
  socket.on('send-admin', (data) => instance.sendToUser(data))
  socket.on('send', (data) => instance.sendToAdmin(data, socket))
};

module.exports = instance;