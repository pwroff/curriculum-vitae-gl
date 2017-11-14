const {Server} = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const html = require('./html');
const fs = require('fs');

const app = express();
const server = Server(app);
const {PORT: envPort, NODE_ENV: ENV} = process.env;
const PORT = envPort || 4123;
const publicPath = '/public';
const isDevelopment = true;

app.enable('trust proxy');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(publicPath, express.static(publicPath.replace('/', '')));
app.locals.settings['x-powered-by'] = false;

if (isDevelopment) {
    const webpack = require('webpack');
    const webpackConfig = require('./webpack.config');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const compiler = webpack(webpackConfig);
    const io = require('socket.io')(server);
    const wdm = new webpackDevMiddleware(compiler, {
        publicPath,
        reporter: (reporterOptions) => {
            const state = reporterOptions.state;
            const stats = reporterOptions.stats;
            const options = reporterOptions.options;

            if (state) {
                let displayStats = (!options.quiet && options.stats !== false);
                if (displayStats && !(stats.hasErrors() || stats.hasWarnings()) &&
                    options.noInfo) {
                    displayStats = false;
                }
                if (displayStats) {
                    options.log(stats.toString(options.stats));
                }
                if (!options.noInfo && !options.quiet) {
                    let msg = 'Compiled successfully.';
                    if (stats.hasErrors()) {
                        msg = 'Failed to compile.';
                    } else if (stats.hasWarnings()) {
                        msg = 'Compiled with warnings.';
                    }
                    options.log(`webpack: ${msg}`);
                }
            } else {
                options.log('webpack: Compiling...');
            }
            if (state) {
                console.log('Rebuild bundle');
                io.emit('refresh');
            }
        },
    });

    app.use(wdm);

    io.on('connection', (socket) => {
        console.log('Socket connected');
    });

    wdm.onRebuildDone = (ts) => {
        console.log('Valid bundle', ts);
        io.emit('refresh');
    };
}

app.get('/', (req, res) => {
    let extra;

    if (isDevelopment) {
        let sock = fs.readFileSync('./node_modules/socket.io-client/dist/socket.io.js');
        sock += `\n var socket = io.connect('http://10.0.0.1:${PORT}');
        socket.on('refresh', function(){
                return window.location.reload(true);
              });`;
        extra = sock;
    }

    res.send(html(extra));
    res.end()
});

server.listen(PORT, () => {
    console.log('Server Listening on %s...', PORT);
});
