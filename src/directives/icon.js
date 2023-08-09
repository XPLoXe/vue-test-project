//exporting a directive
export default {
  beforeMount(el, binding) {
    //this directive will be able to output any icon
    let iconClass = `fa fa-${binding.value} float-right text-green-400 text-xl`

    if (binding.arg === 'full') {
      iconClass = binding.value
    }

    el.innerHTML += `<i class="${iconClass}"></i>`
  }
}
