import { 
  SessionsApi,
  MessagesApi,
  Session, 
  Message, 
  Configuration 
} from "metamind-ts-client";

export interface Options {
  apiUrl: string
  story: string
  locale: string
  timeZone: string
  clientId: string
  clientSecret: string
}

export default class MetamindClient {

  private options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  getConfiguration(): Configuration {
    return new Configuration({
      basePath: this.options.apiUrl,
      username: this.options.clientId,
      password: this.options.clientSecret
    });
  }

  async sendMessage(session: Session, content: string): Promise<Message> {
    return new MessagesApi(this.getConfiguration()).createMessage({
      content: content,
      sessionId: session.id
    });
  }

  getSession(): Promise<Session> {
    return new SessionsApi(this.getConfiguration()).createSession({
      story: this.options.story,
      locale: this.options.locale,
      timeZone: this.options.timeZone,
      visitor: this.getVisitor() 
    });
  }

  getVisitor(): string {
    return navigator.userAgent;
  }

}