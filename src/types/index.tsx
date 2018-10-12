import { Message, Session } from "metamind-ts-client";

export interface StoreState {
  messages: Message[],
  session: Session | undefined,
  conversationStarted: boolean
}