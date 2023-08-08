//the HashHistory component will use hashs in the URL, is way faster but old
//import { createRouter, createWebHashHistory } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
//the @ symbol is used to point to the source directory.
//This shortcut makes it easier to import the component
//without having to guess where we are
import Home from '@/views/HomeView.vue'
import About from '@/views/AboutView.vue'
import Manage from '@/views/ManageView.vue'
import Song from '@views/SongView.vue'
import useUserStore from '@/stores/user'

//whenever a user visits this patch, the view router will render this
//component onto the page

const routes = [
  {
    //the name can be use instead of the path
    name: 'home',
    path: '/',
    component: Home
  },
  {
    name: 'about',
    path: '/about',
    component: About
  },
  {
    name: 'manage',
    //if the user visists the /manage path, the router will render this component either way
    //this is like an additional path to the component.
    //alias: '/manage',
    path: '/manage-music',
    component: Manage,
    beforeEnter: (to, from, next) => {
      console.log('Manage Route Guard')
      next()
    },
    //meta fields:
    meta: {
      //it will require authentication since you have to be logged in to be in this page
      requiresAuth: true
    }
  },
  {
    //if we put /manage in the URL (which doesnt exist anymore) they will be
    //taken to the correct page
    path: '/manage',
    redirect: { name: 'manage' }
  },
  {
    name: 'song',
    path: 'song/:id',
    component: Song
  },
  {
    //if none of the others records matches, this will.
    //it checks this last and prioritize the others
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' }
  }
]

const router = createRouter({
  //history: createWebHashHistory(import.meta.env.BASE_URL),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500'
})

//this is available after the instance of the router is created.
//it'll allow us to add a function before every request
//we can use it to perform checks
//to: where to
//from: from where
//next: is a function which is the most important one. without it, it won't work.
router.beforeEach((to, from, next) => {
  //console.log(to.meta)

  //if the record does not have this meta field, it doesn't require authentication
  if (!to.meta.requiresAuth) {
    //the user can keep surfing
    next()
    return
  }

  //at this points, it means that the page we're trying to access needs authentication
  //so now we'll have to check if the user is logged
  //for that we need access to the store and get the credentials
  const store = useUserStore()
  if (store.userLoggedIn) {
    next()
  } else {
    next({ name: 'home' })
  }
})

export default router
