import { defineStore } from 'pinia'
import { auth, usersCollection } from '@/includes/firebase'

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false
  }),
  actions: {
    //here we can define action objects
    async register(values) {
      //this action will register the user in both the authentication and firestore services
      //the try catch will be in the RegisterForm.vue
      //by using actions, we have a reusable function for registering the user
      const userCred = await auth.createUserWithEmailAndPassword(values.email, values.password)

      //the document function allow us to select a document in a collection
      //the document function will create the document if it doesn't exists
      await usersCollection.doc(userCred.user.uid).set({
        name: values.name,
        surname: values.surname,
        email: values.email,
        age: values.age,
        country: values.country
      })

      await userCred.user.updateProfile({
        displayName: values.name
      })

      this.userLoggedIn = true
    },

    async authenticate(values) {
      //included function from firebase:
      await auth.signInWithEmailAndPassword(values.email, values.password)
      this.userLoggedIn = true
    },
    async signOut() {
      await auth.signOut()
      this.userLoggedIn = false
    }
  }
})
