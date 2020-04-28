export function cardsRoute(ctx) {
    if(ctx.requestPath === '/cards') {
        ctx.body = {
            cards: [
                '1', '2'
            ]
        }
    }
}