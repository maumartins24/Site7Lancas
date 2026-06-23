export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
  ],

  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
  },

  runtimeConfig: {
    public: {
      firebaseApiKey:            process.env.FIREBASE_API_KEY             || '',
      firebaseAuthDomain:        process.env.FIREBASE_AUTH_DOMAIN         || '',
      firebaseProjectId:         process.env.FIREBASE_PROJECT_ID          || '',
      firebaseStorageBucket:     process.env.FIREBASE_STORAGE_BUCKET      || '',
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
      firebaseAppId:             process.env.FIREBASE_APP_ID              || '',
    }
  },

  app: {
    head: {
      title: 'Terreiro Ogum 7 Lanças',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
        { name: 'description', content: 'Templo Umbandista Sr. Ogum Sete Lanças e Pai João de Aruanda.' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap'
        },
      ],
    },
  },

  css: ['~/assets/css/main.css'],
})
