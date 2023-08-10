import { shallowMount } from '@vue/test-utils'
import Home from '@/views/HomeView.vue'
import SongItem from '@/components/SongItem.vue'

describe('HomeView.vue', () => {
  test('renders list of songs', () => {
    const songs = [{}, {}, {}]
    const component = shallowMount(Home, {
      data() {
        return {
          songs
        }
      },
      //mock
      global: {
        //allows us to define global vriables and functions
        mocks: {
          $t: (message) => message
        }
      }
    })
    //similar to the query selector
    const items = component.findAllComponents(SongItem)

    //this will check if the items array is equal to the lenght of the songs array
    expect(items).toHaveLength(songs.length)

    items.forEach((wrapper, i) => {
      //the wrapper.props() will return a component's props. we can then access any of the prompts through their name
      expect(wrapper.props().song).toStrictEqual(songs[i])
    })
  })
})
