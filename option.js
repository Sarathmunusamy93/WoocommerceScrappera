$(document).ready(function () {
  $("#cover-spin").hide();
  //   $("#doScrap").click(function () {
  chrome.runtime.sendMessage({ type: "getSiteOrgin" }, (response) => {
    targetOrgin = response.origin;

    $("#cover-spin").show();
    FetchItems();
  });

  $("#dwnexcel").on("click", function () {
    var fileTitle = targetOrgin + ".csv";

    $("#table").tableHTMLExport({ type: "csv", filename: fileTitle });
  });
});

var targetOrgin;
var currentPage = 1,
  itemCount = 1;

function FetchItems() {
  var URL =
    targetOrgin + "/wp-json/wc/store/products?per_page=100&page=" + currentPage;

  fetch(URL)
    .then((e) => e.json())
    .then(function (response) {
      if (response.length > 0) {
        appendResultToTable(response);
        currentPage += 1;
        FetchItems();
      } else {
        hideLoader();
      }
    })
    .catch(function () {
      chrome.runtime.sendMessage(
        { idDiv: "isNotWooMsg", command: "DISPLAY_ELEMENT" },
        () => undefined
      );
    });
}

function hideLoader() {
  $("#cover-spin").hide();
}

function appendResultToTable(results) {
  for (let index = 0; index < results.length; index++) {
    if (index == 0) {
    } else {
      const curentResult = results[index];

      var price =
        curentResult.prices.currency_symbol + curentResult.prices.price;

      var newRow =
        "<tr> <td>" +
        itemCount +
        "</td> <td>" +
        getItemFromObject(curentResult.categories, "category") +
        "</td> <td>" +
        curentResult.name +
        "</td><td>" +
        getItemFromObject(curentResult.images, "img") +
        "</td><td>" +
        price +
        "</td><td>" +
        curentResult.description +
        "</td><td>";
      itemCount += 1;
      $("#table tr:last").after(newRow);
    }
  }
}

function getItemFromObject(item, name) {
  var output = "";

  for (let index = 0; index < item.length; index++) {
    if (name == "category") {
      output += item[index].name + " , ";
    } else if (name == "img") {
      output += item[index].src + " , ";
    }
  }

  return output;
}
