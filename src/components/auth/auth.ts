// ./src/auth/auth.ts

import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';

const CLIENT_ID = '<your-client-id>';
const CLIENT_SECRET = '<your-client-secret>';
const REDIRECT_URI = 'http://localhost:3000/auth/google/callback'; // Update with your actual callback URL

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

export const getAuthUrl = () => {
    const scopes = ['https://www.googleapis.com/auth/userinfo.profile']; // Adjust scopes as needed
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
    return authUrl;
};

export const getGoogleProfile = async (code: string) => {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const response = await oauth2.userinfo.get();
    return response.data;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { code } = req.query;
    try {
        const profile = await getGoogleProfile(code as string);
        // Process profile data (e.g., save to database, authenticate user)
        res.redirect('/drug-monitor'); // Redirect to the desired page after successful login
    } catch (error) {
        console.error('Error fetching Google profile:', error);
        res.status(500).json({ error: 'Failed to fetch Google profile' });
    }
};
