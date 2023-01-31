<template>
  <div>
    <video width="100%" ref="video">Stream Unavailable</video>
  </div>
</template>

<script>
export default {
  data: () => ({
    video: null,
  }),
  methods: {
    startCamera() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then((stream) => {
            this.video.srcObject = stream
            this.video.play()
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
  },
  mounted() {
    this.video = this.$refs.video
    this.startCamera()
  },
}
</script>
