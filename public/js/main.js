if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        setFooterYear();
        renderRecentPlayerSearches();
    });
} else {
    initTheme();
    setFooterYear();
    renderRecentPlayerSearches();
}
