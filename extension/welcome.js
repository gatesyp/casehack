var email = localStorage.getItem('google_email');
if (email) {
  document.querySelector('.step-box[data-step="1"]').classList.add('completed');
  document.querySelector('.step-box[data-step="1"] span.tip').textContent = 'Signed in to ' + email;
}
var stepBtns = document.querySelectorAll('.step-box .mdl-button');
var linkHandler = Plaid.create({
  env: 'tartan',
  clientName: 'GeoHunt',
  key: 'cdcac057858a05be42e9be71860311',
  product: 'connect',
  onSuccess: function(public_token, meta) {
    sweetAlert("Congrats",
    "You have successfully added your " + meta.institution.name + " account to GeoHunt!",
    "success");
    //TODO: send public_token and email to server :)
    console.log(public_token);
  }
});
function stepBtnOnClick(e) {
  switch (parseInt(e.target.closest('.step-box').dataset.step)) {
    case 1:
      chrome.identity.getAuthToken({'interactive': true}, function(token) {
        chrome.identity.getProfileUserInfo(function(userInfo) {
          if (userInfo.email) {
            email = userInfo.email;
            localStorage.setItem('google_email', userInfo.email);
            localStorage.setItem('google_id', userInfo.id);
          }
        });
      });
      break;
    case 2:
      if (!email) {
        sweetAlert("Wait...", "Please sign in to your Google account frist so we can synchronize your data!", "error");
        return false;
      }
      linkHandler.open();
      break;
    default:
      console.log(e.target.closest('.step-box'), e.target.closest('.step-box').dataset.step);
  }
}
for (var i = 0; i < stepBtns.length; i++) {
  stepBtns[i].addEventListener("click", stepBtnOnClick, false);
}
