export default {
  //the purpose of the helper file is to store utility functions for assisting with basic tasks
  formatTime(time) {
    //this function will round the numbers of the song's time
    const minutes = Math.floor(time / 60) || 0
    //calculate how many seconds are left over
    const seconds = Math.round(time - minutes * 60 || 0)

    //first half: display number of minutes
    //second half: display a 0 before the number if the number is less than 10
    //after the ternary operator, the seconds will be displayed
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
}
