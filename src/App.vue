<template>
  <app-header></app-header>

  <!--router is a global component.
  It was defined when we registered the Vue Router module as a plug in-->
  <router-view></router-view>

  <!-- Player -->

  <app-player></app-player>

  <app-auth></app-auth>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppAuth from '@/components/AppAuth.vue'
import AppPlayer from '@/components/Player.vue'
import { mapWritableState } from 'pinia'
import useUserStore from '@/stores/user'
import { auth } from './includes/firebase'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppAuth,
    AppPlayer
  },
  computed: {
    //mapping the state to the component
    ...mapWritableState(useUserStore, ['userLoggedIn'])
  },
  //life cycle component
  //this will check if the user is logged in or not
  created() {
    //auth.currentUser holds information about the user currently logged in
    if (auth.currentUser) {
      this.userLoggedIn = true
    }
  }
}
</script>
