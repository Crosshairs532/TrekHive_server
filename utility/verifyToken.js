

const verifyToken = (req, res, next) => {
    const tokenn = req.headers.authorization;
    console.log(tokenn, "token");
    if (!tokenn) {
        return res.status(401).send({ message: 'Unauthorized' })
    }
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized' })
        }
        req.decode = decoded;
        next();
    })
}

module.exports = verifyToken;
