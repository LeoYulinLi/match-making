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

server.on("connection", (socket) => {
  socket.on("enqueue", async ({ id, level }) => {
    console.log(`enqueued player with id ${id} at level ${level}`)
  })
})
