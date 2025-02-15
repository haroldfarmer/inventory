const bcrypt = require('bcrypt');
const saltRounds = 10;

bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
        return;
    }


});

const userPassword = 'user_password';
bcrypt.hash(userPassword, salt, (err, hash) => {
    if (err) {
        return;
    }

    console.log("Hashed Password:", hash);
});


const storedHashedPassword = 'hashed_password_from_database';
const userInputPassword = 'password_attempt_from_user';

bcrypt.compare(userInputPassword, storedHashedPassword, (err, result) => {
    if (err) {
        console.error("Error compairing passwords:", err);
    }

    if (result) {
        console.log('Passwords match! User authenticated');
    } else {
        console.log('Passwords dont match')
    }
});
