import { NextRequest, NextResponse } from 'next/server';

function redirectHttps(req: NextRequest) {
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_PRODUCTION &&
        req.headers.get('x-forwarded-proto') !== 'https') {
        return NextResponse.redirect(
            `https://${req.headers.get('host')}${req.nextUrl.pathname}`,
            301
        );
    }
}

function redirectWww(req: NextRequest) {
    const host: any = req.headers.get('host');
    const wwwRegex = /^www\./;
    if (wwwRegex.test(host) && !host.includes('localhost')) {
        const newHost = host.replace(wwwRegex, '');
        return NextResponse.redirect(`https://${newHost}${req.nextUrl.pathname}`, 301);
    }
}

function processMiddlewareFunctions(req: NextRequest, middlewareFns: Function[]) {
    for (const middlewareFn of middlewareFns) {
        const fnResponse = middlewareFn(req);
        if (fnResponse) {
            return fnResponse;
        }
    }
    return NextResponse.next();
}

export function middleware(req: NextRequest) {
    return processMiddlewareFunctions(req, [
        redirectHttps,
        redirectWww
    ]);
}
