export default {
  beforeMount(el, binding) {
    //this directive will be able to output any icon
    let iconClass = `fa fa-${binding.value.icon} text-green-400 text-xl`
    if (binding.value.right) {
      //we have to add an space before the string
      iconClass += ' float-right'
    }
    el.innerHTML += `<i class="${iconClass}"></i>`
  }
}
