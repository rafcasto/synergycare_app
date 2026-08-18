/**
 * Grants or revokes admin access to the CMS.
 *
 *   npm run grant-admin -- someone@synergycare.co.nz
 *   npm run grant-admin -- someone@synergycare.co.nz --revoke
 *
 * Creates the account if it does not exist, printing a temporary password to
 * set. Admin access is an explicit custom claim, never implied by simply
 * having a Firebase account.
 */
import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (!match) continue;
  let value = match[2].trim();
  if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
  process.env[match[1]] ??= value;
}

const [email, ...flags] = process.argv.slice(2);
if (!email) {
  console.error("Usage: npm run grant-admin -- <email> [--revoke]");
  process.exit(1);
}
const revoke = flags.includes("--revoke");

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const auth = getAuth();
let user;
let tempPassword = null;

try {
  user = await auth.getUserByEmail(email);
} catch {
  if (revoke) {
    console.error(`No account for ${email}.`);
    process.exit(1);
  }
  tempPassword = `${randomBytes(9).toString("base64url")}!aA1`;
  user = await auth.createUser({ email, password: tempPassword, emailVerified: true });
}

await auth.setCustomUserClaims(user.uid, revoke ? { admin: false } : { admin: true });
// Existing sessions are checked against revocation, so access changes at once.
await auth.revokeRefreshTokens(user.uid);

console.log(`${revoke ? "Revoked" : "Granted"} admin for ${email} (${user.uid}).`);
if (tempPassword) {
  console.log(`Temporary password: ${tempPassword}`);
  console.log("Share it over a secure channel and have them change it on first sign in.");
}
if (!revoke) console.log("They must sign in again for the change to take effect.");
