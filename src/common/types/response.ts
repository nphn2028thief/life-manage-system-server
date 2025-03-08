import { MessageType } from '../../common/constants/response';

export interface IResponse {
  messageType: MessageType;
  message: string;
}

export interface IUniqueId {
  id: string;
}
