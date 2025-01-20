const db = require('../db/queries');

const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");