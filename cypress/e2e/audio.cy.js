//1- Visit home page
//2- Click on first song
//3- Play Audio
//4- Wait 5 seconds
//5- Pause audio

describe('Audio Player', () => {
  it('plays audio', () => {
    //1
    cy.visit('/')

    //2
    //if this gets mmultiple selections, it will return an array
    //composition-name is added to let cypress know where to click. It's added in the SongItem class
    cy.get('.composition-name:first').click()

    //3
    //play-btn is added to the class of the button we want to cypress to click
    cy.get('#play-btn').click()

    //4
    cy.wait(5000)

    //5
    //id added to components/Player.vue pause button
    cy.get('#player-play-btn').click()
  })
})
