var siteOrgin;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type == "setSiteOrgin") {
    siteOrgin = request.url;
  }
  if (request.type == "getSiteOrgin") {
    sendResponse({ origin: siteOrgin });
  }
});
