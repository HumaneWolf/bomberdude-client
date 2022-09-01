import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, IStreamResult, ISubscription, LogLevel } from '@microsoft/signalr';
import { LobbyState, PlayerJoinRequest, PlayerJoinResponse } from '../../models/games';
import { environment } from '../../environments/environment';
import { PlayerRegisterRequest, PlayerResponse } from '../../models/players';
import { LobbyStateService } from './lobby-state.service';
import { ActiveBoard, PositionRequest } from '../../models/board';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private connection?: HubConnection;

  displayName?: string;

  get isConnected() { return this.connection?.state === HubConnectionState.Connected; }
  get isConnecting() { return this.connection?.state === HubConnectionState.Connecting; }

  gameStateSub?: ISubscription<any>;

  constructor(
    private lobbyState: LobbyStateService,
  ) { }

  connect() {
    this.connection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hubs/game`)
      .configureLogging(LogLevel.Information)
      .build();
    this.connection.start();
    console.log('SignalR connected');
  }

  registerPlayer(name: string): Promise<PlayerResponse>|undefined {
    const payload: PlayerRegisterRequest = {
      name: name,
    };
    return this.connection?.invoke('RegisterPlayer', payload)
      .then((response: PlayerResponse) => {
        this.displayName = response.playerName;
        return response;
      });
  }

  joinGame(code: string): Promise<PlayerJoinResponse>|undefined {
    const payload: PlayerJoinRequest = {
      joinCode: code,
    };
    return this.connection?.invoke('JoinGame', payload)
      .then((response: PlayerJoinResponse) => {
        this.lobbyState.processJoin(response);
        this.subscribeToGameState();
        return response;
      });
  }

  startGame(): Promise<any>|undefined {
    return this.connection?.invoke('StartGame')
      .then((response: any) => {
        return response;
      });
  }

  subscribeToGameState() {
    this.gameStateSub = this.connection?.stream('GetGameState')
      .subscribe({
        next: (item: LobbyState) => {
          this.lobbyState.processStateChange(item);
        },
        complete: () => {

        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  unsubscribeGameState() {
    this.gameStateSub?.dispose();
    this.gameStateSub = undefined;
  }

  getActiveBoardStream(): IStreamResult<ActiveBoard>|undefined {
    return this.connection?.stream('GetGameBoard');
  }

  setPosition(request: PositionRequest) {
    return this.connection?.invoke('SetPosition', request)
      .then((response: any) => {
        return response;
      });
  }

  dropBomb() {
    return this.connection?.invoke('DropBomb')
      .then((response: any) => {
        return response;
      });
  }

  playAgain() {
    return this.connection?.invoke('PlayAgain')
      .then((response: any) => {
        return response;
      });
  }
}
