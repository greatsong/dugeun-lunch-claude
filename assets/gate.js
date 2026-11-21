// 진도 잠금: lessonNN.html의 NN이 RELEASED_LESSON보다 크면 안내만 보여 줍니다.
// 브라우저 안에서만 도는 장치라 보안이 아니라 진도 조절용입니다. 교사·연수 페이지는 잠그지 않습니다.
(function () {
  var released = (typeof window.RELEASED_LESSON === 'number') ? window.RELEASED_LESSON : 8;
  var m = location.pathname.match(/\/lesson(\d{2})\.html$/);
  if (!m || parseInt(m[1], 10) <= released) return;
  document.addEventListener('DOMContentLoaded', function () {
    var main = document.querySelector('main');
    if (!main) return;
    main.innerHTML = '<span class="eyebrow">아직 열리지 않은 차시</span><h1>' + parseInt(m[1], 10) +
      '차시는 수업 진도에 맞춰 열립니다</h1><div class="under"></div><p class="lead">지금은 ' + released +
      '차시까지 볼 수 있습니다. <a href="index.html">목차로 돌아가기</a></p>';
  });
})();
