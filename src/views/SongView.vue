<template>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)"
    ></div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button
        type="button"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
      >
        <i class="fas fa-play"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song.modified_name }}</div>
        <div>{{ song.genre }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">Comments (15)</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <div
          class="text-white text-center font-bold p-4 mb-4"
          v-if="comment_show_alert"
          :class="comment_alert_variant"
        >
          {{ comment_alert_msg }}
        </div>
        <vee-form :validation-schema="schema" @submit="addComment" v-if="userLoggedIn">
          <vee-field
            name="comment"
            as="textarea"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."
          ></vee-field>
          <ErrorMessage class="text-red-600" name="comment" />
          <button
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-green-600 block"
            :disabled="comment_in_submission"
          >
            Submit
          </button>
        </vee-form>
        <!-- Sort Comments -->
        <select
          v-model="sort"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        >
          <option value="1">Latest</option>
          <option value="2">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto">
    <li
      class="p-6 bg-gray-50 border border-gray-200"
      v-for="comment in sortedComments"
      :key="comment.docID"
    >
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{ comment.name }}</div>
        <time>{{ comment.datePosted }}</time>
      </div>

      <p>
        {{ comment.content }}
      </p>
    </li>
  </ul>
</template>

<script>
import { songsCollection, auth, commentsCollection } from '@/includes/firebase'
import { mapState } from 'pinia'
import useUserStore from '@/stores/user'

export default {
  name: 'SongView',
  data() {
    return {
      song: {},
      schema: {
        comment: 'required|min:4|max:140'
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_msg: 'Please wait! Your comment is being posted',
      comments: [],
      sort: '1' //1: latest to oldest. 2: oldest to latest
    }
  },
  computed: {
    //this functionaccepts an array of state properties we'd like to map
    //we'll map the userLoggedIn state property for verifying if the user is logged in
    ...mapState(useUserStore, ['userLoggedIn']),
    sortedComments() {
      //The slice method returns a brand new array based on the old array, you can use it to extrac specific items in the array
      //the slice method will return a new array
      //whereas the sort() will directly affect the array it's called on
      //ESLint won't let us do it directly with the sort() because it will affect the array directly and computed properties aren't supposed to do that
      return this.comments.slice().sort((a, b) => {
        //descending order
        if (this.sort === '1') {
          //the date has to be converted to a string for a storage and the nconverted back to a date
          //the sort function works by sortin the objects based on the value returns
          //If the value return as positive, then A will come first in the array
          //If 0 is return, the nA and B will stay in their respective index
          //If it's positive, it will tell JavaScript to put B first in the Array
          return new Date(b.datePosted) - new Date(a.datePosted)
        }
        //comments being sorting in ascending order
        return new Date(a.datePosted) - new Date(b.datePosted)
      })
    }
  },
  async created() {
    const docSnapshot = await songsCollection.doc(this.$route.params.id).get()

    if (!docSnapshot.exists) {
      this.$router.push({ name: 'home' })
      return
    }

    this.song = docSnapshot.data()
    this.getComments()
  },
  methods: {
    async addComment(values, { resetForm }) {
      // the context object contains methods andd properties about our form. we can use it to resen the form
      this.comment_in_submission = true
      this.comment_show_alert = true
      this.comment_alert_variant = 'bg-blue-500'
      this.comment_alert_msg = 'Please wait! Your comment is being posted'
      console.log('commented')

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        //this will help us bind the song with the comment
        sid: this.$route.params.id,
        //get the name of the user
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid
      }

      //store the comment in the database
      await commentsCollection.add(comment)

      this.getComments()

      this.comment_in_submission = false
      this.comment_alert_variant = 'bg-green-500'
      this.comment_alert_msg = 'Comment added!'

      //this method will reset qhe comment form
      resetForm()
    },

    async getComments() {
      const snapshots = await commentsCollection.where('sid', '==', this.$route.params.id).get()

      //reset the array. to make sure we don't have duplicate comments
      this.comments = []

      snapshots.forEach((doc) => {
        this.comments.push({
          docID: doc.id,
          ...doc.data()
        })
      })
    }
  }
}
</script>
