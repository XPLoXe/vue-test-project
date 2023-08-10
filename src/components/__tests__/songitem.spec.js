import SongItem from '@/components/SongItem.vue'
//the RouterLinkStub component is a fake component that mimics the behavior of the router link component
//without relying on the router library
import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import { expect } from 'vitest'
//import { test } from 'vitest'

describe('SongItem.vue', () => {
  test('render song.display_name', () => {
    const song = {
      display_name: 'test'
    }

    const wrapper = shallowMount(SongItem, {
      props: {
        song
      },
      global: {
        components: {
          'router-link': RouterLinkStub
        }
      }
    })

    const compositionAuthor = wrapper.find('.text-gray-500')

    //expect(wrapper.text()).toContain(song.display_name)
    expect(compositionAuthor.text()).toBe(song.display_name)
  })

  test('render song.docIF in id attribute', () => {
    const song = {
      docID: 'abc'
    }

    const wrapper = shallowMount(SongItem, {
      props: {
        song
      },
      global: {
        components: {
          'router-link': RouterLinkStub
        }
      }
    })

    const compositionAuthor = wrapper.find('.text-gray-500')

    //the attributes function returns an object of attributes in the component.
    //we can access any of the attributes in the object by their name
    //expect(wrapper.attributes().id).toBe(`song-id-${song.docID}`)

    //the wrapper.classes() will return an array of classes
    expect(wrapper.classes()).toContain(`song-id-${song.docID}`)
  })
})
