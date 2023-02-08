const express = require('express')
const cors = require('cors')

const model = require('./model')
const Event = model.Event

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors)

app.get('/test', function (req, res) {
  console.log('- API Test -')
  res.send('Test successful')
})

app.post('/events', async (req, res) => {
  console.log('- Create event -')
  const newEvent = new Event({
    name: req.body.name,
    object: req.body.object,
    time: req.body.time,
    imgUrl: req.body.imgUrl,
  })
  try {
    const savedEvent = await newEvent.save()
    res.status(201).json(savedEvent)
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
})

app.get('/events', (req, res) => {
  console.log('- Get all events -')
  Event.find().then((events) => res.json(events))
})

export default {
  path: '/api',
  handler: app,
}
