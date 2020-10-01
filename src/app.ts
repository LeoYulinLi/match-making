import * as io from "socket.io";
import mongoose from "mongoose";
import keys from "./keys/keys";
import User from "./models/User";
import { emit } from 'cluster';

const server = io.listen(process.env.PORT || 3001)

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

server.use((async (socket, next) => {
  const apiKey = socket.handshake.query.apiKey
  if (apiKey) {
    const user = await User.findOne({ apiKey })
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
  bucketSize: number
}

interface RequestOption {
  teamSize: number
}

// Team1: [1, 4], 2
// Team2: 1, 3, 2

server.on("connection", (socket) => {

  let players: Player[] = []

  const buckets: Record<number, string[]> = {}

  let config: Config = {
    threshold: 0.2,
    bucketSize: 0.1

  }

  function getBucket(player: Player) {
    console.log(config.bucketSize)
    const result = Math.floor(player.level / config.bucketSize)
    console.log(`${player.id} is at bucket ${result}`)
    return result
  }

  function matchPlayer(newPlayer: Player) {
    console.log(`enqueued player with id ${ newPlayer.id } at level ${ newPlayer.level }`)
    players.push(newPlayer)
    const bucket = getBucket(newPlayer)
    if (buckets[bucket]) {
      buckets[bucket].push(newPlayer.id)
    } else {
      buckets[bucket] = [newPlayer.id]
    }
  }

  socket.on("enqueue", matchPlayer)

  // TODO: bucket
  socket.on("dequeue", (player: Player) => {
    delete players[players.findIndex(it => it.id === player.id)]
  })

  socket.on("config", (newConfig: Config) => {
    config = { ...config, ...newConfig }
    const playersCopy = [...players]
    players = []
    playersCopy.forEach(player => matchPlayer(player))
  })


  socket.on("requestMatch", (option: RequestOption) =>{
    console.log("requestMatch")
    console.log(option)

    const firstPlayer = players[0]

    const bucket = getBucket(firstPlayer)

    if (buckets[bucket].length >= option.teamSize * 2) {

      const result = []

      for (let i = 0; i < option.teamSize * 2; i++) {
        result.push(buckets[bucket].pop())
      }
      console.log("match")
      console.log(result)
    } else {
      console.log("standby")
      emit("standby", "")
    }

  })
})
