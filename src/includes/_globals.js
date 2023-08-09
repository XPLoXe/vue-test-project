//importing the whole object is too performance consuming, that's why we should only evoke what we need
//import _ from 'lodash'
//https://lodash.com/
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

export default {
  install(app) {
    //this is available in all JS files.
    //it's an object of information related to the current module
    //vite extends this function by adding a function called glob()
    //glob imports files, it will lazy load a module
    const baseComponents = import.meta.glob('../components/base/*.vue', {
      //this will force the function to load the modules immediately
      eager: true
    })

    //this function will convert each property of an objecti into an array.
    //where the first item in the array constains the key and the second item contains the value
    Object.entries(baseComponents).forEach(([path, module]) => {
      //the first item in the array will have the file path,
      //whereas the module item will store the component data

      //the upperFirst() will capitalize the first character in the string
      //the camelCase() will camel case a string.
      //since we need it in pascal case, we need both.
      //the split() will break the string into an array
      //the pop() will grab the last item
      const componentName = upperFirst(
        camelCase(
          path
            .split('/')
            .pop()
            .replace(/\.\w+$/, '')
        )
      )
      //componentName will remove the entire path and leave us just with the component
      //example: path: ../components/base/Button.vue  -- componentName: Button

      //the 'Base' is just a prefix to use as a good practice
      //export default
      app.component(`Base${componentName}`, module.default)
    })
  }
}
