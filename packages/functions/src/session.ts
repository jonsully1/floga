import { createSessionBuilder } from "sst/auth";

export interface UserSession {
  email: string;
}

export const session = createSessionBuilder<{ user: UserSession }>();