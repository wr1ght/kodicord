const Http = require('./Http');

class KodiRequest {
    constructor(connection) {
        this.http = new Http('http');
        this.connection = connection;
        this.defaultData = {
            id: 1,
            jsonrpc: '2.0'
        };
        this.requestURL = `${connection}/jsonrpc?request=`
    }

    async getCurrentPlayerId() {
        const payload = { ...this.defaultData, method: 'Player.GetActivePlayers' };
        const response = await this.http.getJSON({ url: `${this.requestURL}${JSON.stringify(payload)}` });
        if (!response.result || !response.result[0]) throw new Error('No active player');
        return response.result[0].playerid;
    }

    async getCurrentSong() {
        const playerId = await this.getCurrentPlayerId();
        if (playerId === null) throw new Error('Couldn\'t get playerId');

        const payload = { 
            method: 'Player.GetItem',
            params: {
                properties: ['title', 'album', 'artist', 'duration'], 
                playerid: playerId
            },
            ...this.defaultData,
        };
        const payloadTwo = {
            method: 'Player.GetProperties',
            params: {
                properties: ['time'],
                playerid: playerId
            },
            ...this.defaultData
        };

        const response = await this.http.getJSON({ url: `${this.requestURL}${JSON.stringify(payload)}` });
        if (!response.result || !response.result.item) return null;
        const responseTwo = await this.http.getJSON({ url: `${this.requestURL}${JSON.stringify(payloadTwo)}` })
        return { ...response.result.item, time: responseTwo.result.time.seconds }
    }
}

module.exports = KodiRequest;