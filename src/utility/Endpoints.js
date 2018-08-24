module.exports = {
    FETCH_APPLICATION: applicationId => `https://discordapp.com/api/oauth2/applications/${applicationId}`,
    FETCH_ASSETS: applicationId => `https://discordapp.com/api/oauth2/applications/${applicationId}/assets`,
    FETCH_ASSET: (applicationId, assetId) => `https://discordapp.com/api/oauth2/applications/${applicationId}/assets/${assetId}`,
    FETCH_LASTFM_ALBUM: (apiKey, artistName, albumName) => `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${apiKey}&artist=${artistName}&album=${albumName}&format=json`
};