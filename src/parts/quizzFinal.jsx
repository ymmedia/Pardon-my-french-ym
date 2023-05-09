import React,{Component} from 'react';
//import "./components/quizz.scss";
import "./components/cases.scss";
import {Paper,Card, CardContent, CardActions, Button, Radio, CardMedia, CircularProgress, Switch, Slide, Box, Typography} from  '@material-ui/core/';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import Helpers from "../helpers/helpers"
import {Tween, PlayState} from 'react-gsap';
import {ResponsiveImage} from './components/units/basics'
import helpers from '../helpers/helpers';
import * as UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';
const isExe=true;
let timer;
class QuizzFinal extends Component{

    constructor (props){
        super()
        this.state = {
            quizzQuestions : this.selectQuestions(window.APP_DATA.quizz),
            questionEnCours: 0,
            answer: new Map(),
            questionComplete: false,
            score: 0, 
            scoreFinal:0,
            startQuizz:true,
            isQuestionAnswered:false,
            mountedImg:false,
            mounted:false,
            slide: true,
            layoutComplete:false
        }
        this.validateQuestion=this.validateQuestion.bind(this);
        this.changeQuestion=this.changeQuestion.bind(this);
        this.fireEndImage=this.fireEndImage.bind(this);
        this.fireEndTransition=this.fireEndTransition.bind(this);
        this.startQuestion=this.startQuestion.bind(this);
    }
    fireEndTransition(){
        this.setState({mountedImg:true})
    }
    fireEndImage(){
        this.setState({mountedImg:true})
    }
    isQuestionMultiple(){
        const question=this.state.quizzQuestions[this.state.questionEnCours]
        let isMultiple=0
        question.items.forEach(item=>{
            if(item.value===true)
            isMultiple++
        })
        return (isMultiple>1 ?true :false)
    }
    openAttestation(e){
        const doc=UserStore.getUser().lng==="FR" ? "data/assets/files/attestation-FR.pdf" :`data/assets/files/attestation-${UserStore.getUser().lng}.pdf`
        e.preventDefault();
        window.open(doc,"_blank");
        return false;
    }
    quitModule(e){
        e.preventDefault()
        UserActions.finishModule(this.state.scoreFinal);
        window.SCORM_HANDLER.windowUnloadHandler();
        window.onCloseHandler();
        //window.open(location, '_self').close();   
    }
    startQuestion(){
        this.setState({mountedImg:false},
            ()=>timer=setTimeout(function(){this.setState({startQuizz:false,slideQuestion:true,mountedImg:true});clearTimeout(timer)}.bind(this), 2000)
            )
    }
    downloadRessources(){
        const doc=UserStore.getUser().lng==="FR" ? `${window.PUBLIC_URL}/data/assets/files/FR/global-ressources.pdf` : `${window.PUBLIC_URL}/data/assets/files/EN/global-ressources.pdf` 
        window.open(doc);
    }
    selectQuestions(pArray){
        const sort= pArray.sort(function() { return Math.random() - .5 })
        if(sort.length>15){
            return pArray.slice(0,10);
        }else
            return pArray
    }
    handleClick(e,indice, value){
        e.preventDefault()
        let mapCopy = this.state.answer;
        
        if(this.state.answer.has(indice)){
            mapCopy.delete(indice);
        }
        else {
            if(!this.isQuestionMultiple()){
                mapCopy=new Map();
            }
            mapCopy.set(indice, value);
        }
        this.setState({
            answer: mapCopy,
            isQuestionAnswered:true

        }); 
        
    }

    changeQuestion(){
        const indice = this.state.questionEnCours + 1;
        if(indice < this.state.quizzQuestions.length){
            this.setState({
                questionEnCours: indice,
                questionComplete: false,
                answer: new Map(),
                slide: false,
                isQuestionAnswered:false,
                slideQuestion:false
            })
        }
        else{
            let nbQue = this.state.quizzQuestions.length;
           
            let scoreFinal = Math.round((this.state.score/nbQue) * 100);
            let status=scoreFinal>=80 ?"completed" :"incomplete"
            //let scoreFinal = Math.round((10 * 100) / nbQue);
            console.log("SCORE FINAL",scoreFinal,nbQue,this.state.score);
            UserActions.changeUser({score:scoreFinal,status:status})
            this.setState({
                end: true,
                slideQuestion:false,
                scoreFinal : scoreFinal
            })
        }
    }

    validateQuestion(){
        let result;
        result = true; 
        //if only one is false, the feedback will be false
        for (let v of this.state.answer) {
            console.log(v)
            if (v[1] === "false" || v[1]===false) { 
                result = false; 
            }
        }
        console.log(result)
        if(this.isQuestionMultiple()){
            if(result &&this.state.answer.length!==this.state.quizzQuestions[this.state.questionEnCours].items.length){
                this.state.quizzQuestions[this.state.questionEnCours].items.forEach((item,i)=>{
                    if(item.value){
                        if(!this.state.answer.has(i)){
                            result=false;
                        }   
    
                    }
                }
                )
            }
        }
       
        console.log("SCORE !!!!",result,this.state.score)
        if(result){
            this.setState((prevState) => ({
                score: prevState.score + 1
            })); 
        }
        this.setState({
            questionComplete: true,
            questionFeedback: result
            
        })
    }
    
