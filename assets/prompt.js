// 프롬프트 상자 가독성: [대괄호] 칸을 강조하고, 주아체에 모양이 없는 글자(‘ ’ ·)를 보이는 글자로 바꾼다.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.codewrap.prompt pre').forEach(function (pre) {
    var t = pre.textContent.replace(/[‘’]/g, "'").replace(/·/g, ', ');
    var esc = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    pre.innerHTML = esc.replace(/\[([^\]\n]*)\]/g, '<span class="blank">[$1]</span>');
  });
});
