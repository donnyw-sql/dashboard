
async function loadJSON(path) {
  const response = await fetch(path);
  return response.json();
}

async function init() {
  document.getElementById('updated').textContent =
    'Last Updated: ' + new Date().toLocaleString();

  const mlbStandings = await loadJSON('data/mlb_standings.json');
  const mlbLeaders = await loadJSON('data/mlb_leaders.json');
  const wnbaStandings = await loadJSON('data/wnba_standings.json');
  const wnbaLeaders = await loadJSON('data/wnba_leaders.json');

  renderMLBStandings(mlbStandings);
  renderMLBLeaders(mlbLeaders);
  renderWNBAStandings(wnbaStandings);
  renderWNBALeaders(wnbaLeaders);
}

function standingsTable(teams) {
  let html = '<table>';

  html += '<tr>' +
    '<th>Team</th>' +
    '<th>W</th>' +
    '<th>L</th>' +
    '<th>PCT</th>' +
    '<th>GB</th>' +
    '<th>STRK</th>' +
    '<th>L10</th>' +
    '</tr>';

  teams.forEach(team => {
    html += '<tr>' +
      '<td>' + team.team + '</td>' +
      '<td class="number">' + team.w + '</td>' +
      '<td class="number">' + team.l + '</td>' +
      '<td class="number">' + team.pct + '</td>' +
      '<td class="number">' + team.gb + '</td>' +
      '<td class="number">' + team.streak + '</td>' +
      '<td class="number">' + team.l10 + '</td>' +
      '</tr>';
  });

  html += '</table>';

  return html;
}

function renderMLBStandings(data) {
  const container = document.getElementById('mlb-standings');

  let html = '';

  ['AL', 'NL'].forEach(league => {
    html += '<h3>' +
      (league === 'AL' ? 'American League' : 'National League') +
      '</h3>';

    Object.keys(data[league]).forEach(div => {
      html += '<h4>' + div + '</h4>';
      html += standingsTable(data[league][div]);
    });
  });

  container.innerHTML = html;
}

function renderMLBLeaders(data) {
  const container = document.getElementById('mlb-leaders');

  const categories = {
    avg: 'Batting Average',
    ops: 'OPS',
    hr: 'Home Runs',
    rbi: 'RBI',
    sb: 'Stolen Bases',
    era: 'ERA',
    wins: 'Wins',
    saves: 'Saves',
    strikeouts: 'Strikeouts'
  };

  let html = '<div class="grid-2">';

  Object.keys(categories).forEach(cat => {
    html += '<div class="category-block">';
    html += '<h3>' + categories[cat] + '</h3>';

    html += '<table>';
    html += '<tr><th>AL</th><th></th><th>NL</th><th></th></tr>';

    for (let i = 0; i < 10; i++) {
      const al = data.AL[cat][i];
      const nl = data.NL[cat][i];

      html += '<tr>' +
        '<td>' + (al ? al.display + ' (' + al.team + ')' : '') + '</td>' +
        '<td class="number">' + (al ? al.value : '') + '</td>' +
        '<td>' + (nl ? nl.display + ' (' + nl.team + ')' : '') + '</td>' +
        '<td class="number">' + (nl ? nl.value : '') + '</td>' +
        '</tr>';
    }

    html += '</table>';
    html += '</div>';
  });

  html += '</div>';

  container.innerHTML = html;
}

function renderWNBAStandings(data) {
  document.getElementById('wnba-standings').innerHTML = standingsTable(data);
}

function renderWNBALeaders(data) {
  const names = {
    points: 'Points',
    rebounds: 'Rebounds',
    assists: 'Assists',
    steals: 'Steals',
    threes: '3PT Made',
    blocks: 'Blocks'
  };

  let html = '<div class="grid-2">';

  Object.keys(names).forEach(cat => {
    html += '<div class="category-block">';
    html += '<h3>' + names[cat] + '</h3>';

    html += '<table>';
    html += '<tr><th>Player</th><th>Stat</th></tr>';

    data[cat].forEach(player => {
      html += '<tr>' +
        '<td>' + player.name + ' (' + player.team + ')</td>' +
        '<td class="number">' + player.value + '</td>' +
        '</tr>';
    });

    html += '</table>';
    html += '</div>';
  });

  html += '</div>';

  document.getElementById('wnba-leaders').innerHTML = html;
}

init();
