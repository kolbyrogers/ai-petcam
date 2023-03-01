<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div>
        <form v-if="!configured">
          <v-text-field v-model="name" label="Pet Name" required></v-text-field>
          <v-select
            class="mb-8"
            v-model="select"
            :items="items"
            label="Pet Species"
            required
          ></v-select>
          <v-select
            class="mb-8"
            v-model="object"
            :items="objects"
            label="Alert me when my pet is near..."
            required
          ></v-select>
          <v-text-field
            v-model="phoneNumber"
            label="Phone Number"
            @input="acceptNumber"
            :rules="[rules.counter]"
            maxLength="14"
            required
          ></v-text-field>
          <div class="mb-4" v-for="error in errors" :key="error.id">
            {{ error }}
          </div>
          <div v-if="!model">
            <h3>Loading model...</h3>
          </div>
          <v-btn v-else class="mr-4" @click="submit"> Save </v-btn>
        </form>
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
            {{ prediction.class }} with
            {{ Math.round(parseFloat(prediction.score) * 100) }}% confidence
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
          <v-btn class="mr-4" @click="capture">Capture</v-btn>
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
    model: false,
    configured: false,
    video: null,
    predictions: [],
    ratioX: 1,
    ratioY: 1,
    name: 'Kolby',
    select: 'Person',
    phoneNumber: '4357730653',
    items: ['Dog', 'Cat', 'Person'],
    object: 'Bed',
    objects: ['Trashcan', 'Couch', 'Bed'],
    errors: [],
    imgUrl: '',
    rules: {
      counter: (value) => value.length <= 14,
    },
  }),
  methods: {
    recalculateVideoScale() {
      this.ratioY = this.video.clientHeight / this.video.videoHeight
      this.ratioX = this.video.clientWidth / this.video.videoWidth
    },
    acceptNumber() {
      var x = this.phoneNumber
        .replace(/\D/g, '')
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
      this.phoneNumber = !x[2]
        ? x[1]
        : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '')
    },
    async predictWebcam() {
      this.predictions = []
      let predictions = await app.model.detect(this.video)
      for (let n = 0; n < predictions.length; n++) {
        if (predictions[n].score > 0.5) {
          this.predictions.push(predictions[n])
        }
      }
      window.requestAnimationFrame(this.predictWebcam)
      window.addEventListener('resize', this.recalculateVideoScale)
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
        name: this.name,
        object: this.object,
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
            this.video.srcObject = stream
            this.video.play()
            this.video.onloadeddata = (event) => {
              this.recalculateVideoScale()
              this.predictWebcam()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    submit() {
      this.errors = []
      if (!this.name || !this.select || !this.object) {
        this.errors.push('Please fill out all fields')
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
      console.log('Model loaded')
    })
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
  border: 1px solid rgba(0, 255, 0, 0.5);
  z-index: 2;
  font-size: 12px;
  margin: 0;
}
</style>
