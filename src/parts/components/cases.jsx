import React,{Component} from 'react';
import "./cases.scss";
import {Grid, Paper,Card, CardContent, CardActions, Button, Radio, Switch,CardMedia, Slide, Fade} from  '@material-ui/core/';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import Helpers from "../../helpers/helpers"
import helpers from '../../helpers/helpers';
import {Tween, PlayState} from 'react-gsap';
import {ResponsiveImage,Notification,FileBtn} from '../components/units/basics'
//import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';

let timer;
class Cases extends Component{
    constructor (props){
        super(props)
        this.state={
            questionEnCours: 0,
            answer: this.initAnswer(0),
            questionComplete: false,
            feedbackSlide: false, 
            mounted:false,
            mountedImg:false,
            slide: true,
            slideQuestion:false,
            layoutComplete:false,
            multiPos:0,
            start:true,
            isQuestionAnswered:false,
            startFeedback:false,
            isTransitionLock:false,
            categories:this.initCat(0),
            files:this.initFiles(this.props.content.questions[0]),
            notification:false,
            displayDocs:false
        }
        this.validateQuestion=this.validateQuestion.bind(this);
        this.changeQuestion=this.changeQuestion.bind(this);
        this.fireEndImage=this.fireEndImage.bind(this)
        this.fireEndTransition=this.fireEndTransition.bind(this)
        this.startQuestion=this.startQuestion.bind(this)
        this.launchFeedback=this.launchFeedback.bind(this)
        this.displayDocs=this.displayDocs.bind(this);
    }
    UNSAFE_componentWillReceiveProps(newProps){
        if(newProps.content!==this.props.content){
            this.initState();
            if(this.interval===null){
                this.interval=setInterval(this.animCase,3000)
            }
        }

    }
    componentDidMount(){
       if(this.state.isMulti){
           this.interval=setInterval(this.animCase,3000)
       }
    }

