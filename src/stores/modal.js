import { defineStore } from 'pinia'

//thefunction has two arguments:
//1st: is an ID for the store since it's normal to have multiple stores
export default defineStore('modal', {
  state: () => ({
    isOpen: false
  }),
  getters: {
    hiddenClass(state) {
      return !state.isOpen ? 'hidden' : ''
    }
  }
})
