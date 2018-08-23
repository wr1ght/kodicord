require('dotenv').config();

const Kodi = require('kodi-rpc'); 
const DiscordRPC = require('discord-rpc');
const superagent = require('superagent');
const dataURI = require('image-data-uri');

DiscordRPC.register(process.env.CLIENT_ID);

class Kodicord {
    constructor(url, port) {
        this.connection = new Kodi(url, port);
        this.discordRPC = new DiscordRPC.Client({ transport: 'ipc' });
        this.cover = 'defaultcover';

        this.discordRPC.on('ready', () => {
            console.log(`Connecting as ${process.env.CLIENT_ID}`);

            this.interval = setInterval(async () => {
                let songData = await this.getCurrentSong();
                if (!songData.song) {
                    this.discordRPC.clearActivity();
                    return console.log('Failed to update status... no song playing... checking again');
                };
                if (!this.artSet) {
                    console.log('Setting album art...');
                    const albumArtURI = await this.getAlbumArt(songData.song.artist[0], songData.song.album);
                    if (albumArtURI != 'defaultcover') this.cover = albumArtURI;
                    return;
                };

                const discordResponse = await superagent.get(`https://discordapp.com/api/oauth2/applications/${process.env.CLIENT_ID}`).set('Authorization', process.env.USER_TOKEN);
                if (discordResponse.body.name != songData.song.title) {
                    this.discordRPC.clearActivity();
                    await superagent.put(`https://discordapp.com/api/oauth2/applications/${process.env.CLIENT_ID}`)
                        .set('Content-Type', 'application/json')
                        .set('Authorization', process.env.USER_TOKEN)
                        .send({ name: songData.song.title });
                    return process.exit()
                };

                console.log(`Updating status (Song: ${songData.song.title} by ${songData.song.artist.join(', ')})...`);
                this.setSongStatus();
            }, 5e3);
        });
    }

    async getPlayerID() {
        let response = await this.connection.Player.GetActivePlayers();
        if (!response.result[0] || response.result[0].type !== 'audio') return;
        return response.result[0].playerid;
    }

    async updateCover(dataURI, name) {
        const response = await superagent.get(`https://discordapp.com/api/oauth2/applications/${process.env.CLIENT_ID}/assets`);
        if (response.body.find(asset => asset.name != 'defaultcover')) await superagent.delete(`https://discordapp.com/api/oauth2/applications/${process.env.CLIENT_ID}/assets/${response.body.find(asset => asset.name != 'defaultcover').id}`).set('Authorization', process.env.USER_TOKEN);
        
        return await superagent.post(`https://discordapp.com/api/oauth2/applications/${process.env.CLIENT_ID}/assets`).send({
            name: name || 'defaultcover',
            image: dataURI,
            type: 1
        }).set('Authorization', process.env.USER_TOKEN);
    }

    async getAlbumArt(artist, albumName) {
        const response = await superagent.get(`http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${process.env.LASTFM_KEY}&artist=${artist}&album=${albumName}&format=json`)
            .set('Authorization', process.env.USER_TOKEN);
        
        if (response.body.error || response.body.album.image[0]['#text'].length < 1) {
            this.artSet = true;
            return 'defaultcover';
        }

        let artworkURL = response.body.album.image.find(image => image.size == 'large')['#text'];
        let uri = await dataURI.encodeFromURL(artworkURL);
        this.artSet = true;
        let assetName = response.body.album.artist.replace(/\W/g, '').toLowerCase();
        this.updateCover(uri, assetName);
        return assetName;
    }

    async getCurrentSong() {
        let playerID = await this.getPlayerID();
        if (typeof playerID != 'number') return new Error('No active player');
        let response = await this.connection.Player.GetItem({
            properties: ["title", "album", "artist", "duration", "thumbnail", "file", "fanart", "streamdetails"], 
            playerid: playerID
        });
        let response2 = await this.connection.Player.GetProperties({ playerid: playerID, properties: ['time'] });

        return { song: response.result.item, time: response2.result.time.seconds }
    }

    async setSongStatus() {
        let songData = await this.getCurrentSong();
        if (!songData.song) return new Error('No active song');
        if (songData.song.album.length < 2) songData.song.album = songData.song.album + '**';
        this.discordRPC.setActivity({
            details: `by ${songData.song.artist.join(', ')}`,
            state: `on ${songData.song.album}`,
            startTimestamp: new Date(new Date() - (songData.time * 1000)),
            largeImageKey: this.cover,
            largeImageText: songData.song.album,
            instance: false,
          });
    }

    async connect() {
        this.discordRPC.login({ clientId: process.env.CLIENT_ID }).catch(console.error);
    }
}

module.exports = Kodicord