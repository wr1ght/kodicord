<div align="center">
    <img src="https://kodi.wiki/images/thumb/4/43/Side-by-side-dark-transparent.png/300px-Side-by-side-dark-transparent.png" height="250" width="350">
    <h2>Kodicord</h2>
    <p align="center">
        <p>Kodi Music rich presence for Discord</p>
        <p>Messy (and might be API abuse? meh.) but works.</p>
    </p>
</div>

### Contents
* [How to use](#how-to-use)
* [License](#license)
------------------

#### How to use
In order for this to work, you must have remote connections via HTTP enabled on your XMBC/Kodi device.
![screenshot](https://camo.githubusercontent.com/41cbd6038ee0b2aa91b639819fb79d38db4b4e49/68747470733a2f2f692e696d6775722e636f6d2f5779496f4d776c2e6a7067)

Before continuing, you must create a Discord application at https://discordapp.com/developers (name it anything, it won't matter anyways.)

After creating the application, head over to the `Rich Presence` tab and then `Art Assets`. 

You'll need to upload a default album cover for when the application cannot fetch an album's cover. Upload any image and name the asset specifically `defaultcover`.

Once that's enabled, you'll need to edit `.env.default` with the necessary values and rename it to `.env`. (it's self explanatory)

Then, you're all set. I haven't added a fancy UI yet so for now you'll have to run the command once through the command line and let it sit in the background.

`npm install`

`npm start`

#### License
This repository has been released under the MIT license.

------------------
<p>Project maintained by Wright (wr1ght)
Contact me on Discord: wright#0666</p>
