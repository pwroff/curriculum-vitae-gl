const info = require('../sections.json');
const sections = info.sections;
const inner = (node) => {
    if (Array.isArray(node)) {
        return `<ul><li>${node.map((n) => inner(n)).join('')}</li></ul>`;
    } else if (typeof node === 'object') {
        return `<ul>
<li><h3>${node.title}</h3></li>
${inner(node.content)}
</ul>`
    }
    return `<li>${node}</li>`
};
const main = sections.map((section) => {
    const inside = inner(section.content);

    return (`
<section>
    <h2>${section.title}</h2>
    ${inside}
</section>
`);
}).join('');

module.exports = (extra) =>
    `
<!doctype html>
<html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link href="https://fonts.googleapis.com/css?family=Cutive+Mono|Open+Sans|Orbitron|Rubik:400,900|Share+Tech+Mono|Space+Mono" rel="stylesheet">
      <title>Leonid Lazarayev - cvgl</title>
      <style>
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            font-size: 10px;
        }
        body {
            font-family: 'Open sans', monospace;
            font-size: 2rem;
            color: #333333;
        }
        h1, h2, h3 {
            font-family: 'Space Mono', monospace;
            font-weight: 400;
        }
        h2 {
            font-size: 200%;
            margin: 1rem 0;
        }
        h3 {
            font-size: 150%;
            margin-bottom: 0;
        }
        a, a:hover {
            text-decoration: none;
            color: #2244f3;
        }
        section {
            width: 95%;
            margin: auto;
            padding: 5rem 2rem;
            background-color: #fefefe;
        }
        section:nth-child(2n) {
            background-color: #ffffff;
        }
        main {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            padding: 0;
            height: 100%;
            overflow-x: hidden;
            overflow-y: scroll;
            display: none;
        }
        canvas {
            position: relative;
            z-index: 1;
        }
        li {
            padding: 0 0 1rem;
        }
        li:empty {
            padding: .2rem;
        }
        ul {
            padding: 0 0 1rem;
            margin: 0;
        }
        ul, li {
            list-style: none;
        }
        li > ul {
            padding-bottom: 3rem;
        }
       </style>
    </head>
    <body>
      <main>${main}</main>
      <script type="application/javascript" src="/public/bundle.js" ></script>
      <script type="application/javascript" >
        ${extra}
       </script>
      
    </body>
</html>
`;
