module.exports = (extra) =>
    `
<!doctype html>
<html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>cvgl</title>
      <style>
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
       </style>
    </head>
    <body>
      <script type="application/javascript" src="/public/bundle.js" ></script>
      <script type="application/javascript" >
        ${extra}
       </script>
      
    </body>
</html>
`;
