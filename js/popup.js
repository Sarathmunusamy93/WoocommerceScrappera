// local
// BACKEND_SCRAPE_URL = "https://127.0.0.1:8000/scrape?url=";

// prod
BACKEND_SCRAPE_URL = "https://woocommerce-scraper.com/scrape?url=";

$(document).ready(function () {
  var targetNode = document.getElementById("isWooMsg");
  var observer = new MutationObserver(function () {
    if (targetNode.style.display != "none") {
      $("#btn1").show();
      $("#btn2").show();
      $("#btn3").show();
    }
  });
  observer.observe(targetNode, { attributes: true, childList: true });

  function hideLoader() {
    $("#loading").hide();
  }

  $(window).ready(hideLoader);

  $("#export").click(function () {
    chrome.runtime.openOptionsPage();
  });
});

(function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let protocol = tabs[0].url.split(":")[0];
    if (protocol === "https" || protocol === "http") {
      chrome.tabs.sendMessage(tabs[0].id, { command: "IS_WOO" }, () => {});
    } else {
      displayElement("isNotWooMsg");
    }
  });

  function displayElement(id) {
    document.getElementById(id).style.display = "block";
  }

  function commandIsWoo(message) {
    const url = message.url,
      collectionsButton = document.getElementById("collections"),
      productsButton = document.getElementById("products");

    collectionsButton.removeAttribute("disabled");
    collectionsButton.addEventListener("click", function () {
      alert("Clicked"); //chrome.tabs.create({url: BACKEND_SCRAPE_URL + url})
    });

    productsButton.removeAttribute("disabled");
    productsButton.addEventListener("click", () => {
      alert("Clicked"); // await chrome.tabs.create({url: BACKEND_SCRAPE_URL + url})
    });
  }

  /**
   * Listen product count from content script
   *
   * @param message
   */
  function commandProductCount(message) {
    const countElement = document.getElementById("product_count");
    countElement.innerHTML = message.count;
  }

  /**
   * Listen collection count from content script
   *
   * @param message
   */
  function commandCollectionCount(message) {
    const countElement = document.getElementById("collection_count");
    countElement.innerHTML = message.count;
  }

  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    switch (message?.command) {
      case "DISPLAY_ELEMENT":
        displayElement(message?.idDiv);
        break;
      case "IS_WOO":
        commandIsWoo(message);
        break;
      case "COLLECTION_COUNT":
        commandCollectionCount(message);
        break;
      case "PRODUCT_COUNT":
        commandProductCount(message);
        break;
      default:
        break;
    }
    sendResponse({});
    return Promise.resolve("Réponse pour éviter une erreur dans la console");
  });
})();
