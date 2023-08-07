import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure
} from 'vee-validate'
//the min input will check if it's not less than that
//idem with the max
//the alphaSpaces is for alphabetic characters and spaces only
//ESLint rule doesn't allow _ for import. That's why it has to be changed
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  min_value as minVal,
  max_value as maxVal,
  confirmed,
  not_one_of as excluded
} from '@vee-validate/rules'

export default {
  //the app argument refers to the app.vue
  install(app) {
    //register both components in the component function
    app.component('VeeForm', VeeForm)
    app.component('VeeField', VeeField)
    app.component('ErrorMessage', ErrorMessage)
    //the first argument is the name of the rule
    //the second argument is a function that will perform the validation
    //since we are importing the required function from the rules package, we don't need to define the function
    //this rule will be available to every validation form
    defineRule('required', required)
    defineRule('tos', required)
    defineRule('alpha_spaces', alphaSpaces)
    defineRule('min', min)
    defineRule('max', max)
    defineRule('min_value', minVal)
    defineRule('max_value', maxVal)
    defineRule('email', email)
    defineRule('password_mismatch', confirmed)
    defineRule('excluded', excluded)
    defineRule('country_excluded', excluded)

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `the field ${ctx.field} is required.`,
          min: `The field ${ctx.field} is too short.`,
          max: `The field ${ctx.field} is too long.`,
          alpha_spaces: `The field ${ctx.field} may only contain alphabetical characters and spaces. `,
          email: `The field ${ctx.field} must be a valid email.`,
          min_value: `The field ${ctx.field} is too low.`,
          max_value: `The field ${ctx.field} is too high.`,
          excluded: `You are not allowed to use this value for the field ${ctx.field}.`,
          country_excluded: `Due to restrictions, we do not accept users from this location.`,
          password_mismatch: `The passwords don't match.`,
          tos: `You must accept the Terms of Service.`
        }
        //check if a massage for this rule exists. Otherwise we'll have a generic message
        const message = messages[ctx.rule.name] //condition
          ? messages[ctx.rule.name] //if true: assign the custom msg
          : `The field ${ctx.field} is invalid` //if false: generic msg

        return message
      },
      //these are ALL the DEFAULT behaviour.
      //this will tell vee-validate if it should validate a field on the blur event
      validateOnBlur: true,
      //it tell if it should validate a field on the change event
      validateOnChange: true,
      //the most aggressivev validation trigger, the input event is fired whenever the input changes
      validateOnInput: false,
      //this will validate the input whenever the value changes internally through the v-model directive.
      validateOnModelUpdate: true
    })
  }
}
