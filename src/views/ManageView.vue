<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload" :addSong="addSong"></app-upload>
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <composition-item
              v-for="(song, index) in songs"
              :key="song.docID"
              :song="song"
              :updateSong="updateSong"
              :index="index"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            ></composition-item>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
//import useUserStore from '@/stores/user'
import AppUpload from '@/components/Upload.vue'
import CompositionItem from '@/components/CompositionItem.vue'
import { songsCollection, auth } from '@/includes/firebase'

export default {
  name: 'manage-view',
  components: {
    AppUpload,
    CompositionItem
  },

  data() {
    return {
      songs: [],
      unsavedFlag: false
    }
  },

  async created() {
    //the where() function help us filtering through the documents. (Documents are objects)
    //it will check if the UID property is equal to the ID of the current user
    const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get()
    snapshot.forEach(this.addSong)
  },
  methods: {
    updateSong(index, values) {
      this.songs[index].modified_name = values.modified_name
      this.songs[index].genre = values.genre
    },
    removeSong(index) {
      //splice will remove a song from the songs array
      this.songs.splice(index, 1)
    },

    //this function will be passed to the Upload Component
    addSong(document) {
      //extract the data from the snapshot
      const song = {
        ...document.data(),
        docID: document.id
      }
      //store it into the songs array
      this.songs.push(song)
    },
    //with this function we'll check if the user is filling a form
    updateUnsavedFlag(value) {
      this.unsavedFlag = value
    }
    //this method gives us the opportunity to stop the router from leaving the page
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next()
    } else {
      //the confirm function will create a prompt
      const leave = confirm('You have unsaved changes, Are you sure you want to leave?')
      next(leave)
    }
  }

  //one way of cancelling the upload when the user navs out.
  //it's more flexible. Calling the child's method we have more control in the order of execution
  // beforeRouteLeave(to, from, next) {
  //   //$refs is a vue component
  //   this.$refs.upload.cancelUploads()
  //   next()
  // }

  //local guard:
  //   beforeRouteEnter(to, from, next) {
  //     const store = useUserStore()
  //     if (store.userLoggedIn) {
  //       //without the next, we will be rendered into a blank page.
  //       next()
  //     } else {
  //       next({ name: 'home' })
  //     }
  //     console.log('beforeRouteEnter Guard')
  //   }
}
</script>
