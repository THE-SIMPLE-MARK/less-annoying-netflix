const NETFLIX_DOMAIN = "netflix.com";
const WATCH_PATH = "/watch/";
const watchTabs = new Set();

// blocks any verification requests when watching

async function addBlockRule(tabId) {
    try {
        await browser.declarativeNetRequest.updateSessionRules({
            addRules: [{
                id: tabId,
                priority: 1,
                action: { type: "block" },
                condition: {
                    urlFilter: "||web.prod.cloud.netflix.com/graphql",
                    resourceTypes: ["xmlhttprequest"],
                    tabIds: [tabId]
                }
            }]
        });
    } catch (error) {
        console.error(`[Network] Error adding rule for tab ${tabId}:`, error);
    }
}

async function removeBlockRule(tabId) {
    try {
        await browser.declarativeNetRequest.updateSessionRules({
            removeRuleIds: [tabId]
        });
    } catch (error) {
        console.error(`[Network] Error removing rule for tab ${tabId}:`, error);
    }
}

browser.tabs.onUpdated.addListener(async (tabId, _, tab) => {
    if (!tab.url?.includes(NETFLIX_DOMAIN) && watchTabs.has(tabId)) {
        watchTabs.delete(tabId);
        await removeBlockRule(tabId);
        return;
    }

    const isOnWatchPage = tab.url.includes(WATCH_PATH);
    const wasOnWatchPage = watchTabs.has(tabId);

    if (isOnWatchPage && !wasOnWatchPage) {
        watchTabs.add(tabId);
        await addBlockRule(tabId);
    } else if (!isOnWatchPage && wasOnWatchPage) {
        watchTabs.delete(tabId);
        await removeBlockRule(tabId);
    }
});

browser.tabs.onRemoved.addListener(async (tabId) => {
    if (watchTabs.has(tabId)) {
        watchTabs.delete(tabId);
        await removeBlockRule(tabId);
    }
});

