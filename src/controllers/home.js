const { checkSessionVal, checkForm, getTimetableJSON, getdocData }  = require('../lib');

const postLogin = require('../request-opts/post-login');
const getSubUri = require('../request-opts/get-subUri');
const getSubdoc = require('../request-opts/get-subdoc');

const callback = async (ctx, next) => {
    // console.log(`--- Home.js receive request ---`);
    try {
        const body = ctx.request.body;
        // Session_Val:  ASP.NET_SessionId 
        const Session_Val = body.Session_Val;
        const session_3rd = body.session_3rd;

        if (!checkSessionVal(Session_Val)) {
            throw new Error('failed to get cookie');
        }
        
        const result = checkForm(body);

        if (result.err) {
            throw new Error(result.msg);
        }

        const homePageUri = await postLogin(Session_Val, body)
                                  .catch(err => {
                                      throw err;
                                  });
        // get personal message
        const uriObj = await getSubUri(Session_Val, homePageUri, body.line)
                            .then(uriObj => {
                                if (!uriObj['N121602'].uri) {
                                    return Promise.reject(new Error('failed to get uri'));
                                }
                                return uriObj;
                            })
                            .catch(err => {
                                throw err;
                            });

        const timetableUri = uriObj['N121602'].uri;
        const $ = await getSubdoc(Session_Val, timetableUri, homePageUri, body.line)
                        .catch(err => {
                            throw err;
                        });

        const { docData, userData } = getdocData($, timetableUri);

        userData.password = body.password;
        await db.insert('SchoolInfo', userData, session_3rd)
                .catch(err => {
                    throw err;
                });

        ctx.body = {
            docData,
            timetableJSON: getTimetableJSON($),
            line: body.line
        };
        await next();
    } catch (err) {
        console.log(err.message);
        ctx.status = 404;
        ctx.message = err.message;
    }
};

module.exports = {
    'POST /home': callback
};