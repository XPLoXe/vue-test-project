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
    playerProgress: '0%' //the width and lenght will accept the % unit
  }),
  actions: {
    async newSong(song) {
      if (this.sound instanceof Howl) {
        //this function will pause the current audio and delete the instance by removing it from memory
        this.sound.unload()
      }

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
    },
    updateSeek(event) {
      //there has to be a song playing
      if (!this.sound.playing) {
        return
      }

      //this will return the information about the current elements, coordinates and dimentions
      const { x, width } = event.currentTarget.getBoundingClientRect()
      //this will represent the X coordinate of the click relative to the document
      const clickX = event.clientX - x
      const percentage = clickX / width
      const seconds = this.sound.duration() * percentage
      this.sound.seek(seconds)
      //the function will temporaly pause the audio.
      //the once function will listen for an even, if the event is emitted, it'll run the callback function passed into it
      //this callback function will only run once

      //this.sound.once('seek', this.progress) //this doesn't work
      this.sound.on('seek', () => requestAnimationFrame(this.progress)) //internet answer
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
