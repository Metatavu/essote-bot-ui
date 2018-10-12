import Bot from "../components/Bot";
import * as actions from "../actions/";
import { StoreState } from "../types/index";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Session, Message } from "metamind-ts-client";

export function mapStateToProps(state: StoreState) {
  return {
    session: state.session,
    messages: state.messages,
    conversationStarted: state.conversationStarted
  }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.BotAction>) {
  return {
    onBotConnected: (session: Session) => dispatch(actions.botConnected(session)),
    onBotResponse: (message: Message) => dispatch(actions.botResponse(message)),
    startConversation: () => dispatch(actions.conversationStart()),
    onBotReset: () => dispatch(actions.BotReset())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Bot);