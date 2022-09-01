import { GamePlayer, LobbyPlayer } from "./games";

export interface ActiveBoard {
    winner: LobbyPlayer;

    map: string[][];
    bombs: ActiveBomb[];
    players: GamePlayer[];
}

export interface ActiveBomb {
    x: number;
    y: number;
}

export interface PositionRequest {
    x: number;
    y: number;
}