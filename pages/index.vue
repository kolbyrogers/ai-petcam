<template>
  <div id="home">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-img id="petcam" src="ai-petcam.png"></v-img>
        <h2>Welcome {{ $fire.auth.currentUser.displayName.split(' ')[0] }}!</h2>
        <p>
          This web app utilizes the power of artificial intelligence to turn any
          device, such as your old smartphone, into a smart pet monitoring
          device
        </p>
        <p>Here's how you can get started</p>
        <ul>
          <li>
            Place your device in a convenient spot in your home where you want
            to monitor your pet. Make sure it has a clear view of the area where
            your pet spends most of their time
          </li>
          <li>
            Customize your petcam settings according to your preferences. You
            can set a specific object of interest to monitor, such as your
            couch, and set the app to send notifications, or play a sound when
            your pet is near
          </li>
          <li>
            The AI Petcam records photos when an interaction is detected, so you
            can review past images and see what your pet has been up to while
            you were away
          </li>
        </ul>
        <v-btn id="btn" class="mb-8" to="/camera"
          ><v-icon class="pr-4">mdi-camera</v-icon>Start Monitoring</v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
}
</script>

<style scoped>
#petcam {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
h2 {
  text-align: center;
  font-size: 2rem;
  font-weight: 350;
  margin-bottom: 2rem;
}
p {
  font-size: 1.25rem;
  font-weight: 350;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
ul {
  font-size: 1.25rem;
  font-weight: 350;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
li {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>
