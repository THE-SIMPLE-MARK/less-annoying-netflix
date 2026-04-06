// blocks the household & "activate extra account" modals

(function () {
    if (window.netflixBypassLoaded) return;
    window.netflixBypassLoaded = true;

    const MODAL_SELECTOR = '.nf-modal.interstitial-full-screen, .nf-modal.uma-modal.two-section-uma';
    const BACKGROUND_SELECTOR = '[data-uia="nf-modal-background"]';

    function hideModal(node) {
        if (!node) return;

        if (node.matches?.(MODAL_SELECTOR)) {
            node.style.display = 'none';
            const bg = document.querySelector(BACKGROUND_SELECTOR);
            if (bg) bg.style.display = 'none';
            return;
        }

        node.querySelectorAll?.(MODAL_SELECTOR).forEach(modal => {
            modal.style.display = 'none';
        });

        const bg = node.querySelector?.(BACKGROUND_SELECTOR);
        if (bg) bg.style.display = 'none';
    }

    document.querySelectorAll(MODAL_SELECTOR).forEach(m => {
        m.style.display = 'none';
    });
    document.querySelectorAll(BACKGROUND_SELECTOR).forEach(b => {
        b.style.display = 'none';
    });

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) hideModal(node);
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

