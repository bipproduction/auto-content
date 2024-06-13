import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import 'colors'

export function middleware(request: NextRequest) {
    console.log("apa kabar".green)

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};