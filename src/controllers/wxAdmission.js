const db = require('../models/db');

const callback = async (ctx, next) => {
    try {
        const session_3rd = ctx.query.session_3rd;
        const result = await db.findBySession('UserKey', session_3rd)
                                .then(
                                    docs => docs.length >= 1
                                )
                                .catch(err => {
                                    throw err;
                                });
        ctx.body = { result };
        await next();
    } catch (err) {
        console.log(err.stack);
        ctx.status = 404;
        ctx.message = err.message;
        ctx.body = { result: false };
    }
};

module.exports = {
    'GET /wxAdmission' : callback
};