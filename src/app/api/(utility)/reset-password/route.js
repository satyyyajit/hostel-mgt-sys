import jwt from 'jsonwebtoken';
import { hash } from 'bcryptjs'; // For hashing the new password

export async function POST(request) {
    const { email, newPassword, token } = await request.json();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.email !== email) {
            return Response.json({ message: 'Invalid request' }, { status: 400 });
        }

        // Hash the new password
        const hashedPassword = await hash(newPassword, 12);

        // Update the user's password in the database
        // Example: await updateUserPassword(email, hashedPassword);

        return Response.json({ message: 'Password reset successfully' });
    } catch (error) {
        return Response.json({ message: 'Failed to reset password' }, { status: 500 });
    }
}