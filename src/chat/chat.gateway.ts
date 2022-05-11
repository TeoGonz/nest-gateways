import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';

@WebSocketGateway(81, {
  cors: { origin: 'http://localhost:4200' },
  namespace: '/chat',
  /* path: '/chat', */
  //serveClient: true, // server client activable
  /* namespace: '/', */
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server$: Server;

  private logger: Logger = new Logger('AppGateway'); //👈🏻 Implementamos logger para generar una respuesta en la consola de nest
  afterInit(server: Server) {
    this.logger.log('The websocket is initialized'); //👈🏻 Notificamos al server que ya se inicializó
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(
      `Websocket NEST client is connected: ${client.id}, connected!`,
    ); //👈🏻 En el caso de que se conecte al socket
    /* this.server$.emit('chatToClient', {
      sendername: 'WSS SERVER',
      message: 'The connection is established!',
    }); */
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Websocket client is disconnected: ${client.id}, bye!`); //👈🏻 En el caso de que se desconecte al socket
  }

  @SubscribeMessage('chatToServer')
  handleMessage(
    client: Socket,
    payload: { sendername: string, message: string,  room: string }, //Se establece el contacto, el mensaje, y el room.
  ): void {
    /*  console.log(payload);
    this.server.to(payload.room); */
    //return { event: 'msgToClient', data: payload };
    this.server$.to(payload.room).emit('chatToClient', payload); // 👈🏻 Se emite el mensaje con la room
  }

  @SubscribeMessage('joinRoom') // 👈🏻 Se ingresa al room
  hendleJoinRoom(client: Socket, room: string) {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom') // 👈🏻 Se desconecta del room
  hendleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    client.emit('leftRoom', room);
  }
}
