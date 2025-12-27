/**
 * Passport Configuration
 * 
 * Configures Passport.js strategies:
 * - Local (email/password)
 * - Google OAuth 2.0
 * - JWT token strategy
 */

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { loginUser, oauthLogin, getUserById } from '../services/authService';

// ============================================
// LOCAL STRATEGY (Email/Password)
// ============================================

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const result = await loginUser({ email, password });

                if (!result) {
                    return done(null, false, { message: 'Invalid email or password' });
                }

                return done(null, result.user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// ============================================
// GOOGLE OAUTH STRATEGY
// ============================================

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback';

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                callbackURL: GOOGLE_CALLBACK_URL,
                scope: ['profile', 'email'],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails?.[0]?.value;

                    if (!email) {
                        return done(new Error('No email provided by Google'));
                    }

                    const result = await oauthLogin({
                        provider: 'google',
                        providerId: profile.id,
                        email,
                        displayName: profile.displayName,
                        avatarUrl: profile.photos?.[0]?.value,
                    });

                    return done(null, result.user);
                } catch (error) {
                    return done(error as Error);
                }
            }
        )
    );
    console.log('📍 Google OAuth strategy configured');
} else {
    console.log('⚠️ Google OAuth not configured (missing credentials)');
}

// ============================================
// USER SERIALIZATION
// ============================================

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await getUserById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;