    displayFeedBack(pAnim){
        let nbQu = this.state.quizzQuestions[this.state.questionEnCours].items.length;
        let feedback = this.state.quizzQuestions[this.state.questionEnCours].feedback;
        return(
            <div className="quizz-feedback-wrapper">
                <Paper className={(this.state.questionFeedback === "true" ? "quizz-good" : "quizz-bad") + " quizz-feedback"}>
                    <p dangerouslySetInnerHTML={Helpers.cleanHTML(feedback)}></p>
                </Paper>
            </div>
        )
    }

    displayIcons(i){
        if(this.state.answer.has(i)){
            if(this.state.quizzQuestions[this.state.questionEnCours].items[i].value === true)
             return <CheckCircleOutlinedIcon className="green"/>
            else
            return <HighlightOffOutlinedIcon className="red"/>
        
        }else{
            if(this.state.quizzQuestions[this.state.questionEnCours].items[i].value === true)
            return <CheckCircleOutlinedIcon  className="green"/>
        }
    }
    displayEndScreen(){
        if(!this.state.slideQuestion){
            setTimeout(function(){
                this.setState({
                    slideQuestion: true
                });
            }.bind(this), 200)
        }
        return this.displayEndMessage();
    }
    displayEndMessage(){
        const iconGood=`${window.PUBLIC_URL}/data/assets/DAC6_SG_Work_Icons_Bravo.png`;
        const iconBad=`${window.PUBLIC_URL}/data/assets/DAC6_SG_Work_Icons_Desole.png`;
        const attestLabel=UserStore.getUser().lng==="FR" ?"COMPLÉTER VOTRE CERTIFICAT" : "COMPLETE YOUR CERTIFICATE"
        return(
            <Slide 
                direction={'left'}
                in={this.state.slideQuestion}
                mountOnEnter unmountOnExit> 
                       <div className="final-message-wrapper">
                           <h3>{window.APP_DATA.contents.QUIZZ.SCORE}</h3>
                           <div className="score-box">
                                <CircularProgress 
                                variant="static" 
                                value = {this.state.scoreFinal} 
                                size={250} 
                                thickness={5}
                                style={this.state.scoreFinal >= 80 ? {color:"lightgreen"} : {color:"#ee3b45"}}
                                />
                                <Box
                                    top={0}
                                    left={0}
                                    bottom={0}
                                    right={0}
                                    position="absolute"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    
                                >
                                    <Typography variant="h3" component="div" className="score-number">{this.state.scoreFinal}%</Typography>
                                </Box>
                            </div>
                            {this.state.scoreFinal >=80 ?
                            <div className="final-comment">
                                <img src={iconGood} alt="Bravo"/>
                                <div dangerouslySetInnerHTML={Helpers.cleanHTML(window.APP_DATA.contents.QUIZZ.GOOD)}/>
                            </div>
                            :
                            <div className="final-comment">
                                <img src={iconBad} alt="Desolé"/>
                                <div dangerouslySetInnerHTML={Helpers.cleanHTML(window.APP_DATA.contents.QUIZZ.BAD)}/>
                            </div>
                        }
                            <div className="quizzFinal-bloc-btn">
                                    <Button disableElevation color="primary" variant="contained" 
                                        onClick={this.downloadRessources} 
                                        className='button-files'>
                                            {helpers.findLabelInData("BTN-DOWNLOAD")}
                                    </Button>
                                {this.state.scoreFinal<80&&<Button variant="outlined" disableElevation color="primary" 
                                    onClick={() => this.restartQuizz()} 
                                    className='button-quizzFinal'>
                                    {Helpers.findLabelInData("QUIZZ-RESTART")}
                                </Button>}
                                <Button variant="outlined" disableElevation color="primary" 
                                    onClick={() => this.props.handleBack()} 
                                    className='button-quizzFinal'>
                                    {Helpers.findLabelInData("BTN-REVENIR")}
                                </Button>
                                {
                                    (this.state.scoreFinal>=80&&isExe)&&<Button variant="outlined" disableElevation color="primary" 
                                    onClick={e=>this.openAttestation(e)}
                                    className='button-quizzFinal'>
                                        {attestLabel}
                                    </Button>
                                }
                                {(this.state.scoreFinal>=80&&!isExe)&&<Button variant="outlined" disableElevation color="primary" 
                                        onClick={e=>this.quitModule(e)}
                                        className='button-quizzFinal'>
                                            {Helpers.findLabelInData("QUIZZ-QUIT")}
                                </Button>}
                            </div>       
                       </div>              
           </Slide>
        )
    }
    getchecker(i){
        if(this.isQuestionMultiple())
         return <Switch value={i} color="primary" checked={this.state.answer.has(i)}/>  
         else
         return <Radio value={i} color="primary" checked={this.state.answer.has(i)}/>  
    }
    displaySimpleQuestion(question){
        //console.log("SLIDE",this.state.slideQuestion)
        return (
            <Slide 
                direction={'left'}
                in={this.state.slideQuestion}
                mountOnEnter unmountOnExit> 
                <div className="quizz-viewer">
                    <h3>{`${this.state.questionEnCours+1}/${this.state.quizzQuestions.length} - ${question.question}`}</h3>   
                    {
                        question.items.map((item,i)=>{
                            return(
                            <div 
                                key={i} 
                                className={this.state.answer.has(i)?"quizz-item selected-item":"quizz-item"} 
                                onClick={!this.state.questionComplete?(e) => this.handleClick(e,i, item.value):null}
                                >
                                {this.state.questionComplete&&this.displayIcons(i)}
                                {this.getchecker(i)}
                                
                                <p>{item.lib}</p>
                            </div>
                            )
                        })
                    }
                    
                </div>  
            </Slide>
        )
    }
    displayQuestions(question){
        if(!this.state.slideQuestion){
            setTimeout(function(){
                this.setState({
                    slideQuestion: true
                });
            }.bind(this), 200)
        }
        return this.displaySimpleQuestion(question)
    }
    restartQuizz(){
        this.setState({
            questionEnCours: 0,
            answer: new Map(),
            questionComplete: false,
            quizzQuestions : this.selectQuestions(window.APP_DATA.quizz),
            score: 0,
            end: false,
        })
    }
    
