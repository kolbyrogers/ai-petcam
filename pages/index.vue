<template>
  <div id="home">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <h2>Feed</h2>
        <div v-for="(event, index) in events" :key="index" id="feed">
          <Event :event="event" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      events: [],
    }
  },
  methods: {
    async getEvents() {
      try {
        const response = await this.$axios.get('/api/events')
        this.events = response.data.reverse()
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
