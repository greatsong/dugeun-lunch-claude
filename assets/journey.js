// 고객 여정 지도의 감정 곡선: <table class="journey" data-scores="1,-1,-2,0"> 안의 <tr class="curve">를
// 단계별 점수(-2 나쁨 ~ 2 좋음, data-scores)와 감정 이름(data-emotions: 걱정·지침·답답함·당황·아쉬움·짜증·보통·궁금·기대·안심·기쁨·뿌듯함)으로 꺾은선 그래프를 그린다. 각 칸의 글은 점 옆 말풍선이 된다.
var JOURNEY_BASE = (document.currentScript && document.currentScript.src.replace(/journey\.js.*$/, '')) || 'assets/';
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('table.journey[data-scores]').forEach(function (tb) {
    var row = tb.querySelector('tr.curve'); if (!row) return;
    var cells = Array.prototype.slice.call(row.querySelectorAll('td'));
    var EMO = { '걱정': ['worried', -1], '지침': ['tired', -1], '답답함': ['frustrated', -1], '당황': ['confused', -1],
      '아쉬움': ['disappointed', -1], '짜증': ['annoyed', -1], '보통': ['neutral', 0], '궁금': ['curious', 0],
      '기대': ['hopeful', 1], '안심': ['relieved', 1], '기쁨': ['happy', 1], '뿌듯함': ['proud', 1] };
    var emos = (tb.getAttribute('data-emotions') || '').split(',').map(function (v) { return v.trim(); });
    var scores = tb.getAttribute('data-scores').split(',').map(function (v) { return Math.max(-2, Math.min(2, parseFloat(v) || 0)); });
    var n = cells.length; if (!n) return;
    var CW = 240, H = 330, padT = 108, padB = 112;
    var W = CW * n;
    var y = function (s) { return padT + (2 - s) / 4 * (H - padT - padB); };
    var col = function (s) { return s > 0 ? '#1d5d3d' : s < 0 ? '#b5532f' : '#365746'; };
    var esc = function (t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="감정 곡선" style="width:100%;height:auto;display:block">';
    svg += '<line x1="8" x2="' + (W - 8) + '" y1="' + y(0) + '" y2="' + y(0) + '" stroke="#c3d4c4" stroke-width="2" stroke-dasharray="7 6"/>';
    var pts = scores.slice(0, n).map(function (s, i) { return [CW * i + CW / 2, y(s)]; });
    svg += '<polyline fill="none" stroke="#1d5d3d" stroke-width="6" stroke-linejoin="round" points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '"/>';
    pts.forEach(function (p, i) {
      var s = scores[i], t = esc(cells[i].textContent.trim());
      var e = EMO[emos[i]];
      if (!e || (e[1] < 0 && s >= 0) || (e[1] > 0 && s <= 0) || (e[1] === 0 && s !== 0)) {
        console.error('감정 곡선: 감정 이름이나 점수 부호를 확인하세요', emos[i], s);
        svg += '<text x="' + p[0] + '" y="' + (p[1] + 8) + '" text-anchor="middle" font-size="22" fill="#b00">감정 확인</text>';
      } else {
        svg += '<image href="' + JOURNEY_BASE + 'emo/emo_' + e[0] + '.png" x="' + (p[0] - 30) + '" y="' + (p[1] - 30) + '" width="60" height="60"><title>' + emos[i] + '</title></image>';
      }
      var lines = [t];
      if (t.length > 9) {  // 길면 가운데에 가까운 띄어쓰기에서 두 줄로
        var mid = t.length / 2, best = -1;
        for (var k = 0; k < t.length; k++) if (t[k] === ' ' && (best < 0 || Math.abs(k - mid) < Math.abs(best - mid))) best = k;
        if (best > 0) lines = [t.slice(0, best), t.slice(best + 1)];
      }
      var lh = 28, ty = s >= 0 ? p[1] - 40 - lh * (lines.length - 1) : p[1] + 58;
      svg += '<text text-anchor="middle" font-size="24" font-weight="700" fill="' + col(s) + '">';
      lines.forEach(function (ln, j) { svg += '<tspan x="' + p[0] + '" y="' + (ty + j * lh) + '">' + ln + '</tspan>'; });
      svg += '</text>';
    });
    svg += '</svg>';
    var td = document.createElement('td'); td.colSpan = n; td.className = 'curve-cell'; td.innerHTML = svg;
    var list = document.createElement('ul'); list.className = 'sr-only';
    cells.forEach(function (c, i) { var li = document.createElement('li'); li.textContent = (i + 1) + '단계 ' + (emos[i] || '') + '(' + scores[i] + '): ' + c.textContent.trim(); list.appendChild(li); });
    td.appendChild(list);
    cells.forEach(function (c) { c.remove(); });
    row.appendChild(td);
    var th = row.querySelector('th'); if (th) th.innerHTML += '<span class="curve-scale"><span>좋음 ▲</span><span>나쁨 ▼</span></span>';
  });
});
