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

interface Config {
  threshold: number
}


server.on("connection", (socket) => {

  let players: Player[] = []

  let config: Config = {
    threshold: 0.2
  }

  function matchPlayer(newPlayer: Player) {
    console.log(`enqueued player with id ${ newPlayer.id } at level ${ newPlayer.level }`)
    const matchingPlayerIndex = players.findIndex((player) => {
      return player.level - config.threshold < newPlayer.level && player.level + config.threshold > newPlayer.level
    })
    if (matchingPlayerIndex != -1) {
      socket.emit("match", [newPlayer, players[matchingPlayerIndex]])
      console.log(`matched player ${ newPlayer.id } and ${ players[matchingPlayerIndex].id }`)
      delete players[matchingPlayerIndex]
    } else {
      players.push(newPlayer)
    }
  }

  socket.on("enqueue", matchPlayer)
  socket.on("dequeue", (player: Player) => {
    delete players[players.findIndex(it => it.id === player.id)]
  })

  socket.on("config", (newConfig: Config) => {
    config = newConfig
    const playersCopy = [...players]
    players = []
    playersCopy.forEach(player => matchPlayer(player))
  })


})
