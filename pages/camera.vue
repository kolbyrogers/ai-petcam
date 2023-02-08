<template>
  <div>
    <form v-if="!configured">
      <v-text-field v-model="name" label="Name" required></v-text-field>
      <v-select
        class="mb-8"
        v-model="select"
        :items="items"
        label="Species"
        required
      ></v-select>
      <div class="mb-4" v-for="error in errors" :key="error.id">
        {{ error }}
      </div>
      <v-btn class="mr-4" @click="submit"> Save </v-btn>
    </form>
    <br />
    <div v-show="configured">
      <video width="100%" ref="video">Stream Unavailable</video>
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
    items: ['Dog', 'Cat', 'Human'],
    errors: [],
  }),
  methods: {
    capture() {
      const canvas = document.createElement('canvas')
      canvas.width = 640
      canvas.height = 480
      const ctx = canvas.getContext('2d')
      ctx.drawImage(this.video, 0, 0, 640, 480)
      canvas.toBlob((blob) => {
        console.log(blob)
      })
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
      if (!this.name || !this.select) {
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
