<div align="center">
​    <img src="https://kodi.wiki/images/thumb/4/43/Side-by-side-dark-transparent.png/300px-Side-by-side-dark-transparent.png">
​    <h2>Kodicord</h2>
​    <p align="center">
​        <p>Kodi Music rich presence for Discord</p>
​        <p>just for music, nothing else.</p>
​        <p>Messy (and might be API abuse? meh.) but works.</p>
​    </p>
</div>

### Contents

* [Notice](#notice)

* [How to use](#how-to-use)

* [License](#license)

------------------

#### Notice

This is an experimental integration and incorrect usage may be considered as Discord API abuse. If you are not comfortable entering your Discord account token into this integration then it's not for you.

By enabling the `API_ABUSE` setting in `.env`, you will be considered as abusing the Discord API and if reported you are at risk of deletion. I've asked a Discord developer regarding changing the application name programmatically every time the song name is changed and they confirmed it is indeed API abuse.

Album covers may take up to 15 seconds to update due to Discord caching. This usually is not the case.

#### How to use

In order for this to work, you must have remote connections via HTTP enabled on your XMBC/Kodi device.

![screenshot](https://camo.githubusercontent.com/41cbd6038ee0b2aa91b639819fb79d38db4b4e49/68747470733a2f2f692e696d6775722e636f6d2f5779496f4d776c2e6a7067)

 

##### Step One: Creating a Discord application

Go to the [Discord Developer Portal](https://discordapp.com/developers) and create an **Application**. Name it something nice, for example: "**Music**"

###### (*if the **API_ABUSE** setting is enabled then the application name will be overridden by the current song name*)

##### Step Two: Uploading a default album cover

You'll need to upload a default album cover for when the application cannot fetch the artwork of the album you're listening to.

Upload any image and name the asset specifically **defaultcover**.

![screenshot](https://user-images.githubusercontent.com/30602871/44582529-e4678c80-a76f-11e8-8367-5daa43772844.png)

 #### Step Three: Editing the configuration

Once you've uploaded your default cover, you'll need to edit `.env.default` with the necessary values and rename it to `.env`.

* `URL` : The link to your Kodi/XMBC HTTP dashboard. (see screenshot above)
* `CLIENT_ID`: Your application's client ID.
* `USER_TOKEN`: The token of YOUR Discord account.
* `LASTFM_KEY`: Your Last.FM API key. Get one at their [API portal](https://www.last.fm/api) for free with no limits.
* `API_ABUSE`: read the [Notice](#notice) section

 

##### Step Four: Starting the integration

As of now there is no UI for this integration and it is command-line based. Good news is you only have to run the command once and it'll remain in the background.

Run **npm install** then **npm start** in your choice of terminal. (ex: command prompt)

  

##### Step Five: Get Banned (kidding)

No, I'm kidding. You won't be banned for simply using this integration... unless you're being edgy and using the `API_ABUSE` feature.

If all goes well you'll end up with a presence like this: (left = API abuse, right = no API abuse)

 ![screenshot](https://user-images.githubusercontent.com/30602871/44511415-7c3c7c00-a685-11e8-890f-f85c48be2420.png) ![screenshot](https://user-images.githubusercontent.com/30602871/44582469-b7b37500-a76f-11e8-814a-b11143208964.png)





 

#### License

This repository has been released under the MIT license.

 

------------------

<p>Project maintained by Wright (wr1ght)

 

Contact me on Discord: wright#0666</p>

 