import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { storage } from "./storage";
import { type Express } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";

export function setupAuth(app: Express) {
    const MemoryStore = createMemoryStore(session);
    const sessionSettings: session.SessionOptions = {
        secret: process.env.SESSION_SECRET || "r4nd0m_s3cr3t_k3y_d0_n0t_us3_1n_pr0d",
        resave: false,
        saveUninitialized: false,
        cookie: {},
        store: new MemoryStore({
            checkPeriod: 86400000,
        }),
    };

    if (app.get("env") === "production") {
        app.set("trust proxy", 1);
        if (sessionSettings.cookie) {
            sessionSettings.cookie.secure = true;
        }
    }

    app.use(session(sessionSettings));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: number, done) => {
        try {
            const user = await storage.getUser(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        passport.use(
            new GoogleStrategy(
                {
                    clientID: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    callbackURL: "/api/auth/callback/google",
                },
                async (accessToken, refreshToken, profile, done) => {
                    try {
                        const googleId = profile.id;
                        let user = await storage.getUserByGoogleId(googleId);

                        if (!user) {
                            const email = profile.emails?.[0]?.value || "";
                            const username = profile.displayName || email.split("@")[0];
                            const avatarUrl = profile.photos?.[0]?.value;

                            user = await storage.createUser({
                                username,
                                email,
                                googleId,
                                avatarUrl,
                            });
                        }
                        return done(null, user);
                    } catch (err) {
                        return done(err);
                    }
                }
            )
        );
    }

    if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
        passport.use(
            new GitHubStrategy(
                {
                    clientID: process.env.GITHUB_CLIENT_ID,
                    clientSecret: process.env.GITHUB_CLIENT_SECRET,
                    callbackURL: "/api/auth/callback/github",
                    scope: ["user:email"],
                },
                async (accessToken: string, refreshToken: string, profile: any, done: any) => {
                    try {
                        const githubId = profile.id;
                        let user = await storage.getUserByGithubId(githubId);

                        if (!user) {
                            const email = profile.emails?.[0]?.value || "";
                            // Check if a user with this email already exists
                            const existingUser = await storage.getUserByEmail(email);

                            if (existingUser) {
                                // Link the GitHub account to the existing user
                                user = await storage.updateUser(existingUser.id, { githubId });
                            } else {
                                const username = profile.username || profile.displayName;
                                const avatarUrl = profile.photos?.[0]?.value;

                                user = await storage.createUser({
                                    username,
                                    email,
                                    githubId,
                                    avatarUrl,
                                });
                            }
                        }
                        return done(null, user);
                    } catch (err) {
                        return done(err);
                    }
                }
            )
        );
    }
}
