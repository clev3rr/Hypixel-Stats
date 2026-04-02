const navHypixelStats = document.getElementById('navHypixelStats');
const navChangeLog = document.getElementById('navChangeLog');
const navContactUs = document.getElementById('navContactUs');
const navFaq = document.getElementById('navFaq');

function setActiveTopNav(target) {
    if (navHypixelStats) {
        navHypixelStats.classList.toggle('nav-link-active', target === 'hypixel');
    }
    if (navChangeLog) {
        navChangeLog.classList.toggle('nav-link-active', target === 'changelog');
    }
    if (navContactUs) {
        navContactUs.classList.toggle('nav-link-active', target === 'contact');
    }
    if (navFaq) {
        navFaq.classList.toggle('nav-link-active', target === 'faq');
    }
}

function setActiveSubnav(target) {
    const playerLink = document.getElementById('subnavPlayerStats');
    const comparatorLink = document.getElementById('subnavComparator');
    const guildLink = document.getElementById('subnavGuildStats');
    if (!playerLink || !comparatorLink || !guildLink) return;

    playerLink.classList.toggle('subnav-link-active', target === 'player');
    comparatorLink.classList.toggle('subnav-link-active', target === 'comparator');
    guildLink.classList.toggle('subnav-link-active', target === 'guild');
    setActiveTopNav('hypixel');
}

function hidePages(pages) {
    for (const id of pages) {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    }
}

function showPage(pageId) {
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.remove('hidden');
        page.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

if (navHypixelStats) {
    navHypixelStats.addEventListener('click', (event) => {
        event.preventDefault();
        hidePages([
            'guildSearchPage',
            'guildStatsPage',
            'comparatorPage',
            'comparatorResultsPage',
            'resultsPage',
            'changeLogPage',
            'contactUsPage',
            'faqPage',
            'privacyPolicyPage'
        ]);
        showPage('searchPage');
        setActiveSubnav('player');
    });
}

function goToChangeLog() {
    hidePages([
        'searchPage',
        'guildSearchPage',
        'guildStatsPage',
        'resultsPage',
        'comparatorPage',
        'comparatorResultsPage',
        'contactUsPage',
        'faqPage',
        'privacyPolicyPage'
    ]);
    showPage('changeLogPage');
    setActiveTopNav('changelog');
}

function goToContactUs() {
    hidePages([
        'searchPage',
        'guildSearchPage',
        'guildStatsPage',
        'resultsPage',
        'comparatorPage',
        'comparatorResultsPage',
        'changeLogPage',
        'faqPage',
        'privacyPolicyPage'
    ]);
    showPage('contactUsPage');
    setActiveTopNav('contact');
}

function goToFaq() {
    hidePages([
        'searchPage',
        'guildSearchPage',
        'guildStatsPage',
        'resultsPage',
        'comparatorPage',
        'comparatorResultsPage',
        'changeLogPage',
        'contactUsPage',
        'privacyPolicyPage'
    ]);
    showPage('faqPage');
    setActiveTopNav('faq');
}

function goToPrivacyPolicy() {
    hidePages([
        'searchPage',
        'guildSearchPage',
        'guildStatsPage',
        'resultsPage',
        'comparatorPage',
        'comparatorResultsPage',
        'changeLogPage',
        'contactUsPage',
        'faqPage'
    ]);
    showPage('privacyPolicyPage');
    setActiveTopNav('legal');
}

function goToGuildSearch() {
    hidePages([
        'guildStatsPage',
        'resultsPage',
        'searchPage',
        'comparatorPage',
        'comparatorResultsPage',
        'changeLogPage',
        'contactUsPage',
        'faqPage',
        'privacyPolicyPage'
    ]);
    showPage('guildSearchPage');
    setActiveSubnav('guild');
}

function goToPlayerSearch() {
    hidePages([
        'guildSearchPage',
        'guildStatsPage',
        'resultsPage',
        'comparatorPage',
        'comparatorResultsPage',
        'changeLogPage',
        'contactUsPage',
        'faqPage',
        'privacyPolicyPage'
    ]);
    showPage('searchPage');
    setActiveSubnav('player');
}

function goToComparatorSearch() {
    hidePages([
        'guildSearchPage',
        'guildStatsPage',
        'resultsPage',
        'searchPage',
        'comparatorResultsPage',
        'changeLogPage',
        'contactUsPage',
        'faqPage',
        'privacyPolicyPage'
    ]);
    showPage('comparatorPage');
    setActiveSubnav('comparator');
}

function goBack() {
    hidePages([
        'resultsPage',
        'guildSearchPage',
        'guildStatsPage',
        'comparatorPage',
        'comparatorResultsPage',
        'changeLogPage',
        'contactUsPage',
        'faqPage',
        'privacyPolicyPage'
    ]);
    const searchPage = document.getElementById('searchPage');
    if (searchPage) searchPage.classList.remove('hidden');

    const usernameInput = document.getElementById('usernameInput');
    if (usernameInput) usernameInput.value = '';
    setActiveSubnav('player');
}
