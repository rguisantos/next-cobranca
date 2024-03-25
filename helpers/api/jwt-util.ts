import { cookies } from "next/headers";

const jwt = require('jsonwebtoken');

export function getUserJwt(req: Request) {
    
    // if(!req.headers.has('authorization'))
    //     return null;

    // const authorization = req.headers.get('authorization');

    // const token = authorization?.replace('Bearer ', '');

    const cookieStore = cookies();
    if(cookieStore.getAll().filter(x=> x.name==='JWT_AUTH').length===0)
        return null;

    const token = cookieStore.get('JWT_AUTH')?.value;

    const jwtVerify = jwt.verify(token, process.env.SECRET_KEY_JWT!, {algorithms: ['HS256'] });
    return jwtVerify;
}