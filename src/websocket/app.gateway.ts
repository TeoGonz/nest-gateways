import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('AppGateway'); //👈🏻 Implementamos logger para generar una respuesta en la consola de nest
  afterInit(server: Server) {
    this.logger.log('The websocket is initialized'); //👈🏻 Notificamos al server que ya se inicializó
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Websocket client is connected: ${client.id}`); //👈🏻 En el caso de que se conecte un cliente
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Websocket client is disconnected: ${client.id}`); //👈🏻 En el caso de que se desconecte un cliente
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): WsResponse<string> {
    return { event: 'msgToClient', data: payload };
  }
}
