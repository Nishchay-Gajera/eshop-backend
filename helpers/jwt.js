// const { Router } = require("express");
const { expressjwt:expressjwt } = require("express-jwt");

function authjwt(){
    const secret = process.env.secret;
    const api = process.env.API_URL;

    return expressjwt({
        secret,
        algorithms:["HS256"],
        //isRevoked : isRevoked,
    }).unless({
        path : [
            //{url : /\/api}\
            `/users/login`,
            `/users/register`
        ],
    });
}

module.exports = authjwt;