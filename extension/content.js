(function() {
  if (window.__geo_hunt) return false;
  window.__geo_hunt = true;
  function handleClick(e) {
    var selected = String(document.getSelection()),
    streetRegex = /((?:(?:\d+(?:\x20+\w+\.?)+)))(?:(?:\,\s+)|\n)?((?:[#0-9A-Za-z\-]+\x20*)+)?(?:\,\s+|\n)((?:[A-Za-z]+\x20*)+)\,\s+(A[LKSZRAP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])(?:\s+(\d{5}(?:-\d{4})?))?/,
    extracted = streetRegex.exec(selected);
    if (extracted) {
      console.log(selected, extracted);
      console.log(e);
    }
  }
  document.onmouseup = handleClick;
})();
