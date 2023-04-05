<template>
  <v-card v-if="!deleted" class="mx-auto my-6">
    <v-img :src="event.imgUrl" height="300px"></v-img>
    <v-card-title> {{ event.name }} near {{ event.object }} </v-card-title>
    <v-card-subtitle>{{ event.time }}</v-card-subtitle>
    <v-btn class="ma-3" @click="deleteEvent(event._id)">Delete</v-btn>
  </v-card>
</template>

<script>
export default {
  props: ['event'],
  data: () => ({
    show: false,
    deleted: false,
  }),
  methods: {
    async deleteEvent(eventID) {
      let confirm = window.confirm('Are you sure you want to delete this event?')
      if (!confirm) return
      try {
        let res = await this.$axios.delete(`/api/events/${eventID}`)
        if (res.status === 200) {
          this.deleted = true
        }
      } catch(err) {
        console.error(err)
      }
    },
  },
}
</script>
<style>
