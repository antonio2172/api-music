'use strict';

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

function test(req, res) {
    res.status('200').send({
        message: 'testing user controller',
    });
}

function saveUser(req, res) {
    var user = new User();

    var params = req.body;
    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if (params.password) {
        // encrypt password and save data
        bcrypt.hash(params.password, null, null, function(err, hash) {
            user.password = hash;
            if (user.name != null && user.surname != null && user.email != null) {
                // save user
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({message: '🙃 Error saving user'});
                    } else {
                        if (!userStored) {
                            res.status(404).send({message: '🙃 User not saved'});
                        } else {
                            res.status(200).send({user: userStored});
                        }
                    }
                });
            } else {
                res.status(200).send({ message: '🙃 Data missing..!!'});
            }
        });
    } else {
        res.status(200).send({ message: '🙃 Password missing..!!'});
    }
}

function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if (err) {
            res.status(500).send({message: '🙃 Request error..!!'});
        } else {
            if (!user) {
                res.status(404).send({message: "🙈 User doesn't exist"});
            } else {
                // check password! 👽
                bcrypt.compare(password, user.password, function(err, check) {
                    if (check) {
                        // return user data
                        if (params.getHash) {
                            // return JWT 👽
                        } else {
                            res.status(200).send({user});
                        }
                    } else {
                        res.status(404).send({message: "🙈 User can't log in"});
                    }
                });
            }
        }
    });
}

module.exports = {
    test,
    saveUser,
    loginUser,
};
