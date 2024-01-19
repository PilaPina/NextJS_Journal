/*
It's good practice to hash passwords before storing them in a database. 
Hashing converts a password into a fixed-length string of characters, 
which appears random, providing a layer of security even if the user's data is exposed.

In your seed.js file, you used a package called bcrypt to hash the user's password before storing it in the database. 
You will use it again later in this chapter to compare that the password entered by the user matches the one in the database. 
However, you will need to create a separate file for the bcrypt package. 
This is because bcrypt relies on Node.js APIs not available in Next.js Middleware.

auth.ts spreads your authConfig object
*/

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
 
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);  //Calling bcrypt.compare to check if the passwords match:

          if (passwordsMatch) return user;   // if the passwords match you want to return the user, otherwise, return null to prevent the user from logging in.
        }
            console.log('Invalid credentials');
            return null;
      },
    }),
  ],
});

/*
Next, you will need to add the providers option for NextAuth.js. providers is an array where you list different login options such as Google or GitHub. 
For this course, we will focus on using the Credentials provider only.
The Credentials provider allows users to log in with a username and a password.     providers: [Credentials({})],

Good to know:
Although we're using the Credentials provider, it's generally recommended to use alternative providers such as OAuth or email providers. 
See the NextAuth.js docs for a full list of options.

You can use the authorize function to handle the authentication logic. 
Similarly to Server Actions, you can use zod to validate the email and password before checking if the user exists in the database:
*/
