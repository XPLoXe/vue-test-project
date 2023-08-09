import NProgress from 'nprogress'

//passing the router object to a function inside the file
//export an arrow function that accepts in the router object
export default (router) => {
  //before every route, we want to initialize the progress bar
  //by passing an arrow function, we can use two functions inside it.
  //before loading the next page, the NPprogress bar will start
  router.beforeEach((to, from, next) => {
    NProgress.start()
    next()
  })

  //after everything is loaded, we want the progress bar to finish
  //this will call the function NPprogress.done whenever the router finishes loading the page
  router.afterEach(NProgress.done)
}
