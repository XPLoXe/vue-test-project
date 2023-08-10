import { setActivePinia, createPinia } from 'pinia'
import useUserStore from '@/stores/user'

//allows us to mock a dependencie
//the first argument is what to mock and the second is the replacement
vi.mock('@/includes/firebase', () => ({
  auth: {
    signInWithEmailAndPassword: () => Promise.resolve()
  }
}))

describe('stores', () => {
  //check the default state
  beforeEach(() => {
    //pinia instance for testing
    setActivePinia(createPinia())
  })

  //check the state after the action has been called
  test('authenticates user', async () => {
    const store = useUserStore()

    //the not will reverse the behavior of the function chained after ii
    expect(store.userLoggedIn).not.toBe(true)
    //the authenticate function will call the Firebase, we need to mock that with vi.mock
    await store.authenticate({})
    expect(store.userLoggedIn).toBe(true)
  })
})
