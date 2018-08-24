const DiscordRPC = require('discord-rpc');
const Http = require('../modules/Http');
const KodiRequest = require('../modules/KodiRequest'); 
const Endpoints = require('../utility/Endpoints');
const encodeFromURL = require('../utility/imageEncoding');
const { logYellow, logRed, logGreen } = require('../utility/logging');
DiscordRPC.register(process.env.CLIENT_ID);

class Core {
    constructor(url) {
        this.http = new Http();
        this.kodiRequest = new KodiRequest(url);
        this.discordRPC = new DiscordRPC.Client({ transport: 'ipc' });
        this.albumCover = 'defaultcover';

        this.discordRPC.on('ready', () => {
            logGreen(`Connecting as ${process.env.CLIENT_ID}`);
            this.checkKodiStatus().catch(logRed);
            setInterval(() => this.checkKodiStatus().catch(logRed), 5000);
        });
    }

    async updateApplicationName(name) {
        this.discordRPC.clearActivity();
        await this.http.post({ put: true, url: Endpoints.FETCH_APPLICATION(process.env.CLIENT_ID), authorization: process.env.ACCOUNT_TOKEN, data: { name } });
        return process.exit()
    }

    async checkKodiStatus() {
        const song = await this.kodiRequest.getCurrentSong();
        if (!song) {
            this.discordRPC.clearActivity();
            return logRed('Failed to update status... no song playing... checking again');
        };
        if (!this.albumArtSet) {
            logYellow('Setting album art...');
            const albumArtURI = await this.getAlbumArt(song.artist[0], song.album, `${song.album}_${song.title.slice(0,2)}`);
            if (albumArtURI != 'defaultcover') this.albumCover = albumArtURI;
            return null;
        };
        if (process.env.API_ABUSE === 'true') {
            const response = await this.http.getJSON({ url: Endpoints.FETCH_APPLICATION(process.env.CLIENT_ID), authorization: process.env.ACCOUNT_TOKEN });
            if (response.name != song.title) return await this.updateApplicationName(song.title);
        } else if (!this.albumCover.includes(song.album.replace(/\W/g, '').toLowerCase())) this.albumArtSet = false;

        logYellow(`Updating status (Song: ${song.title} by ${song.artist.join(', ')})...`);
        return this.setSongStatus().catch(logRed);
    }

    async updateCover(dataURI, name) {
        const response = await this.http.getJSON({ url: Endpoints.FETCH_ASSETS(process.env.CLIENT_ID), authorization: process.env.ACCOUNT_TOKEN });
        if (response.find(asset => asset.name != 'defaultcover')) await this.http.delete({
            url: Endpoints.FETCH_ASSET(process.env.CLIENT_ID, response.find(asset => asset.name != 'defaultcover').id),
            authorization: process.env.ACCOUNT_TOKEN
        });

        return await this.http.post({
            url: Endpoints.FETCH_ASSETS(process.env.CLIENT_ID),
            authorization: process.env.ACCOUNT_TOKEN,
            data: {
                name: name || 'albumcover',
                image: dataURI,
                type: 1
            }
        });
    }

    async getAlbumArt(artistName, albumName, assetName) {
        const response = await this.http.getJSON({ url: Endpoints.FETCH_LASTFM_ALBUM(process.env.LASTFM_KEY, artistName, albumName) });
        if (response.error || response.album.image[0]['#text'].length < 1) {
            this.albumArtSet = true;
            return 'defaultcover';
        };
        let uri = await encodeFromURL(response.album.image.find(image => image.size == 'large')['#text']);
        this.albumArtSet = true;
        assetName = assetName.replace(/\W/g, '').toLowerCase();
        await this.updateCover(uri, assetName);
        return assetName;
    }

    async setSongStatus() {
        let song = await this.kodiRequest.getCurrentSong();
        if (!song) throw new Error('No active song');
        if (song.album.length < 2) song.album = song.album + '**';
        return this.discordRPC.setActivity({
            details: process.env.API_ABUSE === 'false' ? `${song.title}` : `by ${song.artist.join(', ')}`,
            state: process.env.API_ABUSE === 'false' ? `on ${song.album} (${song.artist.join(', ')})` : `on ${song.album}`,
            startTimestamp: new Date(new Date() - (song.time * 1000)),
            largeImageKey: this.albumCover,
            largeImageText: song.album,
            instance: false,
          });
    }

    async connect() {
        return this.discordRPC.login({ clientId: process.env.CLIENT_ID })
    }
}

module.exports = Core;