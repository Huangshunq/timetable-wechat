const getWXSession = require('../request-opts/get-wxSession');
const db = require('../models/db');

const APPID = "APPID";
const SECRET = "SECRET";

const callback = async (ctx, next) => {
    try {
        const wxJson = await getWXSession(APPID, SECRET, ctx.query.code)
                            .catch(err => {
                                throw err;
                            });
        const session_3rd = await db.insert('UserKey', wxJson)
                                    .catch(err => {
                                        throw err;
                                    });
        db.insert('WeChatInfo', JSON.parse(ctx.query.userInfo), session_3rd)
          .then(
              id => session_3rd === id ? true : Promise.reject(new Error('inserted err'))
          )
          .catch(err => {
              throw err;
          });
        ctx.body = { session_3rd };
        await next();
    } catch (err) {
        console.log(err.stack);
        ctx.status = 404;
        ctx.message = err.message;
    }
};

module.exports = {
    'GET /wxKey' : callback
};