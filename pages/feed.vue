<template>
  <div id="home">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <div v-if="events.length == 0">
          <v-img id="petcam" src="ai-petcam.png"></v-img>
          <v-card>
            <v-card-text>
              <h3>Nothing to see here yet!</h3>
              <p>
                Once you've set up your petcam, you'll see events here when your
                pet is near objects of interest
              </p>
              <v-btn to="/">Learn how</v-btn>
            </v-card-text>
          </v-card>
        </div>
        <div v-else v-for="(event, index) in events" :key="index" id="feed">
          <h3>Feed</h3>
          <Event :event="event" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'FeedPage',
  data() {
    return {
      events: [],
    }
  },
  methods: {
    async getEvents() {
      try {
        let path = '/api/events/' + this.$fire.auth.currentUser.uid
        const response = await this.$axios.get(path)
        if (response.status === 200) {
          this.events = response.data.reverse()
        }
      } catch (err) {
        console.log(err)
      }
    },
  },
  mounted() {
    this.getEvents()
  },
}
</script>

<style scoped>
#petcam {
  opacity: 20%;
}
</style>
