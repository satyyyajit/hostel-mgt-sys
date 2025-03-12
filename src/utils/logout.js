// Function to handle user logout
export const logout = async () => {
    try {
        // Clear any stored tokens/user data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Optionally, clear all localStorage data
        localStorage.clear();

        // If you're using cookies, you might want to clear them as well
        document.cookie.split(';').forEach(cookie => {
            document.cookie = cookie
                .replace(/^ +/, '')
                .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
        });

        // Redirect to login page or home page
        window.location.href = '/';
        
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
};