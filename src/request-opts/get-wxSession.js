const request = require('request-promise-native').defaults({
    encoding: null,
    json: true,
    timeout: 10000
});

// //正常返回的JSON数据包
// {
//       "openid": "OPENID",
//       "session_key": "SESSIONKEY",
//       "unionid": "UNIONID"
// }
// //错误时返回JSON数据包(示例为Code无效)
// {
//     "errcode": 40029,
//     "errmsg": "invalid code"
// }
const getWXSession = (APPID, SECRET, code) => {
    if (!code || (typeof code !== 'string') || code.length !== 32) {
        return Promise.reject(new Error('invalid code'));
    }
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${code}&grant_type=authorization_code`;
    return request({ url }).then(json => {
                if (json.errcode || json.errmsg) {
                    return Promise.reject(new Error(json.errmsg));
                }
                return json;
            });
};

module.exports = getWXSession;
