import About from '@/views/AboutView.vue'
import { shallowMount } from '@vue/test-utils'

//allow us to group one or more tests together
describe('AboutView.vue', () => {
  test('renders inner text', () => {
    //the shallowMount will limit the component to one level of children component
    //it's useful for isolating the components and prevent false positives
    //This issue can occur if the children component contains the content we were checking for in the component we mounted
    const wrapper = shallowMount(About)

    expect(wrapper.text()).toContain('about')
  })
})
