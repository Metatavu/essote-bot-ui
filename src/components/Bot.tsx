import * as React from "react";
import { Session, Message } from "metamind-ts-client";
import {
  Grid,
  Loader
} from "semantic-ui-react";
import MessageList from "./MessageList";
import MetamindClient from "../api-client";

export interface Props {
  session?: Session
  messages?: Message[],
  conversationStarted: boolean,
  onBotConnected?: (session: Session) => void
  onBotResponse?: (message: Message) => void
  onBotReset?: () => void,
  startConversation?: () => void
}

class Bot extends React.Component<Props, any> {
  
  private metamindClient: MetamindClient;

  constructor(props: Props) {
    super(props);
    this.metamindClient = new MetamindClient({
      apiUrl:  process.env.REACT_APP_API_URL || "",
      clientId: process.env.REACT_APP_CLIENT_ID || "",
      clientSecret: process.env.REACT_APP_CLIENT_SECRET || "",
      locale: "fi",
      story: process.env.REACT_APP_STORY || "",
      timeZone: "Europe/Helsinki"
    });
  }

  sendMessage = (messageContent: string) => {
    if (!this.props.session) {
      return;
    }

    this.metamindClient.sendMessage(this.props.session, messageContent).then((message: Message) => {
      this.props.onBotResponse && this.props.onBotResponse(message);
    });
  }

  beginConversation = () => {
    this.props.startConversation && this.props.startConversation();
  }

  resetBot = () => {
    this.props.onBotReset && this.props.onBotReset();
  }

  componentDidMount() {
    if (!this.props.session) {
      this.metamindClient.getSession().then((session: Session) => {
        this.props.onBotConnected && this.props.onBotConnected(session);
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!this.props.session) {
      this.metamindClient.getSession().then((session: Session) => {
        this.props.onBotConnected && this.props.onBotConnected(session);
      });
    }

    if (!prevProps.session && this.props.session) {
      this.sendMessage("INIT");
    }
  }

  render() {
    return (
      <Grid centered>
        { !this.props.session ? (
          <div>
            <Loader active size="medium" />
          </div>
        ) : (
          <MessageList 
            conversationStarted={this.props.conversationStarted} 
            messages={this.props.messages || []}
            onStartButtonClick={this.beginConversation}
            onSendMessage={this.sendMessage}
            onReset={this.resetBot}
          />
        )}
      </Grid>
    );
  }
}

export default Bot;