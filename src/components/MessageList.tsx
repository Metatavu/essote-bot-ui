import * as React from "react";
import * as _ from "lodash";
import { Message } from "metamind-ts-client";
import Typing from "./Typing";
import Lightbox from 'react-image-lightbox';
import {
  Header,
  Button,
  Transition,
  Grid,
  Image,
  Segment,
  Input,
  Container,
  Dropdown,
  Icon,
  DropdownProps
} from "semantic-ui-react";

import 'react-image-lightbox/style.css';
import essoteAvatar from  "../gfx/essote_figure.jpg";
import { InputOnChangeData } from "semantic-ui-react";

export interface Props {
  messages: Message[],
  conversationStarted: boolean
  onStartButtonClick: () => void
  onSendMessage: (messageContent: string) => void
  onReset: () => void
}

export interface MessageData {
  id: string,
  isBot: boolean,
  content: string
  hint: string
}

export interface State {
  pendingMessage: string,
  triggerButtonAnimation: boolean,
  messageDatas: MessageData[]
  waitingForBot: boolean
  imageOpen: boolean,
  clickedImageUrl?: string
}

class MessageList extends React.Component<Props, State> {

  private timer: number;
  private resetTimer: number;
  private messagesEnd: any;

  constructor(props: Props) {
    super(props);
    this.state = { 
      pendingMessage: "",
      triggerButtonAnimation: true,
      messageDatas: [],
      waitingForBot: false,
      imageOpen: false
    };
  }

  addNewMessage = (content: string) => {
    if (this.state.waitingForBot) {
      return;
    }

    const messageDatas = this.state.messageDatas;
    messageDatas.push({
      id: "temp-message",
      content: content,
      isBot: false,
      hint: ""
    });
    this.setState({
      waitingForBot: true,
      pendingMessage: "",
      messageDatas: messageDatas
    });

    setTimeout(() => {
      messageDatas.push({
        id: "temp-response",
        content: "",
        isBot: true,
        hint: ""
      });
  
      this.setState({
        messageDatas: messageDatas
      });
  
      this.props.onSendMessage(content);
    }, 200);

  }

  onSendButtonClick = () => {
    if (!this.state.pendingMessage) {
      return;
    }

    this.addNewMessage(this.state.pendingMessage);
  }

  getLatestMessage = (): Message | undefined => {
    if (this.props.messages.length < 1) {
      return undefined;
    }

    return this.props.messages[this.props.messages.length - 1];
  }

  sendQuickReply = (reply: string) => {
    this.addNewMessage(reply);
  }
  
  setResetTimer = () => {
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }

