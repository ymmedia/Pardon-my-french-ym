import dispatcher from "../dispatcher";

export function changeUser(user) {
    dispatcher.dispatch({
        type: "CHANGE_USER",
        payload: user
    });
}

export function restartGame() {
    dispatcher.dispatch({
        type: "RESTART_GAME_STATUS"
    });
}
export function inituser(){
    dispatcher.dispatch(
        {type:"INIT_USER"}
    )
}
export function loadData(data){
    console.log("LOAD IN USERACTIONS")
    dispatcher.dispatch(
        {
            type:"LOAD_DATA",
            payload:data
        }
    )
}
export function updateDocs(docs){
    dispatcher.dispatch(
        {
            type:"UPDATE_DOC",
            payload:docs
        }
    )
}
export function finishModule(status){
    dispatcher.dispatch(
        {
            type:"FINISH_MODULE",
            payload:status
        }
    )
}