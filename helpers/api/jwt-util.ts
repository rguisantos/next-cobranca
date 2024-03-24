const jwt = require('jsonwebtoken');

export function getUserJwt(req: Request) {
    if(!req.headers.has('authorization'))
        return null;

    const authorization = req.headers.get('authorization');

    const token = authorization?.replace('Bearer ', '');

    const jwtVerify = jwt.verify(token, process.env.SECRET_KEY_JWT!, {algorithms: ['HS256'] });
    return jwtVerify;
}