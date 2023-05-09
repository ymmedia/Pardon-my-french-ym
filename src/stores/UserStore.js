import { fabClasses } from "@mui/material";
import { EventEmitter } from "events";

import dispatcher from "./../dispatcher";   

class UserStore extends EventEmitter {
    constructor() {
        super();
        let suspend = window.SCORM_HANDLER.getSuspendData();
        if (suspend && suspend.user) {
            this.user = suspend.user;
        } else {
            this.user = {
                _id: "",
                firstname: "",
                lastname: "",
                docs:[],
                sequenceEnCours:0,
                globalProgress: 0,
                gamePath:[],
                moduleFinished:false,
                score:30,
                saved: [],
                newDoc:{isNew:false,nbOfNew:0},
                wheelState:null
            };
            //this.APP_DATA=this.user.data;
            //this.initGame();
        }
        this.data={};
    }
   match(){
       //console.log("match")
       //this.APP_DATA=this.data;   
       if(this.user.gamePath.length===0)
        this.initGame()
   }
   setData(data){
       //console.log("DATA ", data)
       this.data=data.data;
       this.APP_DATA=this.data;
       //console.log("DEF ", this.APP_DATA);
   }
    initGame(){
        //console.log("init game !!!",this.data, this.APP_DATA.chapters )
        let gameModule = this.APP_DATA.chapters.length;
        this.user = {
            _id: "",
            firstname: "",
            lastname: "",
            docs:[],
            sequenceEnCours:0,
            globalProgress: 0,
            gamePath:[],
            moduleFinished:false,
            score:30,
            saved: [],
            newDoc:{isNew:false,nbOfNew:0},
            docsCats:["lng","campus","bonus video"],
            wheelState:null
        };
        for(let i=0; i < gameModule; i++){
            this.user.gamePath.push({
                module: this.APP_DATA.chapters[i]._id,
                progress: 0,
                //introComplete:false,
                sequences: this.fillSequences(this.APP_DATA.chapters[i]._id),
                sequence:0
            })
        }
        this.user.docs=this.APP_DATA.ressources.filter(doc=>doc.viewed);
        console.log("INIT GAME : ", this.user.gamePath)
    }
    fillSequences(pChapterId){
        console.log("ID CHAPTER : ", pChapterId)
        const sequences=this.APP_DATA.chapters.find(chapter=>chapter._id===pChapterId).sequences
        const aS=[];
        sequences.forEach(sequence => {
            aS.push({id:sequence._id,completed:false})
        });
        return aS
    }

    getUser() {
        //console.log("init user !!! ",this.user)
        return this.user;
    }
    getData(){
        return this.data
    }
    getThemes(){
        return this.APP_DATA.contents.THEMES.TAB.split(";")
    }
    getCategories(){
        return this.APP_DATA.contents.RESSOURCES.TAB.split(";");
    }
    getFilteredDocs(pTheme,pCat){
        console.log(pTheme, " : ",pCat);
        return this.user.docs.filter(doc => doc.theme===pTheme && doc.type===this.user.docsCats[pCat])
    }
    getNewDocsByTheme(pTheme){
        return this.user.docs.filter(doc=>doc.theme===pTheme && !doc.viewed).length
    }
    setNewDocsToViewed(){
        this.user.docs.forEach(doc=>{
            if(!doc.viewed)
                doc.viewed=true;
        })
    }
    updateDocs(docsToUpdate){
        let count=0
        for(let i=0;i<docsToUpdate.length;i++){
            //console.log(docsToUpdate[i], " : ", this.APP_DATA.ressources.find(doc=>doc._id===parseInt(docsToUpdate[i])))
            let item=this.APP_DATA.ressources.find(doc=>doc._id===parseInt(docsToUpdate[i]))
            if(item!==undefined &&!item.viewed){
                if(this.user.docs.find(doc=>doc===item)===undefined){
                    this.user.docs.push(item);
                    count++
                }
                    
            }
               
        }
        this.user.newDoc={isNew:true,nbOfNew:count++};
    }
    setUser(user) {
        console.log("change user : ", user)
        window.SCORM_HANDLER.setSuspendData(null, this.user);
        const scormStatus=this.user.moduleFinished ? "completed" : "incomplete";
        const scormSuccess=this.user.score>0 ?this.user.score>=80?"passed" : "failed" :"unknown"
        this.user = {...this.user,...user};
        window.SCORM_HANDLER.setLessonStatus(scormStatus);
        window.SCORM_HANDLER.setSucessStatus(scormSuccess);
        window.SCORM_HANDLER.setSuspendData(null, this.user);
        this.emit("change");
    }
    restart() {
        window.SCORM_HANDLER.setLessonStatus("incomplete");
        this.initGame();
        this.emit("change");
    }
    finalizeModule(status){
        if(status){
            this.user.moduleFinished=true; 
            this.user.score=100
        }else{
            this.user.moduleFinished=false
            this.user.score=60
        }
            
        this.setUser(this.user) ;

    }
    handleActions(action) {
        switch (action.type) {
            case "CHANGE_USER":
                this.setUser(action.payload);
                break;
            case "LOAD_DATA":
                    this.setData(action.payload);
                    break;
            case "RESTART_GAME_STATUS":
                this.restart();
            break;
            case "FINISH_MODULE" :
                this.finalizeModule(action.payload);
                break;
            case "UPDATE_DOC" :
                this.updateDocs(action.payload)
                break;
            default:
                break;
        }
    }
}

const userStore = new UserStore();
dispatcher.register(userStore.handleActions.bind(userStore));

export default userStore;
