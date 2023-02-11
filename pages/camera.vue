<template>
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
      <v-btn class="mr-4" @click="submit"> Save </v-btn>
    </form>
    <br />
    <div v-show="configured">
      <video playsinline autoplay width="100%" ref="video">
        Stream Unavailable
      </video>
      <v-btn class="mr-4" @click="capture">Capture</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    configured: false,
    video: null,
    name: '',
    select: null,
    phoneNumber: '',
    items: ['Dog', 'Cat', 'Human'],
    object: null,
    objects: ['Trashcan', 'Couch', 'Bed'],
    errors: [],
    imgUrl: '',
    rules: {
      counter: (value) => value.length <= 14,
    },
  }),
  methods: {
    acceptNumber() {
      var x = this.phoneNumber
        .replace(/\D/g, '')
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
      this.phoneNumber = !x[2]
        ? x[1]
        : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '')
    },

    capture() {
      const canvas = document.createElement('canvas')
      canvas.width = 640
      canvas.height = 480
      const ctx = canvas.getContext('2d')
      ctx.drawImage(this.video, 0, 0, 640, 480)
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
          width: 640,
          height: 480,
        },
      }
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => {
            this.video.srcObject = stream
            this.video.play()
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
  },
}
</script>
