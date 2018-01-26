const mongoose = require('mongoose');
const crypto = require('crypto-js');
const assert = require('assert');
const dbPath = require('./db_conn_str');

mongoose.Promise = global.Promise;
mongoose.connect(dbPath);

const accountSchema = mongoose.Schema({
    name: { type: String },
    username: { type: String },
    password: { type: String }
});

const Account = mongoose.model('Account', accountSchema);

const getAccountList = () => {
    Account.find()
    .exec((err, accounts) => {
        assert.equal(null, err);
        accounts.forEach(account => console.log(account.name));
        mongoose.disconnect();
    });
};

const getAccount = (name, masterPassword) => {
    const search = new RegExp(name, 'i');
    Account.find({$or: [{name: search}]})
    .exec((err, accounts) => {
        assert.equal(null, err);
        accounts.forEach(acc => {
            console.info({
                id: acc._id,
                name: acc.name,
                username: acc.username,
                password: decrypt(acc.password, masterPassword)
            });            
        });
        console.info(`${accounts.length} matches`);
        mongoose.disconnect();
    });
}

const addAccount = (account) => {
    const encrypted = encrypt(account.password, account.masterpassword);
    const encryptedAccount = {
        name: account.name,
        username: account.username,
        password: encrypted
    };
    Account.create(encryptedAccount, (err) => {
        assert.equal(null, err);
        console.info('New account added');
        mongoose.disconnect();
    });
};

const updateAccount = (_id, account) => {
    const encrypted = encrypt(account.password, account.masterpassword);
    const encryptedAccount = {
        name: account.name,
        username: account.username,
        password: encrypted
    };    
    Account.update({ _id }, encryptedAccount)
    .exec((err, status) => {
        assert.equal(null, err);
        console.info('Updated successfully');
        mongoose.disconnect();
    });
};

const deleteAccount = (_id) => {
    Account.remove({ _id })
    .exec((err, status) => {
        assert.equal(null, err);
        console.info('Deleted successfully');
        mongoose.disconnect();
    });
};

function encrypt(text, masterPassword) {
    let encrypted = crypto.AES.encrypt(text, masterPassword);
    return encrypted.toString();
}

function decrypt(hash, masterPassword) {
    let bytes = crypto.AES.decrypt(hash, masterPassword);
    return bytes.toString(crypto.enc.Utf8);
}

module.exports = {
    getAccountList,
    getAccount,
    addAccount,
    updateAccount,
    deleteAccount
};