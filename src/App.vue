<template>
  <app-header></app-header>

  <!--router is a global component.
  It was defined when we registered the Vue Router module as a plug in-->
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in">
      <div :key="route.name">
        <!--we use the component just to load and render components dynamically
        It will render whatever component is provided by the router view component-->
        <component :is="Component"></component>
      </div>
    </transition>
  </router-view>

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

<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0.5 linear;
  opacity: 0;
}
</style>
