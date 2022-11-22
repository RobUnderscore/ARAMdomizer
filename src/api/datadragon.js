
export const getChampions = async () => {
    const response = await fetch("http://ddragon.leagueoflegends.com/cdn/12.22.1/data/en_US/champion.json");
    const champions = await response.json();
    return champions;
}

export const getItems = async () => {
    const response = await fetch("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json");
    const items = await response.json();
    return items;
}

