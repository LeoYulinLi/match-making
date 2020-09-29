import client from "socket.io-client"

const socket = client.connect("http://localhost:3000?apiKey=asdf")

socket.on("connect", () => {
  socket.on("match", (data: any) => {
    console.log(data)
  })
  socket.emit("enqueue", {
    id: "1234",
    level: 0.5
  })
  socket.emit("enqueue", {
    id: "234",
    level: 0.5
  })
})
