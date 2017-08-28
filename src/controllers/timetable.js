const getSubdoc = require('../request-opts/get-subdoc');
const postLookup = require('../request-opts/post-lookup');
const { checkSessionVal, getTimetableJSON } = require('../lib');

const callback = async (ctx, next) => {
    // console.log(`--- timetable.js receive request ---`);
    try {
        // Session_Val: ASP.NET_SessionId
        const Session_Val = ctx.request.query.Session_Val;

        if (!checkSessionVal(Session_Val)) {
            throw new Error('failed to get cookie');
        } 

        // get schedule message
        // console.log(ctx.request.query);
        const { $, __VIEWSTATE, isSame } = await postLookup(Session_Val, ctx.request.query)
                                                .catch(err => {
                                                    throw err;
                                                });

        if (isSame) {
            ctx.status = 304;
            ctx.message = 'not modified';
            return;
        } else if (!$ || !__VIEWSTATE) {
            throw new Error('failed to lookup timetable!');
        }

        ctx.body = {
            timetableJSON: getTimetableJSON($),
            __VIEWSTATE
        };
        // console.log('--- finish --- \n');
        await next();
    } catch (err) {
        console.log(err.message);
        ctx.status = 404;
        ctx.message = err.message;
    }
};

module.exports = {
    'GET /timetable': callback
};