<template>
  <div id="home">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-img id="petcam" src="ai-petcam.png"></v-img>
        <h2>How to use</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, totam!
          Perferendis iure eaque qui voluptas.
        </p>
        <ul>
          <li>Lorem ipsum dolor sit amet.</li>
          <li>Lorem ipsum dolor sit amet.</li>
        </ul>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Reprehenderit, hic!
        </p>
        <v-btn id="btn" to="/feed">View feed</v-btn>
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
  /* centered horizontally */
  display: block;
  margin-left: auto;
  margin-right: auto;
}
h2 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 300;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
p {
  font-size: 1.5rem;
  font-weight: 300;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
ul {
  font-size: 1.5rem;
  font-weight: 300;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
li {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
#btn {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
</style>
