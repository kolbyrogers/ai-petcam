<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <h1>Feed</h1>
      <div v-for="(event, index) in events" :key="index">
        <Event :event="event" />
      </div>
    </v-col>
  </v-row>
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
        console.log(response.data)
        this.events = response.data
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
