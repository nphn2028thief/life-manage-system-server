import { MessageType } from 'src/common/constants/response';

export interface IResponse {
  messageType: MessageType;
  message: string;
}
