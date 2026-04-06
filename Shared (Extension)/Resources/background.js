const GRAPHQL_URL = "web.prod.cloud.netflix.com/graphql";
const WATCH_PATH = "/watch/";

// block any verification requests when watching

browser.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (!details.url.includes(GRAPHQL_URL)) {
            return { cancel: false };
        }

        browser.tabs.get(details.tabId).then(tab => {
            if (tab?.url?.includes(WATCH_PATH)) {
                console.log("[Network] Blocking GraphQL on /watch/");
                return { cancel: true };
            }
        });

        return { cancel: false };
    },
    { urls: ["*://*.netflix.com/*"] },
    ["blocking"]
);

