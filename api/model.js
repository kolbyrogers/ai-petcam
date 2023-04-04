const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

mongoose.connect(process.env.MONGODB)

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