    render(){
        const question = this.state.quizzQuestions[this.state.questionEnCours];
        const {startQuizz,questionComplete,isQuestionAnswered,end, mountedImg,layoutComplete}=this.state
        const nbQue = this.state.quizzQuestions.length;
        const img=`${window.PUBLIC_URL}/data/assets/bg/conclu.png`
       //.log("questions", question)
        return(
            <Slide 
            direction="left"
            in={true}
            mountOnEnter
            unmountOnExit
            timeout={700}
            onEntered={this.fireEndTransition}
            >
            <div className="content-cases">
                {startQuizz ?
                        <Tween from={{x:'100vw',opacity:0}} duration={1} stagger={0.5} ease="strong.out(0.2, 0.1)" onComplete={()=>this.setState({layoutComplete:true})} playState={mountedImg? PlayState.play :layoutComplete ? PlayState.reverse : PlayState.stop}>
                            <div className={"case-img-wrapper-fin"}>
                                <ResponsiveImage file={img} content={"IMAGE DE FIN"} title={"IMAGE DE FIN"} className="img-quizz-fin" type="png"/>
                             </div>
                            <div className= "cases-intro-final">
                                <h3>{window.APP_DATA.contents.QUIZZ.TITRE}</h3>
                                <p dangerouslySetInnerHTML={helpers.cleanHTML(window.APP_DATA.contents.QUIZZ.INCIPIT)}/>
                                <div className="btn-quiz-bar">
                                    <Button disableElevation color="primary" variant="contained" 
                                        onClick={this.downloadRessources} 
                                        className='button-files'>
                                            {helpers.findLabelInData("BTN-DOWNLOAD")}
                                    </Button>
                                    <Button variant="outlined" disableElevation color="primary" 
                                        onClick={this.startQuestion} 
                                        className='button-start'>
                                            {helpers.findLabelInData("QUIZZ-BTN")}
                                    </Button>
                                </div>
                            </div>
                        </Tween>
                        :
                        <Tween from={{x:'100vw',opacity:0}} duration={1} stagger={0.2} ease="strong.out(0.2, 0.1)" playState={mountedImg? PlayState.play : PlayState.stop}>
                        <div className={"case-img-wrapper-q-f"}>
                            <ResponsiveImage file={img} content={"IMAGE DE FIN"} title={"IMAGE DE FIN"}  className="img-quizz-fin" type="png"/>
                         </div>
                        <div className= {"cases-question"}>
                            {!end?this.displayQuestions(question):this.displayEndScreen()}
                            {
                                (this.state.slideQuestion && !end)&&
                                    <Button variant="outlined" disableElevation color="primary" 
                                        onClick={!questionComplete ?this.validateQuestion:this.changeQuestion}
                                        disabled={!isQuestionAnswered} 
                                        className='button-steps'>
                                            {!questionComplete?helpers.findLabelInData("VALIDATE-BTN"):helpers.findLabelInData("CONTINUE-BTN")}
                                    </Button>
                                
                            }
                   
                        </div>
                    </Tween>
                }
            </div>
            </Slide>
        )
    }
}

export default QuizzFinal;