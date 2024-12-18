function selectTeams(numberOfTeams) {
  // وقتی کاربر تعداد تیم رو انتخاب کرد میریم به teams.html و از طریق querystring تعداد تیم رو میفرستیم
  window.location.href = `teams.html?teams=${numberOfTeams}`;
}
