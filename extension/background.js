window.__geo_hunt = {
  api_root: "https://mygeohunt.com/api"
}

function postFileData(url, data, callback) {
	var encodeData = "",
		append = false;
	Object.keys(data).forEach(function(key) {
		if (!append) {
			append = true;
		} else {
			encodeData += "&";
		}
		encodeData += encodeURIComponent(key).replace(/%20/g, "+") + "=" +
			encodeURIComponent(data[key]).replace(/%20/g, "+");
	});
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			if (typeof callback == "function") callback(xmlhttp.responseText);
		}
	}
	xmlhttp.send(encodeData);
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	switch (request.command) {
    case "link":
      postFileData(window.__geo_hunt.api_root + "/link", {
        google_id: localStorage.getItem("google_id"),
        public_token: request.public_token
      }, function(data) {
        sendResponse(JSON.parse(data).result);
      });
      return true;
    case "":
      break;
  }
});

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == "install"){
    chrome.tabs.create({
      url: chrome.extension.getURL('/welcome.html')
    });
  } else if(details.reason == "update"){
    var thisVersion = chrome.runtime.getManifest().version;
    console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
  }
  chrome.identity.getProfileUserInfo(function(userInfo) {
    if (userInfo.email) {
      localStorage.setItem("google_email", userInfo.email);
      localStorage.setItem("google_id", userInfo.id);
    }
  });
});
