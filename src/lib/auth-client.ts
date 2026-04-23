import { createAuthClient } from "better-auth/react";
import { getBaseUrl } from "./utils";

export const authClient = createAuthClient({
	baseURL: getBaseUrl(),
});

export const { useSession, signIn, signUp, signOut } = authClient;
