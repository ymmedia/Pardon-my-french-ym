import dispatcher from "../dispatcher";

export function changeGameStatus(gameStatus) {
    dispatcher.dispatch({
        type: "CHANGE_GAME_STATUS",
        payload: gameStatus
    });
}

export function restartGame() {
    dispatcher.dispatch({
        type: "RESTART_GAME_STATUS"
    });
}


