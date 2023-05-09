import React,{Component} from 'react';
import {Tween, PlayState} from 'react-gsap';
import "./images.scss";
import {Slide} from  '@material-ui/core/';
import {ClipImage} from './units/basics'
//import SwipeableViews from 'react-swipeable-views';
import Helpers from "../../helpers/helpers"
import divider from './../../images/divider.png';
import ApiPlayer from './units/apiPlayer'
import userStore from '../../stores/UserStore';
let timer;

class Video extends Component {
    constructor (props){
        super(props)
         this.state={
            imageActive:0,
            activityComplete:false,
            displayLib:false,
            mounted:false,
            displayImg:false,
            displayAnswer:false,
            activeAnswer:0,
            feedbackPlayed:false,
            choiceSelected:0,
            redoAnswer:false,
            questionEnCours:this.initQuestion(0)
        }
        this.imageBackward=this.imageBackward.bind(this);
        this.imageForward=this.imageForward.bind(this);
        this.handleStepChange=this.handleStepChange.bind(this);
        this.fireEndTransition=this.fireEndTransition.bind(this);
        this.onVideoEnd=this.onVideoEnd.bind(this)
        
    }
    onVideoEnd() {
        console.log(" VIDEO ENDED");
        this.setState({ finished: true,displayLib:true });
    }
    initQuestion(id){
        return this.props.content.items[id].choices.sort((a, b) => 0.5 - Math.random())
    }
    componentDidUpdate(prevProps){
        console.log("UPDATE !!!")
        console.log(prevProps)
        if(prevProps.content!==this.props.content){
            this.initState()
        }

    }
    initState(){
        console.log("JE CHANGE D'ACTIVITÉ")
        this.setState({imageActive:0,
            activityComplete:false,
            mounted:false,
            displayImg:false,
            displayAnswer:false,
            activeAnswer:0,
            feedbackPlayed:false,
            choiceSelected:0,
            redoAnswer:false,
            questionEnCours:this.initQuestion(0)
        })
        timer=setTimeout(function(){this.setState({mounted:true,displayImg:true});clearTimeout(timer)}.bind(this), 500);
    }
    handle_select(id, selected){
        //const {items,imageActive}=this.state
        console.log("ID : ",id, " //// ",selected)
        const hasVideo=this.props.content.items[this.state.imageActive].feedbacks[id].video==="none" ?true:false;
        this.setState({
            displayLib:hasVideo,
            mounted:false,
            displayImg:false,
            displayAnswer:true,
            activeAnswer:id,
            choiceSelected:selected,
            redoAnswer:false,
        }, this.getActivityComplete())
    }
    hasVideo(){
        return this.props.content.items[this.state.imageActive].feedbacks[this.state.activeAnswer].video==="none" ?true:false;
    }
    handle_continue(){
        const {items}=this.props.content
        const {imageActive,activeAnswer,feedbackPlayed}=this.state;
        if(items[imageActive].feedbacks[activeAnswer].value==="Correct" || items[imageActive].feedbacks[activeAnswer].value==="True"){
           this.imageForward()
        }else{
            this.setState({
                displayLib:false,
                mounted:false,
                displayImg:false,
                displayAnswer:false,
                choiceSelected:0,
                redoAnswer:true,
                questionEnCours:this.initQuestion(this.state.imageActive)
            }, this.getActivityComplete())
        }
    }
    imageForward(){
        const {items} = this.props.content;
        //console.log("IMAGE ACTIVE", this.state.imageActive)
        let nextImage;
        let freeze=false;
        let last=false;
        if(this.state.imageActive < items.length - 1){
            nextImage = this.state.imageActive + 1
        }else{
            nextImage = this.state.imageActive;
            freeze=true;
            last=true
        }
        if(last){
            if(this.props.content.CONCLUSION.lib===undefined||this.props.content.CONCLUSION.lib.length<2){
                this.props.handleNext();
                return;
            }
        }
        this.setState({
            imageActive: nextImage,
            displayImg:freeze,
            displayLib:false,
            mounted:false,
            displayAnswer:false,
            feedbackPlayed:false,
            activityComplete:last,
            choiceSelected:0,
            redoAnswer:false,
            questionEnCours:this.initQuestion(nextImage)
        },this.getActivityComplete)
    }
    imageBackward(){
        const {items} = this.props.content;
        //console.log("IMAGE PRÉCÉDENTE")
        let nextImage;
        if(this.state.imageActive > 0){
            nextImage = this.state.imageActive-1
        }else{
            nextImage=items.length-1;
        }
        this.setState({
            imageActive: nextImage,
            displayImg:false,
            displayLib:false,
            mounted:false
        },this.getActivityComplete());
        
    }
    fireEndTransition(){
        this.setState({mounted:true})
    }
    handleStepChange(step){
        this.setState({
            imageActive:step
        })
    }
    getActivityComplete(){
        const { imageActive } = this.state;
        console.log("FIRED!!! ",imageActive)
        timer=setTimeout(function(){this.setState({mounted:true});clearTimeout(timer)}.bind(this), 500);
        /* if(this.props.content.items !== undefined){
            //console.log(imageActive, this.props.content.items.length)
            if(imageActive === this.props.content.items.length-1){
                this.setState({
                    activityComplete: true
                })
            }else{
                this.setState({
                    activityComplete: false
                })
            }
        }  */
    }
isActivityComplete(){
    const { imageActive } = this.state;
    if(this.props.content.items !== undefined){
        if(imageActive===this.props.content.items.length-1)
        return true
            else
        return false
    }
}
  displayImageComplete(){
      this.setState({displayLib:true})
  }
  render(){
    const {items}=this.props.content;
    const {mounted,imageActive,displayImg,displayAnswer,activeAnswer,feedbackPlayed,activityComplete,questionEnCours,redoAnswer}=this.state;
    console.log("STATE CHANGED ",this.state.imageActive,activityComplete);
    //const lengthText=items[imageActive].content.length
    const video=!displayAnswer?!activityComplete?items[imageActive].video:this.props.content.CONCLUSION.video:items[imageActive].feedbacks[activeAnswer].video
    const skipConclusion=activityComplete ? video.indexOf("assets")!==-1 ?true :false :false;
    console.log(video,'/////',mounted,"***",displayImg,"skip conclusion :",skipConclusion, " ::: ",video.indexOf("assets"))

    return(
        <Slide 
            direction="left"
            in={true}
            mountOnEnter
            unmountOnExit
            timeout={700}
            onEntered={this.fireEndTransition}
            >
                <Tween  from={{ opacity: 0, x:'-10px' }} duration ={0.5} onComplete={()=>this.setState({displayImg:true})} ease="easy.in(0.2, 0.1)" playState={this.state.mounted? PlayState.play :PlayState.stop}>  
                    <div className={this.props.useSize.isVerySmall ? 'content-images content-images-small ' : 'content-images'}>
                            <div className='titre-images'>
                            <h3 className='underline' dangerouslySetInnerHTML={Helpers.cleanHTML(this.props.content.TITRE)}/>
                             {/* <img src={divider} alt='divider' style={{width:'200px',height:'1px'}}/> */}
                            </div>
                            <div className="wrapper-video">
                                {
                                    video!==undefined && !skipConclusion?
                                    <ApiPlayer id={video} className="vid-player" isReplay={redoAnswer} isCaption={true} lng={userStore.getUser().lng} onEndedVideo={this.onVideoEnd} />
                                    :
                                    <div className="audio-fin-img">
                                    <ClipImage 
                                        img={`${window.PUBLIC_URL}/data/${Helpers.removeBracket(this.props.content.CONCLUSION.video)}`} 
                                        width={'250px'} 
                                        viewed={false}
                                    />
                                </div>
                                }
                            </div> 
                       <Tween  from={{ opacity: 0, y:'250px' }} delay={0} duration ={0.6} onComplete={()=>this.setState({displayImg:true})} ease="strong.out(0.2, 0.1)" playState={this.state.displayLib || skipConclusion? PlayState.play :video===undefined?PlayState.play:PlayState.stop}>  
                            <div className={`legend ${displayAnswer?items[imageActive].feedbacks[activeAnswer].value:""}`}>
                                <h3 
                                    
                                    dangerouslySetInnerHTML = {activityComplete?Helpers.cleanHTML(Helpers.findLabelInData("EXCIPIT-LABEL")):Helpers.cleanHTML(items[imageActive].question)}
                                    className="question-lib"
                                />
                                {
                                    displayAnswer || activityComplete?
                                        <>    
                                            {
                                                activityComplete?
                                                this.props.content.CONCLUSION.lib!==undefined&&<div className="feedbacks-roman" dangerouslySetInnerHTML={Helpers.cleanHTML(this.props.content.CONCLUSION.lib)}/>
                                                :
                                                <div className="feedbacks-roman" dangerouslySetInnerHTML={Helpers.cleanHTML(items[imageActive].feedbacks[activeAnswer].lib)}/>
                                            }
                                            <div 
                                                varriant="outlined"
                                                onClick={activityComplete?this.props.handleNext:(e)=>this.handle_continue()} 
                                                className={`btn-choose-roman`}>
                                                    {Helpers.findLabelInData("BTN-NEXT")}
                                            </div>
                                        </>
                                    :
                                    questionEnCours.map((item,id)=>{
                                        return(
                                            <div 
                                            key={id}
                                            varriant="outlined"
                                            onClick={(e)=>this.handle_select(parseInt(item.value), id)} 
                                            className={`btn-choose-roman`}>
                                                <span dangerouslySetInnerHTML={Helpers.cleanHTML(item.lib)}/>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        </Tween>
                    </div>
                </Tween>
                </Slide>
        )
    }
}
export default Video;

