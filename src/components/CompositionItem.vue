<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div
        class="text-white text-center font-bold p-4 mb-4"
        v-if="show_alert"
        :class="alert_variant"
      >
        {{ alert_message }}
      </div>
      <vee-form :validation-schema="schema" :initial-values="song" @submit="edit">
        <!--
            <div>
          <i v-show="edit_show_error">Error Editing</i>
          <i v-show="edit_success">Edition Successful</i>
            </div>
        -->

        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            name="modified_name"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          @click.prevent="showForm = false"
          :disabled="in_submission"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
//import { mapActions } from 'pinia'
//import useSongsStore from '@/stores/songs'
import { songsCollection, storage } from '../includes/firebase'

export default {
  name: 'CompositionItem',
  props: {
    song: {
      type: Object,
      required: true
    },
    updateSong: {
      type: Function,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    removeSong: {
      type: Function,
      required: true
    },
    updateUnsavedFlag: {
      type: Function
    }
  },
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: 'required',
        genre: 'alpha_spaces'
      },
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'Please wait! Updating song info'
    }
  },
  methods: {
    // ...mapActions(useSongsStore, {
    //   editSong: 'editSong'
    // }),

    async edit(values) {
      this.in_submission = true
      this.show_alert = true
      this.alert_variant = 'bg-true-500'
      this.alert_message = 'Please wait! Updating song info'

      //allows us to select a document by ID
      //we'll get the ID by the song passed in ManageView

      try {
        //this function will update the database song with the values of the form (because they have the same name as in the database)
        await songsCollection.doc(this.song.docID).update(values)
      } catch (error) {
        this.in_submission = false
        this.alert_variant = 'bg-red-500'
        this.alert_message = 'Something went wrong! Try again later'
        return
      }

      this.updateSong(this.index, values)
      //turn the flag off to determine that the user has finished editing
      this.updateUnsavedFlag(false)

      this.in_submission = false
      this.alert_variant = 'bg-green-500'
      this.alert_message = 'Success!'
    },

    async deleteSong() {
      //for good practice, two references will be created
      const storageRef = storage.ref()
      const songRef = storageRef.child(`songs/${this.song.original_name}`)

      //this will delete the song in the storage
      await songRef.delete()

      //this will delete the song in the collection
      await songsCollection.doc(this.song.docID).delete()

      this.removeSong(this.index)
    }

    // async edit(values){
    //     try {

    //         await this.editSong(values, this.song.uid)
    //     } catch (error) {
    //         this.edit_show_error = true
    //         return;
    //     }

    //     this.edit_success = true;
    // }
  }
}
</script>
