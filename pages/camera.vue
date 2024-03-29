<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div>
        <div id="loading" v-if="!model">
          <h3>
            Loading model...
            <v-progress-circular
              class="ml-3"
              indeterminate
              color="amber"
            ></v-progress-circular>
          </h3>
        </div>
        <div v-else>
          <form v-if="!configured">
            <v-text-field
              class="my-8"
              v-model="name"
              label="Name"
            ></v-text-field>
            <v-select
              class="mb-8"
              v-model="select"
              :items="items"
              label="Species"
            ></v-select>
            <v-switch
              class="mb-8"
              v-model="monitorObject"
              hide-details
              inset
              label="Monitor a specific object"
            ></v-switch>
            <div v-if="monitorObject">
              <v-select
                class="mb-8"
                v-model="object"
                :items="objects"
                label="When my pet is near..."
              ></v-select>
              <v-checkbox v-model="alert" label="Alert me (sms)"></v-checkbox>
              <v-text-field
                v-if="alert"
                v-model="phoneNumber"
                label="Phone Number"
                hint="Format: +1XXXXXXXXXX"
              ></v-text-field>
              <v-checkbox v-model="playback" label="Play a noise"></v-checkbox>
              <v-select
                v-if="playback"
                class="mb-8"
                v-model="noise"
                :items="noises"
                label="Noise"
              ></v-select>
            </div>
            <div class="my-4" v-for="error in errors" :key="error.id">
              {{ error }}
            </div>
            <div class="mt-8">
              <v-btn class="mr-4" @click="submit"> Save </v-btn>
            </div>
          </form>
        </div>
        <br />
        <div v-show="configured" class="videoView">
          <video playsinline autoplay width="100%" ref="video">
            Stream Unavailable
          </video>
          <p
            v-for="prediction in predictions"
            :key="prediction.id"
            :style="{
              left: prediction.bbox[0] * ratioX + 'px',
              top: prediction.bbox[1] * ratioY + 'px',
              width: prediction.bbox[2] * ratioX + 'px',
            }"
            class="prediction"
          >
            {{ prediction.class }}
          </p>
          <div
            v-for="prediction in predictions"
            :key="prediction.id"
            :style="{
              left: prediction.bbox[0] * ratioX + 'px',
              top: prediction.bbox[1] * ratioY + 'px',
              width: prediction.bbox[2] * ratioX + 'px',
              height: prediction.bbox[3] * ratioY + 'px',
            }"
            class="highlighter"
          ></div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import * as cocoSsd from '@tensorflow-models/coco-ssd'

