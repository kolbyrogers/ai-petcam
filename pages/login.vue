<template>
  <div id="login">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-img src="ai-petcam.png"></v-img>
        <v-card class="elevation-12">
          <v-card-actions>
            <v-btn
              class="login-button my-2 pa-2"
              color="primary"
              width="100%"
              depressed
              large
              @click="login"
            >
              <v-icon class="mx-3">mdi-google</v-icon> Login with Google</v-btn
            >
          </v-card-actions>
          <p class="pa-5" v-for="error in errors" :key="error.id">
            {{ error }}
          </p>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errors: [],
    }
  },
  methods: {
    isValidEmail(email) {
      return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    },
    async login() {
      let that = this
      try {
        const provider = new this.$fireModule.auth.GoogleAuthProvider()
        let user = await this.$fire.auth.signInWithPopup(provider)
        if (user) {
          this.$router.push('/')
        }
      } catch (err) {
        this.errors.push(err)
      }
    },
    resetErrors() {
      this.errors = []
    },
  },
}
</script>

<style scoped></style>
