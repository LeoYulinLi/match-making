import client from "socket.io-client"

const socket = client.connect("http://localhost:3001?apiKey=asdf")

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

const socket2 = client.connect("http://localhost:3001?apiKey=defg")

socket2.on("connect", () => {
  socket2.on("match", (data: any) => {
    console.log("matched")
    console.log(data)
  })
  socket2.emit("enqueue", {
    id: "abcd",
    level: 0.25
  })
  socket2.emit("enqueue", {
    id: "defg",
    level: 0.6
  })
  socket2.emit("enqueue", {
    id: "ns",
    level: 0.7
  })
  socket2.emit("enqueue", {
    id: "cnbv",
    level: 0.8
  })
  socket2.emit("enqueue", {
    id: "ryeh",
    level: 0.9
  })
  socket2.emit("enqueue", {
    id: "ewryg",
    level: 0.24
  })
  socket2.emit("requestMatch", { teamSize: 1 })
  console.log("requesting match")
  socket2.emit("config", { threshold: 0.3 })
  socket2.on("standby", () => console.log("standby"))
})
