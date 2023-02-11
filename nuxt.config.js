import colors from 'vuetify/es5/util/colors'

export default {
  axios: {
    baseURL: 'http://example.com',
    // browserBaseURL: 'http://localhost:3000',
    browserBaseURL: 'https://ai-petcam.onrender.com',
  },

  serverMiddleware: ['~/api'],
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - petcam',
    title: 'petcam',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/axios',
    '@nuxtjs/firebase',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  firebase: {
    config: {
      apiKey: 'AIzaSyDhGfBNa8jKupOlUuGPGAmVqzUW4plwkQk',
      authDomain: 'ai-petcam.firebaseapp.com',
      databaseURL: 'https://ai-petcam-default-rtdb.firebaseio.com',
      projectId: 'ai-petcam',
      storageBucket: 'ai-petcam.appspot.com',
      messagingSenderId: '920776181642',
      appId: '1:920776181642:web:ce2856a1971bf252a7aa73',
    },

    services: {
      storage: true,
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
