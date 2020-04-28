const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    await next();
  });

app.use(async ctx => {
    ctx.type = 'json';
    ctx.body = { message: 'Hello World' };
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`App is listening on ${port}`);