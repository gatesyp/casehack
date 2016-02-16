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
    zoom: 6
  });
  var markerPITT = new google.maps.Marker({
    position: {lat: 40.444238, lng: -79.953270},
    map: map,
    title: '4200 Fifth Avenue, Pittsburgh, PA 15260'
  });
  var markerPWRU = new google.maps.Marker({
    position: {lat: 41.504520, lng: -81.609734},
    map: map,
    title: '10900 Euclid Ave, Cleveland, OH 44106'
  });
}
function adjustMap() {
  var mapHeight = window.innerHeight - document.querySelector('header').offsetHeight;
  document.querySelector('#map').style.height = mapHeight + 'px';
}
document.querySelector('a[href="#features"]').addEventListener("click", adjustMap);
var ctx = document.getElementById('catChart').getContext('2d');
document.querySelector('a[href="#interests"]').addEventListener("click", function() {
  chrome.extension.sendMessage({
    command: "interests"
  }, function(response) {
    var chartData = [];
    var table = document.createElement("table");
    table.className = 'mdl-data-table mdl-js-data-table mdl-data-table--selectable';
    var thead = document.createElement("thead");
    thead.innerHTML = '<tr><th class="mdl-data-table__cell--non-numeric">Category</th><th>Frequency</th></tr>';
    table.appendChild(thead);
    var tbody = document.createElement("tbody");
    response.results.forEach(function(item) {
      var tr = document.createElement("tr");
      tr.innerHTML = '<td class="mdl-data-table__cell--non-numeric">' + item.category + '</td><td>' + item.frequency + '</td>';
      chartData.push({
        value: item.frequency,
        label: item.category
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    var tableDom = document.querySelector('#catTable table');
    if (tableDom) table.parentNode.removeChild(tableDom);
    document.getElementById('catTable').appendChild(table);
    document.getElementById('catChart').width = 500;
    document.getElementById('catChart').height = 400;
    var catChart = new Chart(ctx).Doughnut(chartData, {
      animateRotate : true,
      animateScale: false
    });
  });
});
adjustMap();
window.onresize = function() {
  adjustMap();
}
