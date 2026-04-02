async function openGuildStatsByName(guildName) {
    const name = String(guildName || '').trim();
    if (!name) return;

    const guildInput = document.getElementById('guildInput');
    if (guildInput) guildInput.value = name;

    goToGuildSearch();
    await getGuildStats();
}

async function openPlayerStatsByName(playerName) {
    const name = String(playerName || '').trim();
    if (!name) return;

    const usernameInput = document.getElementById('usernameInput');
    if (usernameInput) usernameInput.value = name;

    goToPlayerSearch();
    await getStats();
}

async function getGuildStats() {
    const guildInput = document.getElementById('guildInput');
    const guildError = document.getElementById('guildError');
    const loading = document.getElementById('loading');
    const query = guildInput.value.trim();

    if (!query) {
        guildError.innerText = 'Please enter a guild name or player name';
        guildError.classList.remove('hidden');
        return;
    }

    guildError.classList.add('hidden');
    loading.classList.remove('hidden');

    try {
        const data = await fetchApiJson(`/api/guild/${encodeURIComponent(query)}`, 'Guild not found');
        displayGuildStats(data.guild, query);
    } catch (error) {
        guildError.innerText = error.message || 'Guild not found. Please try again.';
        guildError.classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
    }
}

function mapHypixelColorToHex(rawColor) {
    const value = String(rawColor || '').trim();
    if (!value) return null;

    const clean = value.replace(/^§/i, '').replace(/^&/i, '').toUpperCase();
    const colorMap = {
        BLACK: '#000000',
        DARK_BLUE: '#0000AA',
        DARK_GREEN: '#00AA00',
        DARK_AQUA: '#00AAAA',
        DARK_RED: '#AA0000',
        DARK_PURPLE: '#AA00AA',
        GOLD: '#FFAA00',
        GRAY: '#AAAAAA',
        GREY: '#AAAAAA',
        DARK_GRAY: '#555555',
        DARK_GREY: '#555555',
        BLUE: '#5555FF',
        GREEN: '#55FF55',
        AQUA: '#55FFFF',
        RED: '#FF5555',
        LIGHT_PURPLE: '#FF55FF',
        YELLOW: '#FFFF55',
        WHITE: '#FFFFFF',
        0: '#000000',
        1: '#0000AA',
        2: '#00AA00',
        3: '#00AAAA',
        4: '#AA0000',
        5: '#AA00AA',
        6: '#FFAA00',
        7: '#AAAAAA',
        8: '#555555',
        9: '#5555FF',
        A: '#55FF55',
        B: '#55FFFF',
        C: '#FF5555',
        D: '#FF55FF',
        E: '#FFFF55',
        F: '#FFFFFF'
    };

    return colorMap[clean] || null;
}

