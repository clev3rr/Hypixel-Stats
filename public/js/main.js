if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        setFooterYear();
        renderRecentPlayerSearches();
        renderRecentGuildSearches();
    });
} else {
    initTheme();
    setFooterYear();
    renderRecentPlayerSearches();
    renderRecentGuildSearches();
}
