YCritique
=========
A collaboration tool for Y Combinator applicants. The author of the application installs our Chrome extension, which transforms the static YC application into a live collaboration between the applicant and their co-founders/advisors.

Install
---------
YCritique makes use of both [Firebase](https://www.firebase.com/) (to store/sync data) and [Mailgun](https://www.mailgun.com) (to send e-mail invites). To host a private instance of YCritique, you must create (free) accounts on both of these sites.

To get started, you first must clone this repository to your local machine.

###Firebase
In Firebase, create an app and make note of its instance name. Then navigate to the `Security Rules` tab and paste the contents of `firebase/config/security-rules.json`. Then click the `Login & Auth` tab and tick the `Enable Email & Password Authentication` checkbox.

###Config.js
In `chrome/src/inject/config.js` set the following constants:
- `FBURL` => Your firebase.io instance URL. (`https://{instance}.firebaseio.com`)
- `MAILGUN_API_KEY` => Your mailgun API key. (`api:key-{etc}`)
- `MAILGUN_SERVER` => Your mailgun server. (`{server}.mailgun.org`)
- `COMMENTURL` => Server hosting the comments page. (`https://{instance}.firebaseapp.com`)

In `firebase/app/js/config.js` set the following constant:
- `FBURL` => Your firebase.io instance URL. (`https://{instance}.firebaseio.com`)

###Chrome Extension 
1. Navigate to `chrome://extensions`
2. Tick the `Developer mode` checkbox in the top right
3. Click `Load unpacked extension...`
4. Select the `chrome` folder of this repository.

###Comments Site
This can be hosted by any web server, but since we already have a firebase instance, why not use that?

First install [node.js](http://nodejs.org/).

1. `npm install -g firebase-tools` (may require sudo)
2. Navigate to the firebase folder, a la `cd firebase`
3. Configure the app to use your instance via `firebase init`
4. To push the site to production, run `firebase deploy`

Usage
---------
To share your YC application with someone, all you need to do is navigate to the [YC application page](https://apply.ycombinator.com/app/edit). You'll notice it looks a little bit different with the extension installed. 

First, create an account or login. 
When you are ready to receive some feedback on your application, scroll to the bottom of the page and click the `Share` button. Enter your colleague's e-mail address and click `Send`. This will send them an invitation to view your application. Your application will be updated in Firebase every time you click `Share` or `Save for later`.

Your colleague will receive a link that looks something like `{COMMENTURL}/#/applications/{userid}`. This is a permanent link that can be used by them even as you update your application. Only user accounts created with e-mails that you've explicitly invited through the use of the `Share` button have permission to view or comment on your application.

Current State
---------
YCritique is currently functional, but is in need of some serious polishing and styling. We plan on having this finished before the applications open up for the next YC batch.
