const url = 'localhost:27017/timetable';
const db = require('monk')(url);

db.then(() => {
    console.log('Connection successful');
});

const collections = {
    UserKey     : db.get('UserKey'),
    WeChatInfo  : db.get('WeChatInfo'),
    SchoolInfo  : db.get('SchoolInfo')
}

const insert = (docName, data, _id = void(0)) => {
    const doc = collections[docName];
    data._id = _id ? db.id(_id) : db.id();
    return doc.insert(data)
            .then(
                docs => docs._id.toString()
            )
            .catch(
                err => Promise.reject(err)
            );
};

const update = (docName, oldData, newData) => {
    const doc = collections[docName];
    return doc.update(oldData, newData)
            .then(
                result => true
            )
            .catch(
                err => Promise.reject(err)
            );
};

const remove = (docName, data) => {
    const doc = collections[docName];
    return doc.remove(data)
            .then(
                result => true
            )
            .catch(
                err => Promise.reject(err)
            );
};

const find = (docName, data) => {
    const doc = collections[docName];
    return doc.find(data)
            .then(
                docs => docs
            )
            .catch(
                err => Promise.reject(err)
            );
};

const findBySession = (docName, _id) => {
    const doc = collections[docName];
    return doc.find({ _id })
            .catch(
                err => Promise.reject(err)
            );
}

module.exports = {
    insert,
    update,
    remove,
    find,
    findBySession
};