import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VeeValidatePlugin from './includes/validation'
import { auth } from './includes/firebase'
import Icon from './directives/icon'
import i18n from './includes/i18n'
import { registerSW } from 'virtual:pwa-register'
import GlobalComponents from './includes/_globals'
import progressBar from './includes/progress-bar'

import './assets/base.css'
import './assets/main.css'
import 'nprogress/nprogress.css'

registerSW({ immediate: true })

//this will make the router object accessible in the progress bar file
progressBar(router)

let app

//this is to prevent the user being logged out if the page is refreshed.
//this will persist the user. Firebase will help us keep track of the token
//even if the page refreshes.
auth.onAuthStateChanged(() => {
  //check if the app has already been initialized
  if (!app) {
    app = createApp(App)

    app.use(createPinia())
    app.use(router)
    app.use(VeeValidatePlugin)
    app.use(i18n)
    app.use(GlobalComponents)
    //register directive
    app.directive('icon', Icon)

    app.mount('#app')
  }
})
