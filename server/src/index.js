const Koa = require('koa');
const route = require('koa-route');
const mongo = require('koa-mongo')
const koaBody = require('koa-body');
const app = new Koa();

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
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    ctx.type = 'json';
    await next();
});

app.use(route.get('/cards', require('./cards')));
app.use(route.get('/cards/black/random', require('./cards-black-random')));
app.use(route.post('/games', require('./new-game')));

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`App is listening on ${port}`);