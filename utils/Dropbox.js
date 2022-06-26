const dropbox = require('dropbox');
const fetch = require('isomorpho')

const ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN;

const dbx = dropbox.Dropbox({ accessToken: ACCESS_TOKEN });

module.exports = dbx;