/**
 * Returns the winning player or null for a tie.
 * < 33% p1 wins, 33 - 66% p2 wins, 66 - 100 is tie
 * Let's pretend this isn't using Math.random() but instead
 * is making a call to som third party machine learning service
 * that has a testing environment we don't control
 * and is unreliable, so we want to mock it out for tests.
 */
function getWinner(player1, player2) {
  const winningNumber = Math.random()
  winningNumber //?
  return winningNumber < 1 / 3
    ? player1
    : winningNumber < 2 / 3
    ? player2
    : null
}

module.exports = { getWinner }
