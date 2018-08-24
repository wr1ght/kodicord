<div align="center">

    

    <h2>Kodicord</h2>

    <p align="center">

        <p>Kodi Music rich presence for Discord</p>

        <p>just for music, nothing else.</p>

        <p>Messy (and might be API abuse? meh.) but works.</p>

    </p>

</div>

 

### Contents

* Notice

* How to use

* License

------------------

Notice

This is an experimental integration and incorrect usage may be considered as Discord API abuse. If you are not comfortable entering your Discord account token into this integration then it's not for you.

By enabling the API_ABUSE setting in .env, you will be considered as abusing the Discord API and if reported you are at risk of deletion. I've asked a Discord developer regarding changing the application name programmatically every time the song name is changed and they confirmed it is indeed API abuse.

Album covers may take up to 15 seconds to update due to Discord caching. This usually is not the case.

#### How to use

In order for this to work, you must have remote connections via HTTP enabled on your XMBC/Kodi device.



 

Step One: Creating a Discord application

Go to the Discord Developer Portal and create an Application. Name it something nice, for example: "Music"

(if the API_ABUSE setting is enabled then the application name will be overridden by the current song name)

Step Two: Uploading a default album cover

You'll need to upload a default album cover for when the application cannot fetch the artwork of the album you're listening to.

Upload any image and name the asset specifically defaultcover.



 #### Step Three: Editing the configuration

Once you've uploaded your default cover, you'll need to edit .env.default with the necessary values and rename it to .env.

- URL : The link to your Kodi/XMBC HTTP dashboard. (see screenshot above)
- CLIENT_ID: Your application's client ID.
- USER_TOKEN: The token of YOUR Discord account.
- LASTFM_KEY: Your Last.FM API key. Get one at their API portal for free with no limits.
- API_ABUSE: read the Notice section

 

Step Four: Starting the integration

As of now there is no UI for this integration and it is command-line based. Good news is you only have to run the command once and it'll remain in the background.

Run npm install then npm start in your choice of terminal. (ex: command prompt)

  

Step Five: Get Banned (kidding)

No, I'm kidding. You won't be banned for simply using this integration... unless you're being edgy and using the API_ABUSE feature.

If all goes well you'll end up with a presence like this: (left = API abuse, right = no API abuse)

  





 

#### License

This repository has been released under the MIT license.

 

------------------

<p>Project maintained by Wright (wr1ght)

 

Contact me on Discord: wright#0666</p>

 
