const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
  ctx.header['Access-Control-Allow-Origin'] = '*';
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`App is listening on ${port}`);