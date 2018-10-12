import FooterContainer from "../components/FooterContainer";
import * as actions from "../actions/";
import { StoreState } from "../types/index";
import { connect } from "react-redux";
import { Dispatch } from "redux";

export function mapStateToProps(state: StoreState) {
  return {
    conversationStarted: state.conversationStarted
  }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.BotAction>) {
  return { };
}

export default connect(mapStateToProps, mapDispatchToProps)(FooterContainer);