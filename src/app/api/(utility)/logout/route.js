import { NextResponse } from "next/server";

export async function POST(req) {
  // Create a response with a success message
  const response = NextResponse.json(
    { message: "You have been signed out" },
    { status: 200 }
  );

  // Clear the auth-token cookie by setting it with an empty value and an expired date
  response.cookies.set("token", "", {
    expires: new Date(0), // Set the expiration date to the past to invalidate the cookie
    httpOnly: true, // Ensure the cookie is not accessible via JavaScript
    secure: true, // Ensure the cookie is only sent over HTTPS
    sameSite: "strict", // Prevent CSRF attacks
    path: "/", // Make sure the cookie is cleared site-wide
  });

  return response;
}