import jwt from 'jsonwebtoken';

export async function POST(request) {
    const { email, otp, token } = await request.json();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.email === email && decoded.otp === otp) {
            return Response.json({ message: 'OTP verified successfully' });
        } else {
            return Response.json({ message: 'Invalid OTP' }, { status: 400 });
        }
    } catch (error) {
        return Response.json({ message: 'OTP expired or invalid' }, { status: 400 });
    }
}