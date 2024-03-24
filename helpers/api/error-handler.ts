import { NextResponse } from "next/server";

export { errorHandler };

function errorHandler(err: Error, res: Response) {
    if (typeof (err) === 'string') {
        // custom application error
        return new NextResponse(err, { status: 400});
    }
    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return new NextResponse('Invalid Token', { status: 401});
    }

    // default to 500 server error
    return new NextResponse(err.message, { status: 500});
}