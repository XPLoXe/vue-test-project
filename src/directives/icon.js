//exporting a directive
export default {
  beforeMount(el, binding) {
    //this directive will be able to output any icon
    let iconClass = `fa fa-${binding.value} text-green-400 text-xl`

    if (binding.arg === 'full') {
      iconClass = binding.value
    }
    if (binding.modifiers.right) {
      //we have to add an space before the string
      iconClass += ' float-right'
    }
    if (binding.modifiers.yellow) {
      iconClass += ' text-yellow-400'
    } else {
      iconClass += ' text-green-400'
    }

    el.innerHTML += `<i class="${iconClass}"></i>`
  }
}
