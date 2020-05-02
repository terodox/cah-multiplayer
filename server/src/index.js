const Koa = require('koa');
const route = require('koa-route');
const mongo = require('koa-mongo')
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const app = new Koa();

app.use(cors());
app.use(mongo({
    uri: process.env.mongoDbConnectionString,
    max: 100,
    min: 1
}, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}));

app.use(koaBody({
    jsonLimit: '1kb'
}));

app.use(async (ctx, next) => {
    ctx.type = 'json';
    await next();
});

app.use(route.get('/cards', require('./cards')));
app.use(route.get('/cards/black/random', require('./cards-black-random')));
app.use(route.get('/games/:gameid', require('./games-get')));
app.use(route.get('/games/:gameid/players/:playerid', require('./players-get')));
app.use(route.patch('/games/:gameid/players/:playerid', require('./players-patch')));
app.use(route.patch('/games/:gameid', require('./games-patch')));

const port = process.env.PORT || 80;
app.listen(port);

console.log(`App is listening on ${port}`);