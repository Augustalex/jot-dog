import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdjectiveAnimal } from "../utils/animal-name";

export async function ensureLocalId(request: NextRequest) {
    // Ensure that user has a local-id, if not then set the cookie and
    // redirect back to same URL to ensure cookie is in the request object
    if (!request.cookies.has("local-id")) {
        const response = NextResponse.redirect(request.nextUrl.clone());
        response.cookies.set("local-id", getAdjectiveAnimal());
        return response;
    }

    return NextResponse.next();
}