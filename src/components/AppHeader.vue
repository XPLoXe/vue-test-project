<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <!--with the exact-active-class the router will prioritize this class over the global class set in the configuration-->
      <!-- <router-link
        exact-active-class="no-active"
        to="/"
        class="text-white font-bold uppercase text-2xl mr-4"
      >
        Music
      </router-link> -->
      <router-link
        exact-active-class="no-active"
        :to="{ name: 'home' }"
        class="text-white font-bold uppercase text-2xl mr-4"
      >
        Music
      </router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link class="px-2 text-white" :to="{ name: 'about' }">About</router-link>
          </li>
          <li v-if="!userStore.userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal"
              >Login / Register</a
            >
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">Manage</router-link>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="signOut">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapStores } from 'pinia'
//naming convention useModalStore
import useModalStore from '@/stores/modal'
import useUserStore from '@/stores/user'

export default {
  name: 'AppHeader',
  computed: {
    //the useUserStore is the one in charge to access the DB and tell if the user is logged or not
    //spread operator
    ...mapStores(useModalStore, useUserStore)
  },
  methods: {
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen
      console.log(this.modalStore.isOpen)
    },
    signOut() {
      //we can execute actions functions directly from the store object
      this.userStore.signOut()
      //console.log(this.$route)
      //we have access to tthe components methods and properties
      //Vue will inject the router instance into every component
      //we can use it to redirect the user when he logs out
      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>
