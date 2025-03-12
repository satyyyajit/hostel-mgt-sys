import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';


// Verify JWT token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null;
    }
};

export const cookieParser = (req) => {
    const cookieHeader = req.headers.get('cookie');
    if (!cookieHeader) {
        return null; // No cookies found
    }

    const token = cookieHeader
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

    return token || null; // Return token or null if not found
};


