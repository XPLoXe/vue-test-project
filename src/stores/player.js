import { defineStore } from 'pinia'
//the Howl object will be used to create a new audio object. we'll use it to load the audio file and control it
import { Howl } from 'howler'
//howler will be accessible throughout the application thanks to being in this state

export default defineStore('player', {
  state: () => ({
    current_song: {},
    sound: {}
  }),
  actions: {
    async newSong(song) {
      this.current_song = song

      this.sound = new Howl({
        src: [song.url],
        html5: true //this is neccesary for the correct execution
      })

      this.sound.play()
    }
  }
})
