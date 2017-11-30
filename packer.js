const html = require('./html');
const fs = require('fs');

const compiled = fs.readFileSync('./public/bundle.js');
const rendered = html(
    `<script type="application/javascript">${compiled}</script>`
);
fs.writeFileSync('./curriculum-vitae.html',rendered);
