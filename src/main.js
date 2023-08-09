import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VeeValidatePlugin from './includes/validation'
import { auth } from './includes/firebase'
import Icon from './directives/icon'
import i18n from './includes/i18n'

import './assets/base.css'
import './assets/main.css'

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
    //register directive
    app.directive('icon', Icon)

    app.mount('#app')
  }
})
