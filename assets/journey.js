// 고객 여정 지도의 감정 곡선: <table class="journey" data-scores="1,-1,-2,0"> 안의 <tr class="curve">를
// 단계별 점수(-2 나쁨 ~ 2 좋음)로 꺾은선 그래프로 바꾼다. 각 칸의 글은 점 옆 말풍선이 된다.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('table.journey[data-scores]').forEach(function (tb) {
    var row = tb.querySelector('tr.curve'); if (!row) return;
    var cells = Array.prototype.slice.call(row.querySelectorAll('td'));
    var scores = tb.getAttribute('data-scores').split(',').map(function (v) { return Math.max(-2, Math.min(2, parseFloat(v) || 0)); });
    var n = cells.length; if (!n) return;
    var CW = 240, H = 300, padT = 92, padB = 96;
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
      svg += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="13" fill="' + col(s) + '"/>';
      var lines = [t];
      if (t.length > 9) {  // 길면 가운데에 가까운 띄어쓰기에서 두 줄로
        var mid = t.length / 2, best = -1;
        for (var k = 0; k < t.length; k++) if (t[k] === ' ' && (best < 0 || Math.abs(k - mid) < Math.abs(best - mid))) best = k;
        if (best > 0) lines = [t.slice(0, best), t.slice(best + 1)];
      }
      var lh = 28, ty = s >= 0 ? p[1] - 24 - lh * (lines.length - 1) : p[1] + 44;
      svg += '<text text-anchor="middle" font-size="24" font-weight="700" fill="' + col(s) + '">';
      lines.forEach(function (ln, j) { svg += '<tspan x="' + p[0] + '" y="' + (ty + j * lh) + '">' + ln + '</tspan>'; });
      svg += '</text>';
    });
    svg += '</svg>';
    var td = document.createElement('td'); td.colSpan = n; td.className = 'curve-cell'; td.innerHTML = svg;
    var list = document.createElement('ul'); list.className = 'sr-only';
    cells.forEach(function (c, i) { var li = document.createElement('li'); li.textContent = (i + 1) + '단계 감정 ' + scores[i] + ': ' + c.textContent.trim(); list.appendChild(li); });
    td.appendChild(list);
    cells.forEach(function (c) { c.remove(); });
    row.appendChild(td);
    var th = row.querySelector('th'); if (th) th.innerHTML += '<span class="curve-scale"><span>좋음 ▲</span><span>나쁨 ▼</span></span>';
  });
});
