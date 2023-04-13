const express = require('express')
const cors = require('cors')
const model = require('./model')
const Event = model.Event
const accountSid = 'ACc39f2297f0daab17b61bbf660de0fdaa'
const authToken = process.env.TWILLIO
const client = require('twilio')(accountSid, authToken)

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

// Test
app.get('/test', function (req, res) {
  res.send('OK')
})

// Twilio
app.post('/sms', async (req, res) => {
  try {
    let message = await client.messages.create({
      body: req.body.message,
      from: '+18449653158',
      to: req.body.number,
    })
    res.status(201).json(message.sid)
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
})

// Events
app.post('/events', async (req, res) => {
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
  try {
    const events = await Event.find()
    if (events) {
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
  try {
    const query = { userid: req.params.uid }
    const events = await Event.find(query)
    if (events) {
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
