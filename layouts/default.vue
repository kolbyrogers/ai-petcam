<template>
  <v-app dark>
    <v-navigation-drawer
      id="nav-drawer"
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list id="nav-links">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <div v-if="isAuth">
        <v-app-bar-nav-icon id="nav" @click.stop="drawer = !drawer" />
      </div>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <div v-if="isAuth">
        {{ $fire.auth.currentUser.email }}
        <v-btn color="warning" class="mx-5" @click="logout" text>Logout</v-btn>
      </div>
      <div v-else>
        <v-btn to="/login" text>Login</v-btn>
      </div>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-script-text',
          title: 'Feed',
          to: '/feed',
        },
        {
          icon: 'mdi-camera',
          title: 'Camera',
          to: '/camera',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'AI Pet Cam',
    }
  },
  methods: {
    logout() {
      console.log(this.$fire.auth)
      this.$fire.auth.signOut()
    },
  },
  computed: {
    isAuth() {
      return this.$store.state.user !== null
    },
  },
}
</script>
