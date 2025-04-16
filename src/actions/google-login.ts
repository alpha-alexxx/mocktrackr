import { authClient } from '@/lib/authentication/auth-client';

//import the auth client

const handleGoogleAuth = async () => {
    await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
        errorCallbackURL: '/error'

        // newUserCallbackURL: '/welcome',
    });
};

export default handleGoogleAuth;
