function selectTeams(numberOfTeams) {
 // When the user selects the number of teams, we go to teams.html and send the number of teams via querystring
  window.location.href = `teams.html?teams=${numberOfTeams}`;
}
