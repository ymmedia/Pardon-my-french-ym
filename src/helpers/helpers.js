//import GameStatusStore from "../stores/GameStatusStore";
import userStore from '../stores/UserStore';
import dompurify from 'dompurify';
class Helpers {
    _setDateWeekday(date, day) {
        var currentDay = date.getDay();
        var distance = day - currentDay;
        date.setDate(date.getDate() + distance);
        return date;
    }

    getChapterDate(chapter) {
        let date = new Date();
        date = this._setDateWeekday(date, chapter.weekday);
        date.setHours(chapter.hour);
        date.setMinutes(chapter.minutes || 0);

        return date;
    }

    sumObjectsByKey(...objs) {
        return objs.reduce((a, b) => {
            for (let k in b) {
                if (b.hasOwnProperty(k)) a[k] = (a[k] || 0) + b[k];
            }
            return a;
        }, {});
    }

    findChapterById(id) {
        let chapters = window.APP_DATA.chapters.filter(ch => ch._id === id);
        return chapters[0];
    }

    /*findCheckpointById(id, chapter = null) {
        if (!chapter) {
            chapter = GameStatusStore.gameStatus.currentChapter;
        }
        let checkpoints = chapter.checkpoints.filter(pt => pt._id === id);
        return checkpoints[0];
    }*/

    uniq(a) {
        return [...new Set(a.map(o => JSON.stringify(o)))].map(s =>
            JSON.parse(s)
        );
    }

    DEBUG(a, b, ...args) {
        console.log(
            "debug:%c" + a + " %c" + b,
            "font-weight: bold; color: #eb5a81;",
            "color: DodgerBlue;",
            ...args
        );
    }
    cleanHTML(pContent){
        const sanitize=dompurify.sanitize;
        return {__html:sanitize(pContent)}
    }
    findLabelInData(pKey){
        const r=userStore.getData().labels.find(item=>item.key===pKey)
        return (
            (r!==undefined) ? r.value : "NOT FOUND"
        )

    }
    findRessource(pId,pData){
        console.log("pId : ",pId);
        //console.log(pData)
        let ressources=pData!==undefined?pData:userStore.getUser().docs;
        let ressource={};
        for(var r in ressources){
           
            if(ressources[r]._id===pId){
                console.log("bingo :",ressources[r])
                ressource=ressources[r];
                break;
            }
        }
        return ressource;
    }
    processFiles(pFiles){
        console.log("**********",pFiles.substring(pFiles.indexOf(":")+1)," ", pFiles.substring(pFiles.indexOf(":")+1).split(";"));
        return pFiles.substring(pFiles.indexOf(":")+1).split(",");
    }
    appendScript = (scriptToAppend) => {
        console.log("script : ",scriptToAppend)
        const script = document.createElement("script");
        script.src = scriptToAppend;
        script.async = true;
        document.body.appendChild(script);
    }
    stripArray(pStringArray){
        return pStringArray.replace(/[\[\]]/g,"").split(',');
    }
    removeBracket(pString){
        return pString.replace(/[\[\]]/g,"")
    }
}

const helpers = new Helpers();
export default helpers;
