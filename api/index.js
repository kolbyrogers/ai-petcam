const express = require('express')
const cors = require('cors')
const model = require('./model')
const Event = model.Event

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

// Test
app.get('/test', function (req, res) {
  console.log('- API Test -')
  res.send('Test successful')
})

// Events
app.post('/events', async (req, res) => {
  console.log('- Create event -')
  const newEvent = new Event({
    userid: req.body.uid,
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

app.get('/events', async (req, res) => {
  console.log('- Get all events -')
  try {
    const events = await Event.find()
    if (events) {
      console.log(events)
      res.status(200).json(events)
    } else {
      res.status(404).json('Events not found')
    }
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
})

app.get('/events/:uid', async (req, res) => {
  console.log('- Get events by user -')
  try {
    const query = { userid: req.params.uid }
    const events = await Event.find(query)
    if (events) {
      console.log(events)
      res.status(200).json(events)
    } else {
      res.status(404).json('Events not found')
    }
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
})

app.delete('/events/:id', async (req, res) => {
  console.log('- Delete event -')
  try {
    const event = await Event.findOne({
      _id: req.params.id,
    })
    if (event) {
      await event.delete()
      res.status(200).json('Event deleted')
    } else {
      res.status(404).json('Event not found')
    }
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
})

export default {
  path: '/api',
  handler: app,
}
