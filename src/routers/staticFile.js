const path = require('path');
const fs = require('mz/fs');

/**
 * @params url : 项目文件起始的目录 '/static/'
 * @params dir : 完整目录 __dirname + '/static'
 */
const staticFile = (url, dir) => {
    return async (ctx, next) => {
        let rpath = ctx.request.path;
        // 判断是否以指定的 url 开头：
        if (rpath.startsWith(url)) {
            // 获取文件完整路径，读取文件内容：
            let fp = path.join(dir, rpath.substring(url.length));
            if (await fs.exists(fp)) {
                ctx.set('Content-Type', 'image/Gif');
                ctx.response.body = await fs.readFile(fp);
            } else {
                ctx.status = 404;
            }
        } else {
            await next();
        }
    };
};

module.exports = staticFile;