window.__geo_hunt = {
  google: {
    email: localStorage.getItem('google_email'),
    id: localStorage.getItem('google_id')
  },
  plaid: {
    public_token: localStorage.getItem('plaid_public_token'),
    public_token: localStorage.getItem('plaid_public_token')
  }
}

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
      window.__geo_hunt.google.email = userInfo.email;
      window.__geo_hunt.google.id = userInfo.id;
      localStorage.setItem('google_email', userInfo.email);
      localStorage.setItem('google_id', userInfo.id);
    }
  });
});
