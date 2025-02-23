import { MessageType } from 'src/constants/response';

export interface IResponse {
  messageType: MessageType;
  message: string;
}
