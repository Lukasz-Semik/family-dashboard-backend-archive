const ROUTER = require('express').Router();

// @route GET /confirm
// @desc Route only for set up checking
// @access public
ROUTER.get('/confirm', (req, res) => res.render('confirm.hbs'));

module.exports = ROUTER;
