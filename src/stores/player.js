import { defineStore } from 'pinia'
//the Howl object will be used to create a new audio object. we'll use it to load the audio file and control it
import { Howl } from 'howler'
//howler will be accessible throughout the application thanks to being in this state
import helper from '@/includes/helper'

export default defineStore('player', {
  state: () => ({
    current_song: {},
    sound: {},
    seek: '00:00', //current position
    duration: '00:00',
    playerProgress: '0%'
  }),
  actions: {
    async newSong(song) {
      this.current_song = song

      this.sound = new Howl({
        src: [song.url],
        html5: true //this is neccesary for the correct execution
      })

      this.sound.play()

      this.sound.on('play', () => {
        //this will execute a function passed into it.
        //it's similar to the set interval function, except the function gets called before the next frame gets painted onto the screen.
        //it's perfect for updating the duration and seek state properties.
        requestAnimationFrame(this.progress)
      })
    },
    async toggleAudio() {
      //this will check if the function exists on the object
      //if not, it means that the Howl haven't being created
      if (!this.sound.playing) {
        return
      }

      //this will check if the audio is playing
      if (this.sound.playing()) {
        //if something is being played, it will be paused
        this.sound.pause()
      } else {
        //if not, it will be played
        this.sound.play()
      }
    },
    progress() {
      this.seek = helper.formatTime(this.sound.seek())
      this.duration = helper.formatTime(this.sound.duration())
      this.playerProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`

      //check if the sound is playing
      if (this.sound.playing()) {
        requestAnimationFrame(this.progress)
      }
    }
  },
  getters: {
    playing: (state) => {
      //is the function defined?
      if (state.sound.playing) {
        return state.sound.playing()
      }

      return false
    }
  }
})
