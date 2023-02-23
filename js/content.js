chrome.runtime.sendMessage({type: "setSiteOrgin", url: window.location.origin}, () => undefined);


chrome.runtime.onMessage.addListener(function (ev, sender, sendResponse) {
    if (ev?.command === 'IS_WOO') {
        const url = location.origin;

        fetch(url + '/wp-json/wc/store/products?page=1')
            .then(e => e.json())
            .then(function (response) {
                chrome.runtime.sendMessage({idDiv: "isWooMsg", command: 'DISPLAY_ELEMENT'}, () => undefined);
                chrome.runtime.sendMessage({url: url, command: 'IS_WOO'}, () => undefined);
                launchProductCount().then(() => undefined);
                launchCollectionCount().then(() => undefined);
            })
            .catch(function () {
                chrome.runtime.sendMessage({idDiv: "isNotWooMsg", command: 'DISPLAY_ELEMENT'}, () => undefined);
            });

        async function genericCount(url, key, onLoad) {
            let page = 1;
            let next = true;
            let count = 0;

            while (next) {
                next = false;
                try {
                    let response = await fetch(url + page).then(response => response.json())
                    if (response.length) {
                        count += response.length
                        onLoad(count)
                        next = true;
                        page++;
                    }
                } catch (e) {
                    console.log(e);
                }
            }

            return count;
        }

        async function launchProductCount() {
            return genericCount(url + '/wp-json/wc/store/products?per_page=100&attribute=id&page=', 'products', count => {
                chrome.runtime.sendMessage({count: count, command: 'PRODUCT_COUNT'}, () => undefined);
            })
        }

        async function launchCollectionCount() {
            return genericCount(url + '/wp-json/wc/store/products/categories?per_page=100&page=', 'collections', count => {
                chrome.runtime.sendMessage({count: count, command: 'COLLECTION_COUNT'}, () => undefined);
            })
        }
    }
    sendResponse({});
})