function displayGuildStats(guildData, sourceQuery = '') {
    const toNumber = (value) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    };

    const formatDateOnly = (value) => {
        const ms = Number(value);
        if (!Number.isFinite(ms) || ms <= 0) return '-';

        const date = new Date(ms);
        if (Number.isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('en-US');
    };

    const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const rankBreakdown = (guildData && typeof guildData.rankBreakdown === 'object') ? guildData.rankBreakdown : {};
    const rankEntries = Object.entries(rankBreakdown);

    const leaders = rankEntries
        .filter(([rankName]) => /master|owner|leader|chief/i.test(String(rankName || '')))
        .reduce((sum, [, count]) => sum + toNumber(count), 0);

    const officers = rankEntries
        .filter(([rankName]) => /officer|executive|moderator|manager|director|директор/i.test(String(rankName || '')))
        .reduce((sum, [, count]) => sum + toNumber(count), 0);

    const members = Math.max(0, toNumber(guildData.members) - leaders - officers);

    const resolvedByText = guildData.resolvedBy === 'player_name'
        ? `Found by player name: ${sourceQuery}`
        : `Found by guild name: ${guildData.name || sourceQuery}`;

    document.getElementById('guildStatsName').innerText = guildData.name || 'Unknown Guild';
    document.getElementById('guildResolvedBy').innerText = resolvedByText;

    const guildTagEl = document.getElementById('guildStatsTag');
    if (guildData.tag) {
        const tagHex = mapHypixelColorToHex(guildData.tagColor);
        guildTagEl.innerText = `[${guildData.tag}]`;
        guildTagEl.style.color = tagHex || '';
        guildTagEl.style.fontWeight = '700';
    } else {
        guildTagEl.innerText = '-';
        guildTagEl.style.color = '';
        guildTagEl.style.fontWeight = '';
    }
    const guildLevel = toNumber(guildData.level);
    const guildLevelFormatted = Number.isInteger(guildLevel)
        ? guildLevel.toLocaleString('en-US')
        : guildLevel.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('guildStatsLevel').innerText = guildLevelFormatted;
    document.getElementById('guildStatsMembers').innerText = toNumber(guildData.members).toLocaleString('en-US');
    document.getElementById('guildStatsCoins').innerText = toNumber(guildData.coins).toLocaleString('en-US');
    document.getElementById('guildStatsExp').innerText = toNumber(guildData.exp).toLocaleString('en-US');
    document.getElementById('guildStatsLegacy').innerText = toNumber(guildData.legacyRanking) > 0
        ? toNumber(guildData.legacyRanking).toLocaleString('en-US')
        : '-';
    document.getElementById('guildStatsCreated').innerText = formatDateOnly(guildData.created);
    document.getElementById('guildStatsDesc').innerText = guildData.description || 'No description';
    document.getElementById('guildStatsJoinable').innerText = typeof guildData.publiclyJoinable === 'boolean'
        ? (guildData.publiclyJoinable ? 'Yes' : 'No')
        : '-';

    const totalWins = toNumber(guildData.wins);
    document.getElementById('guildWinsTotal').innerText = totalWins.toLocaleString('en-US');

    const winsPositionEl = document.getElementById('guildWinsPosition');
    const ranking = toNumber(guildData.legacyRanking);
    winsPositionEl.innerText = ranking > 0 ? `#${ranking.toLocaleString('en-US')}` : 'Over 20,000';

    document.getElementById('guildLeadersCount').innerText = leaders.toLocaleString('en-US');
    document.getElementById('guildOfficersCount').innerText = officers.toLocaleString('en-US');
    document.getElementById('guildMembersCount').innerText = members.toLocaleString('en-US');

    const membersTableBody = document.getElementById('guildMembersTableBody');
    membersTableBody.innerHTML = '';

    const membersList = Array.isArray(guildData.membersList) ? guildData.membersList : [];
    const getGuildRankPriority = (rankText) => {
        const normalized = String(rankText || '').toLowerCase().trim();

        if (/master|owner|leader|chief|гилд.?мастер|глава/.test(normalized)) return 0;
        if (/officer|executive|moderator|manager|director|директор|офицер/.test(normalized)) return 1;
        return 2;
    };

    const sortedMembers = [...membersList].sort((left, right) => {
        const priorityDiff = getGuildRankPriority(left.rank) - getGuildRankPriority(right.rank);
        if (priorityDiff !== 0) return priorityDiff;

        const rankNameDiff = String(left.rank || '').localeCompare(String(right.rank || ''), 'ru', { sensitivity: 'base' });
        if (rankNameDiff !== 0) return rankNameDiff;

        return String(left.username || '').localeCompare(String(right.username || ''), 'en', { sensitivity: 'base' });
    });

    if (sortedMembers.length === 0) {
        membersTableBody.innerHTML = '<tr><td colspan="5">No members found</td></tr>';
    } else {
        membersTableBody.innerHTML = sortedMembers.map(member => {
            const safeName = escapeHtml(member.username || 'Unknown');
            const safeRank = escapeHtml(member.rank || 'Member');
            const avatar = member.avatar || `https://mc-heads.net/head/${encodeURIComponent(member.uuid || safeName)}/36`;
            const rankPrefixHtml = String(member.rankHtml || '').trim();
            const nameColor = member.rankColor ? ` style="color: ${escapeHtml(member.rankColor)};"` : '';
            const prefixColor = member.rankColor ? ` style="color: ${escapeHtml(member.rankColor)};"` : '';
            const playerNameRaw = String(member.username || '').trim();
            const playerNameJson = JSON.stringify(playerNameRaw);

            const renderedName = rankPrefixHtml
                ? `<div class="guild-member-name-cell"><span class="guild-member-rank-prefix"${prefixColor}>${rankPrefixHtml}</span> <span class="guild-member-username"${nameColor}>${safeName}</span></div>`
                : `<div class="guild-member-name-cell"><span class="guild-member-username guild-member-username-muted">${safeName}</span></div>`;

            const clickableName = playerNameRaw
                ? `<a href="#searchPage" class="guild-member-link" onclick='openPlayerStatsByName(${playerNameJson}); return false;'>${renderedName}</a>`
                : renderedName;

            return `
                <tr>
                    <td><img class="guild-member-avatar" src="${avatar}" alt="${safeName}"></td>
                    <td class="guild-member-name">${clickableName}</td>
                    <td>${safeRank}</td>
                    <td>${formatDateOnly(member.joined)}</td>
                    <td>${formatDateOnly(member.lastLogin)}</td>
                </tr>
            `;
        }).join('');
    }

    const guildSearchPage = document.getElementById('guildSearchPage');
    const guildStatsPage = document.getElementById('guildStatsPage');
    const resultsPage = document.getElementById('resultsPage');
    const searchPage = document.getElementById('searchPage');

    if (guildSearchPage) guildSearchPage.classList.add('hidden');
    if (resultsPage) resultsPage.classList.add('hidden');
    if (searchPage) searchPage.classList.add('hidden');

    if (guildStatsPage) {
        guildStatsPage.classList.remove('hidden');
        guildStatsPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setActiveSubnav('guild');
}
