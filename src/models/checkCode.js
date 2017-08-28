const fs = require('mz/fs');
// 检查验证码图片数量
const checkCheckCode = () => {
    fs.readdir(__dirname + '/../static/img')
      .then(files => {
          if (files.length >= 10) {
            files.forEach((el) => {
                fs.unlink(`${__dirname}/../static/img/${el}`)
                  .catch(err => {
                      console.log(err.stack);
                  });
            });
            console.log(`delete checkCode pictures`);
          } else {
            console.log(`checkCode count: ${files.length}`);
          }
      });
};

checkCheckCode();

const writeCheckCode = (Session_Val, body) => {
    return fs.writeFile(`${__dirname}/../static/img/${Session_Val}.gif`, body)
            .then(
                () => Promise.resolve(`manage to write gif: ${Session_Val}.gif`)
            )
            .catch(
                () => Promise.reject(new Error('failed to write gif'))
            );
};

const deleteCheckCode = (Session_Val) => {
    fs.unlink(`${__dirname}/../static/img/${Session_Val}.gif`)
        .then(
            () => Promise.resolve(`unlink file: ${Session_Val}.gif`)
        )
        .catch(err => {
            console.log(`failed to unlink file: ${Session_Val}.gif`);
            checkCheckCode();
        });
};

module.exports = {
    writeCheckCode,
    deleteCheckCode    
};