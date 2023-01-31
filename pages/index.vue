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
      events: [
        {
          title: 'Apollo at the Trashcan',
          time: '2020-01-01 12:45',
          img: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
        },
        {
          title: 'Apollo at the Bowl',
          time: '2020-01-01 12:00',
          img: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
        },
        {
          title: 'Apollo at the Couch',
          time: '2020-01-01 11:00',
          img: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
        },
      ],
    }
  },
  methods: {
    async getEvents() {
      try {
        const response = await this.$axios.get('/api/events')
        console.log(response.data)
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
