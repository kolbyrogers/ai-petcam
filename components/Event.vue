<template>
  <v-card class="mx-auto my-6">
    <v-img :src="event.imgUrl" height="300px"></v-img>
    <v-card-title> {{ event.name }} at the {{ event.object }} </v-card-title>
    <v-card-subtitle>{{ event.time }}</v-card-subtitle>
  </v-card>
</template>

<script>
export default {
  props: ['event'],
  data: () => ({
    show: false,
  }),
}
</script>
<style>
