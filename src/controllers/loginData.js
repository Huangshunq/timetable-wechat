const getCookie = require('../request-opts/get-cookie');
const getCheckCode = require('../request-opts/get-checkCode');

const callback = async (ctx, next) => {
    // console.log(`--- Login.js receive request ---`);
    try {
        // get cookie
        //
        const line = ctx.query.line ? parseInt(ctx.query.line) : 2;

        // Session_Val:  ASP.NET_SessionId 
        const Session_Val = await getCookie(line)
                                  .catch(err => {
                                      throw err
                                  });

        // get checkCode picture
        const checkCodeUri = await getCheckCode(Session_Val, line)
                                   .catch(err => {
                                       throw err
                                    });
        ctx.body = {
            "src": checkCodeUri,
            "ASP.NET_SessionId": Session_Val
        };
        await next();
    } catch (err) {
        console.log(err.message);
        ctx.status = 404;
        ctx.message = err.message;
    }
};

module.exports = {
    'GET /loginData' : callback
};