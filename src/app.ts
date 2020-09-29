import * as io from "socket.io";
import mongoose from "mongoose";
import keys from "./keys/keys";
import User from "./models/User";

const server = io.listen(process.env.PORT || 3000)

if (keys.mongoURI) {
  mongoose
    .connect(keys.mongoURI, { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log(err));
} else {
  console.error("No mongo URL was found")
}

// const user = new User({
//   username: "hi",
//   password: "asdf",
//   apiKey: "asdf"
// })
//
// user.save()

server.use(((socket, next) => {
  const apiKey = socket.handshake.query.apiKey
  if (apiKey) {
    const user = User.findOne({ apiKey })
    if (user) {
      next()
    }
  }
  next(new Error('authentication error'))
}))

interface Player {
  id: string
  level: number
}


server.on("connection", (socket) => {
  const players: Player[] = []
  socket.on("enqueue", async (player: Player) => {
    console.log(`enqueued player with id ${player.id} at level ${player.level}`)
    if (players.length > 0) {
      socket.emit("match", [player, players[0]])
      console.log(`matched player ${player.id} and ${players[0].id}`)
      delete players[0]
    } else {
      players.push(player)
    }
  })
})
