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
    chrome.extension.sendMessage({
			command: "link",
			public_token: public_token
		}, function(response) {
			if (response.result == 0) {
        sweetAlert("Congrats",
        "You have successfully added your " + meta.institution.name + " account to GeoHunt!",
        "success");
      } else if (response.result == 1) {
        sweetAlert("Great",
        "You just updated your " + meta.institution.name + " account transaction data!",
        "success");
      } else {
        sweetAlert("Oops",
        "An unexpected error happend when linking your accounts. Please try again later.",
        "error");
      }
		});
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
var geocoder, map;
function initialize() {
  geocoder = new google.maps.Geocoder();
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.0, lng: -77.5},
    zoom: 8
  });
}
function adjustMap() {
  var mapHeight = window.innerHeight - document.querySelector('header').offsetHeight;
  document.querySelector('#map').style.height = mapHeight + 'px';
}
document.querySelector('a[href="#features"]').addEventListener("click", adjustMap);
adjustMap();
window.onresize = function() {
  adjustMap();
}