    initState(){
        this.setState({questionEnCours: 0,
            questionComplete: false,
            imageFade: false,
            feedbackSlide: false, 
            multiPos:0,
            mounted:true,
            start:true,
            slideQuestion:false,
            layoutComplete:false,
            isQuestionAnswered:false,
            startFeedback:false,
            isTransitionLock:false,
            files:this.initFiles(this.props.content.questions[0]),
            notification:false,
            displayDocs:false
            })
            timer=setTimeout(function(){
                this.setState({mounted:true,mountedImg:true,imageFade:true,slide:true,categories:this.initCat(0),answer: this.initAnswer(0),});
                clearTimeout(timer);
                if(this.state.isMulti){
                    //console.log("PUTAIN DE CHANGE CASE MULTI")
                    this.interval=setInterval(this.animCase,3000)
                }else{
                    //console.log("NO MULTI, NO PARTY (CASE REMIX)")
                }
            }.bind(this), 500);
    }
    initFiles(pContent){
        //const aFiles=[]
        //console.log("FILES-->",pContent)
        if(pContent.files!==undefined){
           return helpers.processFiles(pContent.files)
        }else
            return []
    }
    displayDocs(){
        //console.log("JE DOIS AFFICHER LES DOCUMENTS")
        this.setState({displayDocs:true})
    }
    launchFeedback(){
        this.setState({slideQuestion:false,isTransitionLock:true},
           ()=>{
            timer=setTimeout(
                function(){
                    this.setState({startFeedback:true})
                    clearTimeout(timer)
                }.bind(this),500)
           }
        )
        
        
    }
    fireEndTransition(){
        this.setState({mounted:true})
    }
    fireEndImage(){
        this.setState({mountedImg:true})
    }
    isMulti(){
        if(this.props.content.CASE.split('@@@').length>1){
            return true;
        }else{return false}
    }
    isQuestionMultiple(){
        const question=this.props.content.questions[this.state.questionEnCours]
        let isMultiple=0
        question.items.forEach(item=>{
            if(item.action==="true")
            isMultiple++
        })
        return (isMultiple>1 ?true :false)
    }
    handleClick(e,indice, value){
        e.preventDefault();
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
    handleClickMulti(e,question,item){
        e.preventDefault();
        let mapCopy = this.state.answer;
        if(this.state.answer[question].has(item)){
            mapCopy[question].delete(item);
        }
        else {
            mapCopy[question].set(item, true);
            //console.log(item)
        }
        this.setState({
            answer: mapCopy,
            isQuestionAnswered:true
        });    

    }
    startQuestion(){
        this.setState({mountedImg:false},
            ()=>timer=setTimeout(function(){this.setState({start:false,slideQuestion:true,mountedImg:true});clearTimeout(timer)}.bind(this), 2000)
            )
    }
    changeQuestion(){
        const indice = this.state.questionEnCours + 1;
        this.setState({
            imageFade: true,
            slide: true,
            mountedImg:false,
            multiPos:0,
            slideQuestion:false,
            layoutComplete:false,
            isQuestionAnswered:false,
            startFeedback:false,
            isTransitionLock:false,
        })
     
        if(indice < this.props.content.questions.length){
            setTimeout(function(){
                this.setState({
                    questionEnCours: indice,
                    questionComplete: false,
                    answer: this.initAnswer(indice),
                    imageFade: true,
                    mountedImg:true,
                    mounted:true,
                    slide: true,
                    categories:this.initCat(indice),
                    files:this.initFiles(this.props.content.questions[indice]),
                    notification:false,
                    displayDocs:false
                });
            }.bind(this), 1000)
            if(this.state.isMulti){
                //.log("PUTAIN DE CHANGE QUESITON MULTI")
                this.interval=setInterval(this.animCase,3000)
            }else{
               // console.log("NO MULTI, NO PARTY")
            }
            //clearTimeout(identifier)
        }else{
            this.props.handleNext();
        }
    }
   
    validateQuestion(){
        let result;  
        result=true;       
        //if only one is false, the feedback will be false
        //console.log(this.state.answer,this.props.content.questions[this.state.questionEnCours])
        if(this.state.categories.length>0){
            const question=this.props.content.questions[this.state.questionEnCours];
            this.state.answer.forEach((item,i)=>{
                //console.log(String(question.items[i].file).split(';'));
                const reps=String(question.items[i].file).split(';')
                for(let j=0;j<this.state.categories.length;j++){
                    if(reps.find(el=>Number(el)===j)!==undefined){
                        console.log(j,reps, reps.find(el=>Number(el)===j), item.has(j))
                            if(!item.has(j))
                                result=false
                    }else{
                        if(item.has(j))
                            result=false
                    }
                }
            })
            //console.log("résults !!! ", result)
        }else{
            for (let v of this.state.answer) {
                //console.log(v)
                if (v[1] === "false") { 
                  
                    result = false; 
                }
            }
            if(result &&this.state.answer.length!==this.props.content.questions[this.state.questionEnCours].items.length){
                this.props.content.questions[this.state.questionEnCours].items.forEach((item,i)=>{
                    //console.log("item", item.action)
                    if(item.action==="true"){
                        if(!this.state.answer.has(i)){
                            result=false;
                        }   
    
                    }
                })
            }
        }
        this.setState({
            questionComplete: true,
            questionFeedback: result
        })
    }
    initAnswer(indice){
        const question=this.props.content.questions[indice]
        if(question.categories!==undefined){
            const answer=[]
            question.items.forEach(cat=>{
                answer.push(new Map())
            })
            return answer;
        }
        else{
            //console.log("SINGLE MAP, NOT SINGLE MALT")
            return new Map();
        }
           
    }
    initCat(indice){
        const question=this.props.content.questions[indice]
        //console.log("the question, judge !!! ",this.props.content.questions)
        if(question.categories!==undefined){
           // console.log("categories-->", question.categories.split(';'))
            return question.categories.split(';');
        }else{
            return [];
        }
    }
    isSimpleQuestion(){
        const question=this.props.content.questions[this.state.questionEnCours]
        if(question.categories!==undefined){
           
            return false;
        }else
            return true;
    }
    slideFeedback(){
        console.log('here');
        this.setState({
            x : !this.state.x
        })
    }
    getFeedback(pResult){
        //console.log("result",pResult)
        if(this.props.content.questions[this.state.questionEnCours].feedbacks.length===1)
            return  this.props.content.questions[this.state.questionEnCours].feedbacks[0]
        if(pResult)
            return  this.props.content.questions[this.state.questionEnCours].feedbacks[0]
        else 
            return this.props.content.questions[this.state.questionEnCours].feedbacks[1];
    }
    displayFeedBack(){
        let feedback = this.getFeedback(this.state.questionFeedback);
        let strFeedback = JSON.stringify(feedback.content).length;
        const enterCallback=()=>{this.setState({notification:true});console.log("SLIDE ENDED !!!",this.state.notification)}
      return(
        
            <Slide direction="left" in={true} mountOnEnter unmountOnExit timeout={1500} onEntered={enterCallback}>
                    <div onClick={(e)=>{e.preventDefault()}} dangerouslySetInnerHTML={Helpers.cleanHTML(feedback.content)} className="c-feedback" />
            </Slide>
        )
    }
    displayIcons(i){
        if(this.state.answer.has(i)){
            if(this.props.content.questions[this.state.questionEnCours].items[i].action==="true")
             return <CheckCircleOutlinedIcon className="green"/>
            else
            return <HighlightOffOutlinedIcon className="red"/>
        }else{
            if(this.props.content.questions[this.state.questionEnCours].items[i].action==="true")
            return <CheckCircleOutlinedIcon  className="green"/>
        }

    }
    displayIconsMulti(i,j){
        const question=this.props.content.questions[this.state.questionEnCours]
        const reps=String(question.items[i].file).split(';')
        if(this.state.answer[i].has(j)){
            if(reps.find(el=>Number(el)===j)!==undefined)
             return <CheckCircleOutlinedIcon className="green"/>
            else
            return <HighlightOffOutlinedIcon className="red"/>
        }else{
            if(reps.find(el=>Number(el)===j)!==undefined)
            return <CheckCircleOutlinedIcon  className="green"/>
        }

    }
   getchecker(i){
       if(this.isQuestionMultiple())
        return <Switch value={i} color="primary" checked={this.state.answer.has(i)}/>  
        else
        return <Radio value={i} color="primary" checked={this.state.answer.has(i)}/>  
   }

    displayQuestions(question){
        if(!this.state.slideQuestion&&!this.state.isTransitionLock){
            setTimeout(function(){
                this.setState({
                    slideQuestion: true
                });
            }.bind(this), 200)
        }
        if(this.isSimpleQuestion()){
            return this.displaySimpleQuestion(question)
        }else{
            return this.displayAssoQuestion(question)
        }
    }
    displayAssoQuestion(question){
        return(
            <Slide 
            direction={'left'}
            in={this.state.slideQuestion}
            mountOnEnter unmountOnExit>
            <div className={this.state.categories.length>3 ? "quizz-viewer wide-viewer" : "quizz-viewer"}>
                {
                   
                    question.items.map((item,i)=>{
                        return(
                        <div 
                            key={i} 
                            className={this.state.categories.length>3 ? "cat-item wide-item" : "cat-item"} 
                            > 
                              <div className={this.state.categories.length>3 ? "wide-lib" : "regular-lib"} dangerouslySetInnerHTML={Helpers.cleanHTML(item.content)}/>
                            <div className={this.state.categories.length>3 ?"categories wide-c" :"categories"}>
                              
                                {
                                    this.state.categories.map((cat,j)=>{
                                        return(
                                            <div 
                                                className={this.state.answer[i].has(j) ? this.state.categories.length>3 ? "btn-categories c-4 checked": this.state.categories.length<3 ? "btn-categories C-2 checked" :"btn-categories checked" :this.state.categories.length>3 ? "btn-categories c-4" : this.state.categories.length<3 ?"btn-categories C-2" :"btn-categories"} 
                                                key={j} 
                                                value={j}
                                                onClick={!this.state.questionComplete?(e) => this.handleClickMulti(e,i,j):null}
                                            >
                                                {this.state.questionComplete&&this.displayIconsMulti(i,j)}
                                                {cat}
                                            </div> 
                                        )
                                    }

                                    )
                                }
                            </div>
                        </div>
                        )
                    })
                }
               
            </div>  
        </Slide>
        )
    }
    displaySimpleQuestion(question){
        return (
            <Slide 
                direction={'left'}
                in={this.state.slideQuestion}
                mountOnEnter unmountOnExit>
                <div className="quizz-viewer">
                    {
                        question.items.map((item,i)=>{
                            return(
                            <div 
                                key={i} 
                                className={this.state.answer.has(i)?"quizz-item selected-item":"quizz-item"} 
                                onClick={!this.state.questionComplete?(e) => this.handleClick(e,i, item.action):null}
                                >
                                {this.state.questionComplete&&this.displayIcons(i)}
                                {this.getchecker(i)}
                                
                                <p>{item.content}</p>
                            </div>
                            )
                        })
                    }
                   
                </div>  
            </Slide>
        )
    }
    hasDefinitions(){
        if(this.getFeedback(this.state.questionFeedback)===undefined){
            return ''
        }else{
            console.log("GET FEEDBACK : ",this.getFeedback(this.state.questionFeedback))
        }
           
        if(this.getFeedback(this.state.questionFeedback).content.includes('tooltip'))
            return helpers.findLabelInData("FEED-MSG")
        else
            return ''
    }
    render(){
        const content = this.props.content;
        const img=`${window.PUBLIC_URL}/${content.file}`
        const question = this.props.content.questions[this.state.questionEnCours];
        const {mounted, questionComplete,mountedImg,start,layoutComplete,isQuestionAnswered,startFeedback,files}=this.state;
        const feedbackTitle=`${helpers.findLabelInData("FEED-TITLE")} ${this.hasDefinitions()}`
        //const img1=`${window.PUBLIC_URL}/data/assets/bg/cover.png`;
        //console.log("NOTIFICATIONS ", this.state.notification, files)
        return(
            <Slide 
            direction="left"
            in={this.state.slide}
            mountOnEnter
            unmountOnExit
            timeout={700}
            onEntered={this.fireEndTransition}
            >
                    <div className="content-cases">
                    {this.state.displayDocs&&
                                <div className="container-doc">
                                    <Tween from={{ x: '+30px', opacity:'0' }} duration={1} stagger={0.5} onComplete={()=>this.setState({notification:true})} ease="elastic.out(0.2, 0.1)" playState={this.state.mounted? PlayState.play :PlayState.stop}>
                                        {
                                            this.state.files.map((file,i)=>{
                                                return(
                                                    <div key={i} > 
                                                        <FileBtn file={file}/>
                                                    </div>
                                                )
                                            })
                                        }
                                    </Tween>
                                </div>
                            }  
                        <Tween to={{opacity:0.1,scale:1.3}} duration={1} ease="easy.in(0.2, 0.1)" onComplete={()=>this.setState({mountedImg:true})} playState={mounted? PlayState.play :PlayState.stop}>
                            <div className="bg-case" style={{backgroundImage:`url(${this.props.bgImage})`}}>
                            </div>
                        </Tween>
                        {start ?
                        <Tween from={{x:'100vw',opacity:0}} duration={1} stagger={0.5} ease="strong.out(0.2, 0.1)" onComplete={()=>this.setState({layoutComplete:true})} playState={mountedImg? PlayState.play :layoutComplete ? PlayState.reverse : PlayState.stop}>
                            <div className={"case-img-wrapper"}>
                             <ResponsiveImage file={img} content={content.titre} title={content.titre} type="png"/>
                             </div>
                            <div className= "cases-intro">
                                <p dangerouslySetInnerHTML={helpers.cleanHTML(content.INCIPIT)}/>
                                <Button variant="outlined" disableElevation color="primary" 
                                    onClick={this.startQuestion} 
                                    className='button-steps'>
                                        {content.ACTION}
                                </Button>
                            </div>
                        </Tween>
                        :
                        <Tween from={{x:'100vw',opacity:0}} duration={1} stagger={0.2} ease="strong.out(0.2, 0.1)" playState={mountedImg? PlayState.play : PlayState.stop}>
                        <div className={"case-img-wrapper-q"}>
                            <ResponsiveImage file={img} content={content.titre} title={content.titre} type="png"/>
                         </div>
                            <div className= {this.state.categories.length>3?"cases-question wide-question":"cases-question"}>
                          {/*   <h3>{!startFeedback?question.lib:feedbackTitle}</h3> */}
                          {
                              !startFeedback&&<h3>{question.lib}</h3>
                          }
                            {!startFeedback?this.displayQuestions(question):this.displayFeedBack()}
                         
                            {(startFeedback)?
                                <Tween from={{x:'100vw',opacity:0}} duration={1.5} stagger={0.2} ease="strong.out(0.2, 0.1)" playState={startFeedback? PlayState.play : PlayState.stop}>
                                    <Button variant="outlined" disableElevation color="primary" 
                                        onClick={this.changeQuestion}
                                        disabled={!isQuestionAnswered} 
                                        className='button-steps'>
                                            {helpers.findLabelInData("CONTINUE-BTN")}
                                    </Button>
                                </Tween>
                                :
                                this.state.slideQuestion&&
                                    <Button variant="outlined" disableElevation color="primary" 
                                        onClick={!questionComplete ?this.validateQuestion:this.launchFeedback}
                                        disabled={!isQuestionAnswered} 
                                        className='button-steps'>
                                            {!questionComplete?helpers.findLabelInData("VALIDATE-BTN"):helpers.findLabelInData("BTN-ANALYSE")}
                                    </Button>
                                
                            }
                        </div>
                      
                    </Tween>
                        }
                      {
                        (files.length>0&&this.state.notification)&&
                        <Notification 
                            fired={this.state.notification}
                            text={`Vous avez débloqué <b>${files.length} nouvelles ressources</b>. Consultez les avant de continuer !`}
                            callBack={this.displayDocs}
                        />
                        }   
                    </div>
            </Slide>
        )
    }
}
export default Cases;

const backup=()=>{
    return(
       <Grid container spacing={3}>
             {/*        <Grid item xs={8} style={{height:'60vh'}}>
                        <Card className="cases-img-bloc">
                            <Fade in={this.state.imageFade} timeout={1500} onEntered={this.fireEndImage}>
                                <CardMedia className="cases-img" image={img} titre="blabla">
                                </CardMedia>                        
                        </Fade>  
                        </Card>
                        <Card className="cases-case-lib">
                            <CardContent>
                                <motion.p initial='closed' animate={mountedImg? 'open' :'closed'} variants={params} dangerouslySetInnerHTML={helpers.cleanHTML(this.returnCaseContent())}/>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card className="content-cases">
                            {displayQ&&
                            <Slide 
                                direction={'left'}
                                in={mountedImg}
                                mountOnEnter unmountOnExit>
                                <CardContent className="cases-viewer">
                                    <div dangerouslySetInnerHTML={Helpers.cleanHTML(question.lib)} className="cases-comment"/>
                                    {this.state.questionComplete ? this.displayFeedBack() :                          
                                        question.items.map((item,i)=>{
                                            return(
                                            <Paper 
                                                key={i} 
                                                className={(item.content.length < 5 ? "short-text" : "") + " cases-item"} 
                                                elevation={0} 
                                                onClick={() => this.handleClick(i, item.action)}>
                                                <Radio value={i} checked={this.state.answer.has(i)}/> 
                                                <p dangerouslySetInnerHTML={helpers.cleanHTML(item.content)}/>
                                            </Paper>
                                            )
                                        })
                                    }
                                </CardContent>       
                             
                            </Slide>  
                            }
                            {this.state.slide ? 
                                <CardActions className="steps-bloc-btn">
                                    <Button variant="contained" disableElevation color="primary" 
                                        disabled={this.state.answer.size === 0 ? true : false} 
                                        onClick={this.state.questionComplete ? this.changeQuestion : this.validateQuestion} 
                                        className='button-steps'>{this.state.questionComplete ? "CONTINUER" : "VALIDER"}
                                    </Button>
                                </CardActions>
                                :
                                null
                            }
                        </Card>
                    </Grid>
                    */}
            </Grid>                
    )
}