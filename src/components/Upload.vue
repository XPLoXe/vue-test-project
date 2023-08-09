<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <!--normal file upload-->
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i>
          {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from '@/includes/firebase'

export default {
  name: 'uploadApp',
  data() {
    return {
      is_dragover: false,
      uploads: []
    }
  },
  props: {
    addSong: {
      type: Function
    }
  },
  methods: {
    upload($event) {
      this.is_dragover = false

      //convert an object into an array:
      const files = $event.dataTransfer
        ? //it will check if the $event.dataTransfer object is present
          //if it is, it means it's a drag and drop and will procede to spread the object
          [...$event.dataTransfer.files] //we're spreading the object properties into an array
        : //if not, it means that the $event is a change event and we have to spread it differently
          [...$event.target.files]

      files.forEach((file) => {
        //check what kind of file is
        if (file.type !== 'audio/mpeg') {
          //this will end the current iteration of the loop
          return
        }

        //check if the user is online
        if (!navigator.onLine) {
          this.uploads.push({
            task: {},
            current_progress: 100,
            name: file.name,
            variant: 'bg-red-400',
            icon: 'fas fa-times',
            text_class: 'text-red-400'
          })
          return
        }

        //this represents the path to the bucket URL
        //firebase will now know where to upload the file.
        const storageRef = storage.ref()
        //'music-f8b43.appspot.com'
        //the child will create a path relative to the parent reference
        const songsRef = storageRef.child(`songs/${file.name}`)
        //music-f8b43.appspot.com/songs/example.mp3
        //it's good practice to have a root refenrence and an additional reference to each file we plan to upload

        //the function will return a state
        const task = songsRef.put(file)

        const uploadIndex =
          this.uploads.push({
            task,
            current_progress: 0,
            name: file.name,
            variant: 'bg-blue-400', //initial class we use. we'll be changed when the file uploads
            icon: 'fas fa-spinner fa-spin', //awesome fonts
            text_class: '' //color change to see the result of the upload
          }) - 1

        task.on(
          'state_changed',
          (snapshot) => {
            //calculation to know how much was uploaded so far
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            this.uploads[uploadIndex].current_progress = progress
          },
          (error) => {
            //msg in case of error
            this.uploads[uploadIndex].variant = 'bg-red-400'
            this.uploads[uploadIndex].icon = 'fas fa-times' //awesome icon
            this.uploads[uploadIndex].text_class = 'text-red-400'
            console.log(error)
          },
          async () => {
            //extra information about the uploaded song
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: '',
              comment_count: 0
            }

            //function that will return the public URL
            //we'll add that in a new property of song (with song.url)
            song.url = await task.snapshot.ref.getDownloadURL()

            //this will return a document reference not a snapshot
            const songRef = await songsCollection.add(song)
            const songSnapshot = await songRef.get()

            this.addSong(songSnapshot)
            //msg in case of success
            this.uploads[uploadIndex].variant = 'bg-green-400'
            this.uploads[uploadIndex].icon = 'fas fa-check' //awesome icon
            this.uploads[uploadIndex].text_class = 'text-green-400'
          }
        )
      })
      console.log(files)
    }
  },
  //another way of cancelling uploads when naving out.
  cancelUplodas() {
    this.uploads.forEach((upload) => {
      upload.task.cancel()
    })
  },

  //cancel the upload before the component is unmounted
  //this is for the cases when we leave the page mid upload
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.task.cancel()
    })
  }
}
</script>
