import { EventEmitter } from "events";

import dispatcher from "../dispatcher";
// import { truncate } from "fs";

class GameStatusStore extends EventEmitter {
    constructor() {
        super();
        let suspend = window.SCORM_HANDLER.getSuspendData();
        if (suspend && suspend.gameStatus) {
            // console.log("RETRIEVING DATA FROM LMS:",suspend.gameStatus)
            this.gameStatus = suspend.gameStatus;
        } else {
            this.initBaseStatus();
        }
    }

    initBaseStatus() {
        const appData = window.APP_DATA;
        let  startModule = appData.chapters[0];
        let gamePath = [];
        gamePath.push({
            chapter: startModule._id,
            activities: [{ checkpointId: startModule.activities[0].type }]
        });
        console.log("initBase", startModule.type);
        // gamePath.push({
        //     chapterId: "S0",
        //     checkpoints: [
        //         {
        //             checkpointId: "intro",
        //             choice: 1,
        //             scores: { confidentiality: -2, safety: 1 }
        //         },
        //         { checkpointId: "choice_2" }
        //     ]
        // });
       
        this.gameStatus = {
            currentChapterId: startModule._id,
            currentChapter: startModule,
            currentActivity: startModule.activities[0],
            currentActivityType: startModule.activities[0].type,
            ressourcesUnlocked:[],
            continueFlow:true,
            scores: {
                badges: 0,
                eval: 0,
            },
            gameFinished: false,
            firstTime:true
        };
    }
    isGameAlreadyStarted(){
        const appData = window.APP_DATA;
        let startChapterId = appData.chapters[0]._id;
        if(startChapterId!==this.gameStatus.currentChapterId){
            return true;
        }else{
            return false;
        }
    }
    getGameStatus() {
        //console.log("////////// "+this.gameStatus.currentChapterId+" "+this.gameStatus.soundToPlay)
        return this.gameStatus;
    }
    getGameData(){
        return this.gameData;
    }
    setGameStatus(status) {
        this.gameStatus = { ...this.gameStatus, ...status };
        const scormStatus=(this.gameStatus.gameFinished) ? 'completed' : 'incomplete'
        //console.log("Unlocked ressources : "+this.gameStatus.ressourcesUnlocked)
        window.SCORM_HANDLER.setSuspendData(this.gameStatus, null);
        window.SCORM_HANDLER.setLessonStatus(scormStatus)
        // window.SCORM_HANDLER.setSuspendData(this.gameStatus, null);
        this.emit("change");
    }

    restart() {
        window.SCORM_HANDLER.setLessonStatus("incomplete");
        this.initBaseStatus();
        this.emit("change");
    }
    stopSound(sound){
        this.emit("change")
        sound.pause()
    }
    handleActions(action) {
        switch (action.type) {
            case "CHANGE_GAME_STATUS":
                //console.log("changement du statut "+JSON.stringify(action.payload));
                this.setGameStatus(action.payload);
                break;
            case "RESTART_GAME_STATUS":
                this.restart();
                break;
            default:
                break;
        }
    }
}

const gameStatusStore = new GameStatusStore();
dispatcher.register(gameStatusStore.handleActions.bind(gameStatusStore));

export default gameStatusStore;
