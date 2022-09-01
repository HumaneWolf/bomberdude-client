export interface PlayerJoinRequest {
    joinCode: string;
}

export interface PlayerJoinResponse {
    isJoined: boolean;
    message?: string;
    characterId?: string;
    joinCode?: string;
    players?: LobbyPlayer[];
    maxPlayers?: number;
}

export interface LobbyPlayer {
    characterId: string;
    name: string;
    color: string;
    wins: number;
}

export interface GamePlayer extends LobbyPlayer {
    isAlive: boolean;
    health: number;
    positionX: number;
    positionY: number;
}

export interface LobbyState {
    state: string;
    players: LobbyPlayer[];
}