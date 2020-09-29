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
  setTimeout(() => {
    socket.emit("enqueue", {
      id: "234",
      level: 0.5
    })
  }, 1000)
})

const socket2 = client.connect("http://localhost:3000?apiKey=defg")

socket2.on("connect", () => {
  socket2.on("match", (data: any) => {
    console.log(data)
  })
  socket2.emit("enqueue", {
    id: "abcd",
    level: 0.25
  })
  socket2.emit("enqueue", {
    id: "defg",
    level: 0.5
  })
  socket2.emit("config", { threshold: 0.3 })
})
