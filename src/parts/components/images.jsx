import React,{Component} from 'react';
import {Tween, PlayState} from 'react-gsap';
import "./images.scss";
import {Slide} from  '@material-ui/core/';
import {ResponsiveImage} from './units/basics'
//import SwipeableViews from 'react-swipeable-views';
import Helpers from "../../helpers/helpers"
import divider from './../../images/divider.png';
let timer;

class Images extends Component {
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
            duration:1,
            questionEnCours:this.initQuestion(0)
        }
        this.imageBackward=this.imageBackward.bind(this);
        this.imageForward=this.imageForward.bind(this);
        this.handleStepChange=this.handleStepChange.bind(this);
        this.fireEndTransition=this.fireEndTransition.bind(this);
    }
    componentDidUpdate(prevProps){
        //console.log("UPDATE !!!")
        //console.log(prevProps)
        if(prevProps.content!==this.props.content){
            this.initState()
        }

    }
    initQuestion(id){
        return this.props.content.items[id].choices.sort((a, b) => 0.5 - Math.random())
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
            questionEnCours:this.initQuestion(0),
            choiceSelected:0,
            duration:1
        })
        timer=setTimeout(function(){this.setState({mounted:true,displayImg:true});clearTimeout(timer)}.bind(this), 500);
    }
    handle_select(id, selected){
    
        const {imageActive,questionEnCours}=this.state;
        console.log("ID : ",id, " image en cours : ",imageActive, ": ", questionEnCours[id])
        const fPlayed=(questionEnCours[id].images===undefined || questionEnCours[id].images==="none") ? true :false
        this.setState({
            displayLib:false,
            mounted:false,
            displayImg:false,
            displayAnswer:true,
            feedbackPlayed:fPlayed,
            activeAnswer:id,
            choiceSelected:selected,
            duration:1
        }, this.getActivityComplete())
    }
    handle_continue(){
        const {items}=this.props.content
        const {imageActive,activeAnswer,feedbackPlayed}=this.state;
        if(items[imageActive].feedbacks[activeAnswer].value==="Correct"|| items[imageActive].feedbacks[activeAnswer].value==="True"){
            console.log("cas --- 1", this.state);
            if(items[imageActive].feedbacks[activeAnswer].images==="none"){
                this.imageForward()
            }else{
                if(feedbackPlayed){
                    this.imageForward()
                }else{
                    this.setState({
                        displayLib:false,
                        mounted:false,
                        displayImg:false,
                        feedbackPlayed:true,
                        duration:1
                    }, this.getActivityComplete())
                }
            }
        }else{
            console.log("cas --- 2", this.state);
            if(items[imageActive].feedbacks[activeAnswer].images==="none"){
                this.setState({
                    displayLib:false,
                    mounted:false,
                    displayImg:false,
                    displayAnswer:false
                }, this.getActivityComplete())
            }else{
                if(feedbackPlayed){
                    this.setState({
                        displayLib:false,
                        mounted:false,
                        displayImg:false,
                        displayAnswer:false,
                        feedbackPlayed:false,
                        duration:0.05
                    }, this.getActivityComplete())
                }else{
                    this.setState({
                        displayLib:false,
                        mounted:false,
                        displayImg:false,
                        feedbackPlayed:true,
                        duration:1
                    }, this.getActivityComplete())
                }
            }
        }
    }
    imageForward(){
        const {items} = this.props.content;
        let nextImage;
        let freeze=false;
        let last=false;
        console.log('items',items)
        if(this.state.imageActive < items.length - 1){
            nextImage = this.state.imageActive + 1
        }else{
            nextImage = this.state.imageActive;
            freeze=true;
            last=true
        }

        if(last){
            if(this.props.content.CONCLUSION && this.props.content.CONCLUSION.length<2){
                this.props.handleNext();
                return
            }
        }
        console.log("IMAGE FORWAE", freeze, last)
        this.setState({
            imageActive: nextImage,
            displayImg:freeze, 
            displayLib:last,
            mounted:false,
            displayAnswer:false,
            feedbackPlayed:false,
            activityComplete:last,
            questionEnCours:this.initQuestion(nextImage),
            choiceSelected:0,
            duration:1
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
            mounted:false,
            duration:1
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
            if(imageActive === this.props.content.items.length - 1){
                this.setState({
                    activityComplete: true
                })
            }else{
                this.setState({
                    activityComplete: false
                })
            }
        } */ 
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
    const {mounted,imageActive,displayImg,displayLib,displayAnswer,activeAnswer,feedbackPlayed,activityComplete,questionEnCours,choiceSelected}=this.state;
    console.log("STATE CHANGED ",this.state.imageActive);
    //const lengthText=items[imageActive].content.length
    const tabImg=!displayAnswer?Helpers.stripArray(items[imageActive].images): feedbackPlayed?Helpers.stripArray(items[imageActive].feedbacks[activeAnswer].images) : Helpers.stripArray(items[imageActive].choices[activeAnswer].images);
    console.log(tabImg,'/////',mounted,"***",displayImg)

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
                            <div className="img-masked" style={{height:this.props.useSize.isVerySmall ? '260px' : ''}} >
                                <Tween  from={{ scale: '1.05', opacity:'0' }} stagger={this.state.duration*1.6} duration={this.state.duration}  ease="easy.in(0.2, 0.1)" playState={this.state.displayImg? PlayState.play :PlayState.stop} onComplete={()=>this.setState({displayLib:true})}>  
                                    { !activityComplete?
                                        tabImg.map((image,id)=>{
                                            return(
                                                <div className="img-container" key ={id} >
                                                    <ResponsiveImage file={`${window.PUBLIC_URL}/data/${image}`} content={image} title={image} type="png" className={this.props.useSize.isVerySmall ? 'img-narrative isSmall' : "img-narrative"} />
                                                </div>
                                            )
                                        })
                                        :
                                        <div className="img-container" >
                                        </div>
                                   }
                                 </Tween>     
                            </div> 
                       <Tween  from={{ opacity: 0, y:'250px' }} delay={1.5} duration ={0.6} onComplete={()=>this.setState({displayImg:true})} ease="strong.out(0.2, 0.1)" playState={this.state.displayLib || activityComplete? PlayState.play :PlayState.stop}>  
                            <div className={`legend ${feedbackPlayed?items[imageActive].feedbacks[activeAnswer].value:""}`} style={{position:this.props.useSize.isVerySmall ? 'relative' : 'absolute'}}>
                                <h3 
                                    
                                    dangerouslySetInnerHTML = {activityComplete?Helpers.cleanHTML(Helpers.findLabelInData("EXCIPIT-LABEL")):displayAnswer?Helpers.cleanHTML(questionEnCours[choiceSelected].lib):Helpers.cleanHTML(items[imageActive].question)}
                                    className="question-lib"
                                />
                                {
                                    displayAnswer || activityComplete?
                                        <>
                                            {
                                                feedbackPlayed &&
                                                <div className="feedbacks-roman" dangerouslySetInnerHTML={Helpers.cleanHTML(items[imageActive].feedbacks[activeAnswer].lib)}/>
                                            }
                                            {
                                                activityComplete &&
                                                <div className="feedbacks-roman" dangerouslySetInnerHTML={Helpers.cleanHTML(this.props.content.CONCLUSION)}/>
                                            }
                                            <div 
                                                varriant="outlined"
                                                onClick={activityComplete ? this.props.handleNext:(e)=>this.handle_continue()} 
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
                                            onClick={(e)=>this.handle_select(parseInt(item.value),id)} 
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
export default Images;

