const jwt = require("jsonwebtoken");
const config = require("../_helpers/auth.config.js");
const { TokenExpiredError } = jwt;
const { v4: uuidv4 } = require("uuid");

module.exports = {
  createToken: function (userId) {
    let expiredAt = new Date();
  
    expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);
  
    let _token = uuidv4();
  
    let refreshToken = {
      token: _token,
      userId: userId,
      expiryDate: expiredAt.getTime(),
    };
  
    return refreshToken;
  },

}

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
  }

  return res.sendStatus(401).send({ message: "Unauthorized!" });
};

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded.id;
    next();
  });
};

// verifyToken = (req, res, next) => {
//     let token = req.headers["x-access-token"];
  
//     if (!token) {
//       return res.status(403).send({
//         message: "No token provided!"
//       });
//     }

//     jwt.verify(token, config.secret, (err, decoded) => {
//       if (err) {
//         return res.status(401).send({
//           message: "Unauthorized!"
//         });
//       }
//       req.userId = decoded.id;
//       next();
//     });
// };