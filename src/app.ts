import * as io from "socket.io";

const server = io.listen(process.env.PORT || 3000)

server.on("connection", (socket) => {
  console.log("user connected")
})
