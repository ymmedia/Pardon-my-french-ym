import React,{Component} from 'react';
import {Tween, PlayState} from 'react-gsap';
import "./images.scss";
import {Slide} from  '@material-ui/core/';
import {ClipImage} from './units/basics'
//import SwipeableViews from 'react-swipeable-views';
import Helpers from "../../helpers/helpers"
import divider from './../../images/divider.png';
import AudioPlayer from './audio/audioplayer'
let timer;

class Audio extends Component {
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
            feedbackPlayed:false
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
            feedbackPlayed:false
        })
        timer=setTimeout(function(){this.setState({mounted:true,displayImg:true});clearTimeout(timer)}.bind(this), 500);
    }
    handle_select(id){
        //const {items,imageActive}=this.state
        const hasVideo=this.props.content.items[this.state.imageActive].feedbacks[id].video==="none" ?true:false;
        this.setState({
            displayLib:hasVideo,
            mounted:false,
            displayImg:false,
            displayAnswer:true,
            activeAnswer:id
        }, this.getActivityComplete())
    }
    handle_continue(){
        const {items}=this.props.content
        const {imageActive,activeAnswer,feedbackPlayed}=this.state;
        if(items[imageActive].feedbacks[activeAnswer].value==="Correct"||items[imageActive].feedbacks[activeAnswer].value==="True"){
           this.imageForward()
        }else{
            this.setState({
                displayLib:false,
                mounted:false,
                displayImg:false,
                displayAnswer:false
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
        this.setState({
            imageActive: nextImage,
            displayImg:freeze,
            displayLib:last,
            mounted:false,
            displayAnswer:false,
            feedbackPlayed:false,
            activityComplete:last
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
    const {mounted,imageActive,displayImg,displayAnswer,activeAnswer,feedbackPlayed,activityComplete}=this.state;
    console.log("STATE CHANGED ",this.state.imageActive,activityComplete);
    //const lengthText=items[imageActive].content.length
    const audio=!displayAnswer?!activityComplete?items[imageActive].audio:this.props.content.CONCLUSION.audio:items[imageActive].feedbacks[activeAnswer].audio
    console.log(audio,'/////',mounted,"***",displayImg)

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
                             <p className='context' dangerouslySetInnerHTML={Helpers.cleanHTML(items[imageActive].question)}/>
                            </div>
                            <div className="wrapper-video">
                                {
                                    !activityComplete?
                                    <AudioPlayer  useSize={this.props.useSize} file={`${window.PUBLIC_URL}/data/${Helpers.removeBracket(audio)}`} handleFinish={()=>this.setState({displayLib:true})}/>
                                    :
                                    <div className="audio-fin-img">
                                        <ClipImage 
                                            img={`${window.PUBLIC_URL}/data/${Helpers.removeBracket(this.props.content.pic)}`} 
                                            width={'250px'} 
                                            viewed={false}
                                        />
                                    </div>
                                }
                            </div> 
                       <Tween  from={{ opacity: 0, y:'250px' }} delay={0} duration ={0.6} onComplete={()=>this.setState({displayImg:true})} ease="strong.out(0.2, 0.1)" playState={this.state.displayLib? PlayState.play :PlayState.stop}>  
                            <div className={`legend ${displayAnswer?items[imageActive].feedbacks[activeAnswer].value:""}`}>
                                <h3 
                                    
                                    dangerouslySetInnerHTML = {activityComplete?Helpers.cleanHTML(Helpers.findLabelInData("EXCIPIT-LABEL")):Helpers.cleanHTML(Helpers.findLabelInData("AUDIO-QUEST"))}
                                    className="question-lib"
                                />
                                {
                                    displayAnswer || activityComplete?
                                        <>    
                                            {
                                                activityComplete?
                                                this.props.content.CONCLUSION!==undefined&&<div className="feedbacks-roman" dangerouslySetInnerHTML={Helpers.cleanHTML(this.props.content.CONCLUSION)}/>
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
                                    items[imageActive].choices.map((item,id)=>{
                                        return(
                                            <div 
                                            key={id}
                                            varriant="outlined"
                                            onClick={(e)=>this.handle_select(id)} 
                                            className={`btn-choose-roman`}>
                                               {item.lib}
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
export default Audio;

