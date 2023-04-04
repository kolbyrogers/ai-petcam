const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

mongoose.connect(
  'mongodb+srv://krogers:MwgGeaBR8Fpswklj@cluster0.ka7qd.mongodb.net/petcam?retryWrites=true&w=majority'
)

const Event = mongoose.model('Event', {
  userid: {
    type: String,
  },
  name: {
    type: String,
  },
  object: {
    type: String,
  },
  time: {
    type: String,
  },
  imgUrl: {
    type: String,
  },
})

module.exports = {
  Event: Event,
}
