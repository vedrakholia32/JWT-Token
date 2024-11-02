const express = require('express');
const app = express()
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Person = require('./models/Person')

passport.use(new LocalStrategy(async (USERNAME, password, done) => {
    // Authentication Logic Here
    try {
        const user = await Person.findOne({ username: USERNAME });
        if (!user)
            done(null, false, { message: 'Incorrect Username' })

        const isPasswordMatch = await user.comparePassword(password);

        if (isPasswordMatch)
            return done(null, user);
        else
            return done(null, false, { message: 'Incorrect Password' })

    } catch (error) {
        return done(error);
    }
}))

app.use(passport.initialize())
const localAuthMiddleware = passport.authenticate('local', { session: false })

module.exports = localAuthMiddleware