export default {
  data: () => ({
    monitorObject: false,
    cooldown: true,
    interactObject: null,
    alert: false,
    playback: false,
    model: false,
    configured: false,
    video: null,
    camStarted: false,
    predictions: [],
    ratioX: 1,
    ratioY: 1,
    name: '',
    select: '',
    object: '',
    noise: '',
    phoneNumber: '+1',
    items: ['Dog', 'Cat', 'Bird', 'Horse', 'Sheep', 'Person'],
    objects: ['Couch', 'Potted Plant', 'Bowl', 'Bed', 'Toilet', 'Cell Phone'],
    noises: ['Whistle', 'Clap', 'No'],
    noisesDict: {
      Whistle: '/whistle.mp3',
      Clap: '/clap.mp3',
      No: '/no.mp3',
    },
    errors: [],
    imgUrl: '',
  }),
  methods: {
    resetCooldown() {
      setTimeout(() => {
        this.cooldown = true
      }, 45000)
    },

    async sendAlert() {
      const body = {
        message: `${this.name} is near the ${this.object}!`,
        number: this.phoneNumber,
      }
      const response = await this.$axios.post('/api/sms', body)
      console.table(response)
      if (response.status != 201) {
        alert('Error sending SMS')
      }
    },

    playNoise() {
      var a = new Audio(this.noisesDict[this.noise])
      a.play()
    },

    recalculateVideoScale() {
      this.ratioY = this.video.clientHeight / this.video.videoHeight
      this.ratioX = this.video.clientWidth / this.video.videoWidth
    },

    async predictWebcam() {
      this.predictions = []
      let predictions = await app.model.detect(this.video)
      predictions.forEach((prediction) => {
        if (prediction.score > 0.5) {
          if (this.select.toLowerCase() == prediction.class) {
            this.checkInteractions(prediction)
          }
          this.predictions.push(prediction)
        }
      })
      window.requestAnimationFrame(this.predictWebcam)
      window.addEventListener('resize', this.recalculateVideoScale)
    },

    stopCamera() {
      if (this.camStarted) {
        this.configured = false
        this.video.pause()
        this.video.srcObject.getTracks().forEach((track) => track.stop())
      }
    },

    capture() {
      const canvas = document.createElement('canvas')
      canvas.width = this.video.videoWidth
      canvas.height = this.video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(
        this.video,
        0,
        0,
        this.video.videoWidth,
        this.video.videoHeight
      )
      canvas.toBlob((blob) => {
        this.saveImage(blob)
      })
    },

    async saveImage(blob) {
      const timestamp = Date.now()
      try {
        const imgRef = this.$fire.storage
          .ref()
          .child('images/' + timestamp + '.png')
        await imgRef.put(blob)
        this.imgUrl = await imgRef.getDownloadURL()
        this.saveEvent()
      } catch (err) {
        console.error(err)
      }
    },

    async saveEvent() {
      var d = new Date()
      const event = {
        uid: this.$fire.auth.currentUser.uid,
        name: this.name,
        object: this.interactObject,
        time: d.toLocaleString(),
        imgUrl: this.imgUrl,
      }
      try {
        const response = await this.$axios.post('/api/events', event)
      } catch (err) {
        console.error(err)
      }
    },

    startCamera() {
      const constraints = {
        video: {
          facingMode: 'environment',
        },
      }
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => {
            this.camStarted = true
            this.video.srcObject = stream
            this.video.play()
            this.video.onloadeddata = (event) => {
              this.recalculateVideoScale()
              this.predictWebcam()
            }
          })
          .catch((err) => {
            console.error(err)
          })
      }
    },

    distance(bbox1, bbox2) {
      let x1 = bbox1[0]
      let x2 = bbox2[0]
      let y1 = bbox1[1]
      let y2 = bbox2[1]
      let width1 = bbox1[2]
      let width2 = bbox2[2]
      let height1 = bbox1[3]
      let height2 = bbox2[3]
      let midX1 = x1 + width1 / 2
      let midX2 = x2 + width2 / 2
      let midY1 = y1 + height1 / 2
      let midY2 = y2 + height2 / 2

      let xDif = Math.abs(midX1 - midX2) - width1 / 2 - width2 / 2
      let yDif = Math.abs(midY1 - midY2) - height1 / 2 - height2 / 2

      if (xDif < 0) {
        // intersect in x plane
        return Math.max(yDif, 0)
      }

      if (yDif < 0) {
        // intersect in y plane
        return Math.max(xDif, 0)
      }

      return Math.sqrt(xDif * xDif + yDif * yDif)
    },

    handleInteraction() {
      if (this.cooldown) {
        this.cooldown = false
        this.capture()
        if (this.interactObject === this.object.toLowerCase()) {
          if (this.alert) {
            this.sendAlert()
          }
          if (this.playback) {
            this.playNoise()
          }
        }
        this.resetCooldown()
      }
    },

    recheck(item) {
      setTimeout(() => {
        for (let n = 0; n < this.predictions.length; n++) {
          if (
            this.isNear(item, this.predictions[n]) &&
            this.predictions[n].class != this.select &&
            this.predictions[n].class === this.interactObject
          ) {
            this.handleInteraction()
          }
        }
      }, 3000)
    },

    checkInteractions(item) {
      if (this.cooldown) {
        for (let n = 0; n < this.predictions.length; n++) {
          if (
            this.isNear(item, this.predictions[n]) &&
            this.predictions[n].class != this.select
          ) {
            this.interactObject = this.predictions[n].class
            this.recheck(item)
          }
        }
      }
    },

    isNear(item1, item2) {
      return this.distance(item1.bbox, item2.bbox) <= 0
    },

    validate() {
      this.errors = []
      if (!this.name) {
        this.errors.push('Name is required')
      }
      if (!this.select) {
        this.errors.push('Object is required')
      }
      if (this.monitorObject && !this.object) {
        this.errors.push('Object to monitor is required')
      }
      if (this.object && !this.alert && !this.playback) {
        this.errors.push('Select an action')
      }
      if (this.alert && !this.phoneNumber) {
        this.errors.push('Phone number is required')
      }
      if (this.alert && !this.phoneNumber.match(/^\+[1]{1}[0-9]{10}$/)) {
        this.errors.push('Phone number is invalid')
      }
      if (this.playback && !this.noise) {
        this.errors.push('Select a noise')
      }
    },

    submit() {
      this.validate()
      if (this.errors.length > 0) {
        return
      }
      this.configured = true
      this.startCamera()
    },
  },
  mounted() {
    this.video = this.$refs.video
    cocoSsd.load().then((loadedModel) => {
      app.model = loadedModel
      this.model = true
    })
  },
  beforeRouteLeave(to, from, next) {
    this.stopCamera()
    next()
  },
}
</script>

<style>
.videoView {
  position: relative;
  width: 100%;
  height: 100%;
}
.highlighter {
  background: transparent;
  border: 2px solid rgba(0, 255, 0, 0.5);
  z-index: 1;
  position: absolute;
}
.prediction {
  position: absolute;
  padding: 5px;
  color: #fff;
  font-size: 12px;
  margin: 0;
}
#loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
#loading h3 {
  color: #fff;
  font-size: 20px;
  margin: 0;
}
</style>