    if (this.props.conversationStarted) {
      this.resetTimer = window.setTimeout(() => {
        this.props.onReset();
      }, 1000 * 60 * 5);
    }
  }

  scrollToBottom = () => {
    if (!this.messagesEnd) {
      return;
    }

    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  updateMessageDatas = () => {
    const messageDatas: MessageData[] = [];
    this.props.messages.forEach((message) => {
      messageDatas.push({
        id: `${message.id}-message`,
        isBot: false,
        content: message.content || "",
        hint: message.hint || ""
      });
      messageDatas.push({
        id: `${message.id}-response`,
        isBot: true,
        content: message.response || "",
        hint: message.hint || ""
      });
    });
    this.setState({
      messageDatas: messageDatas
    });
  }

  handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      this.onSendButtonClick();
    }
  }

  handleResponseClick = (e: React.SyntheticEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.nodeName == "IMG") {
      const src = target.getAttribute("src");
      if (src) {
        this.setState({
          clickedImageUrl: src,
          imageOpen: true
        })
      }
    }
  }

  componentDidMount() {
    this.timer = window.setInterval(() => {
      if (this.props.conversationStarted) {
        return;
      }

      this.setState({
        triggerButtonAnimation: !this.state.triggerButtonAnimation
      });
    }, 8000);
  }

  componentDidUpdate(prevProps: Props) {

    if (prevProps.messages.length < this.props.messages.length) {
      this.updateMessageDatas();
      this.setState({
        waitingForBot: false
      });
    }

    this.setResetTimer();
    this.scrollToBottom();
  }

  componentWillUnmount() {
    window.clearInterval(this.timer);
  }

  onPendingMessageChange = (e: any, data: InputOnChangeData) => {
    this.setState({
      pendingMessage: data.value as string
    });
  }

  onQuickReplyChange = (e:any, data: DropdownProps) => {
    if (!data.value) {
      return;
    }

    this.sendQuickReply(data.value as string);
  }

  render() {

    const messageItems = this.state.messageDatas.map((messageData) => {
      if (messageData.isBot) {
        return (
          <Grid.Row key={messageData.id} verticalAlign="middle" textAlign="left" columns="equal">
            <Grid.Column textAlign="center" mobile={4} width={2} floated="left">
              <Image size="tiny" src={essoteAvatar} avatar />
            </Grid.Column>
            <Grid.Column className="bot-response-container" onClick={this.handleResponseClick} floated="left" style={{paddingLeft: "0", color: "#000000"}}>
              { messageData.content ? 
              <div 
                style={{
                  borderRadius: "10px",
                  background: "#c3e2f6",
                  display: "inline-block", 
                  border: "1px solid #c3e2f6",
                  fontSize: "16px", 
                  padding: "18px"
                }}
                dangerouslySetInnerHTML={{__html: messageData.content}}
              /> : <div 
                style={{
                  borderRadius: "10px",
                  background: "#c3e2f6", 
                  color: "#000000",
                  border: "1px solid #c3e2f6",
                  display: "inline-block", 
                  fontSize: "16px", 
                  padding: "18px"
                }}> 
                  <Typing/>
                </div>
              }
            </Grid.Column>
            <Grid.Column mobile={2} width={4} floated="right" />
          </Grid.Row>
        );
      } else {
        return(
          <Grid.Row key={messageData.id} verticalAlign="middle" textAlign="right" columns="equal">
            <Grid.Column mobile={2} width={4} floated="left" />
            <Grid.Column style={{paddingRight: "45px", color: "#fff"}} floated="right">
            { messageData.content !== "INIT" ? (
              <div 
                style={{
                  borderRadius: "10px", 
                  background: "#0275d8",
                  border: "1px solid #0275d8", 
                  display: "inline-block", 
                  fontSize: "16px", 
                  padding: "18px"
                }} 
                dangerouslySetInnerHTML={{__html: messageData.content}}
                />

            ) : ""}
            </Grid.Column>
          </Grid.Row>
        )
      }
    });

    const latestMessage = this.getLatestMessage();
    const quickReplies = latestMessage && latestMessage.quickResponses ? latestMessage.quickResponses : [];
    const quickReplyItems = quickReplies.map((quickReply) => {
      return (
        <Button disabled={this.state.waitingForBot} style={{marginTop: "5px", background: "#0275d8", color: "#fff"}} key={quickReply} size="small" floated="left" compact onClick={() => {this.sendQuickReply(quickReply)}}>{quickReply}</Button>
      )
    });

    const dropdownValues = quickReplies.map((quickReply) => {
      return {
        text: quickReply,
        value: quickReply
      };
    });
    const quickReplyItemsDropdown = <Dropdown placeholder='Valitse pikavastaus' onChange={this.onQuickReplyChange} fluid selection options={dropdownValues} />;
    

    return (
      <div>
        {this.state.imageOpen && <Lightbox mainSrc={this.state.clickedImageUrl || ""} onCloseRequest={() => this.setState({ imageOpen: false })} />}
        { this.props.conversationStarted ? (
          <div style={{paddingTop: "100px"}}>
            <div style={{maxWidth: "600px", paddingBottom: this.props.conversationStarted ? "100px" : "0"}}>
              <Grid>
                {messageItems}
              </Grid>
            </div>
            { quickReplies.length > 0 && quickReplies.length <= 3 && !this.state.waitingForBot &&
              <div style={{background: "#fff", paddingBottom: "10px", position: "fixed", left: "10px", bottom: "79px"}}>
                {quickReplyItems}
              </div>
            }

            { quickReplies.length > 0 && quickReplies.length >= 4 && !this.state.waitingForBot &&
              <div style={{background: "#fff", paddingBottom: "0", zIndex:99, position: "fixed", left: "10px", bottom: "95px"}}>
                {quickReplyItemsDropdown}
              </div>
            }
            <Segment style={{background: "#c3e2f6", position: "fixed", bottom: "0", left: "0", right: "0"}}>
              <Container>
                <Grid>
                  <Grid.Row verticalAlign="middle" columns="equal">
                    <Grid.Column style={{paddingLeft: "0"}} width={1}>
                      <Dropdown upward icon={null} trigger={<Icon size="big" style={{color: "#0275d8"}} name="ellipsis vertical" />} >
                        <Dropdown.Menu style={{border: "none"}}>
                          <Dropdown.Item style={{background: "#fff", border: "none"}}>
                            <Button onClick={this.props.onReset} style={{ background: "#00A5DB", color: "#fff" }}>Aloita alusta</Button>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Grid.Column>
                    <Grid.Column style={{paddingRight: "15px"}}>
                      <Input
                        placeholder={"Sano jotain..."}
                        value={this.state.pendingMessage}
                        onChange={this.onPendingMessageChange}
                        onKeyPress={this.handleInputKeyPress}
                        onFocus={() => {setTimeout(this.scrollToBottom, 300)}}
                        fluid />
                        {latestMessage && latestMessage.hint &&
                          <small>{latestMessage.hint}</small>
                        }
                    </Grid.Column>
                    <Grid.Column textAlign="left" mobile={3} computer={2} width={2}>
                      <Button disabled={this.state.waitingForBot} onClick={this.onSendButtonClick} style={{ background: "#0275d8", color: "#fff" }} size="huge" icon="send" circular></Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Container>
            </Segment>
          </div>
        ) : (
          <div style={{color: "#fff", paddingTop: "20vh"}}>
            <Header style={{color: "#000000"}} as="h1">Tervetuloa</Header>
            <Transition animation="tada" duration={500} visible={this.state.triggerButtonAnimation}>
              <Button onClick={this.props.onStartButtonClick} style={{marginTop: "15px", background: "#00A5DB", color: "#fff"}} size="massive">Aloita</Button>
            </Transition>
          </div>
        )}
        <div style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el; }} />
      </div>
    );
  }
}

export default MessageList;