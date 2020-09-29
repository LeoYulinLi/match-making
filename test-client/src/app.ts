import client from "socket.io-client"

const socket = client.connect("http://localhost:3000?apiKey=asdf")

socket.on("connect", () => {
  console.log("connected")
})
