import React,{Component} from 'react';
import {Tween, PlayState} from 'react-gsap';
import "./cases.scss";
import {Button,Slide} from  '@material-ui/core/';
//import SwipeableViews from 'react-swipeable-views';
import Helpers from "../../helpers/helpers"


let timer;

class Content extends Component {
    constructor (props){
        super(props)
         this.state={
            imageActive:0,
            activityComplete:false,
            displayLib:false,
            mounted:false,
            layoutcomplete:false
        }
        this.imageForward=this.imageForward.bind(this);
        this.handleContinue=this.handleContinue.bind(this);
        this.handleStepChange=this.handleStepChange.bind(this);
        this.fireEndTransition=this.fireEndTransition.bind(this);
    }
    UNSAFE_componentWillReceiveProps(prevProps){
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
            layoutComplete:false
        })
        timer=setTimeout(function(){this.setState({mounted:true,displayImg:true});clearTimeout(timer)}.bind(this), 500);
    }
    handleContinue(){
        this.setState({displayImg:false},
            ()=>timer=setTimeout(function(){this.imageForward();clearTimeout(timer)}.bind(this), 2000)
            )
    }
    imageForward(){

        const {items} = this.props.content;
        //console.log("IMAGE ACTIVE", this.state.imageActive)
        let nextImage;
        if(this.state.imageActive < items.length - 1){
            nextImage = this.state.imageActive + 1
        }else{
            nextImage = 0;
        }
        this.setState({
            imageActive: nextImage,
            displayImg:false,
            displayLib:false,
            mounted:false,
            layoutComplete:false
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
        this.setState({mounted:true,displayLib:true})
    }
    handleStepChange(step){
        this.setState({
            imageActive:step
        })
    }
    getActivityComplete(){
        const { imageActive } = this.state;
        console.log("FIRED!!!")
        timer=setTimeout(function(){this.setState({mounted:true});clearTimeout(timer)}.bind(this), 500);
        if(this.props.content.items !== undefined){
            //console.log(imageActive, this.props.content.items.length)
            if(imageActive === this.props.content.items.length - 1){
                this.setState({
                    activityComplete: true
                })
            }
        }
    }
  displayImageComplete(){
      this.setState({displayLib:true})
  }
  render(){
    const content=this.props.content;
    const {items}=this.props.content;
    const {mounted,imageActive,displayImg,layoutComplete}=this.state;
    //console.log("STATE CHANGED ",this.state.imageActive);

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
                        <Tween  to={{opacity:0.7,scale:1.1,x:'10px'}} duration={0.3} ease="easy.in(0.2, 0.1)" onComplete={()=>this.setState({displayImg:true})} onReverseComplete={()=>this.setState({mounted:true})} playState={mounted? PlayState.play :!layoutComplete ? PlayState.reverse : PlayState.stop}>
                            <div className="bg-case" style={{backgroundImage:`url(${window.PUBLIC_URL}/${items[imageActive].file})`}} />           
                       </Tween>
                       <Tween from={{x:'100vw',opacity:0}} duration={1} stagger={0.5} ease="strong.out(0.2, 0.1)" onComplete={()=>this.setState({layoutComplete:true})} playState={displayImg? PlayState.play :layoutComplete ? PlayState.reverse : PlayState.stop}>
                            <div className= "content-i-intro">
                                <div className="header-incipit"><p>{content.INCIPIT}</p></div>
                                <div dangerouslySetInnerHTML={Helpers.cleanHTML(items[imageActive].content)} className="c-content" />
                                <Button variant="outlined" disableElevation color="primary" 
                                    onClick={this.state.activityComplete?() => this.props.handleNext(`${window.PUBLIC_URL}/${items[imageActive].file}`):this.handleContinue}
                                    className='button-steps'>
                                        {Helpers.findLabelInData("CONTINUE-BTN")}
                                </Button>
                            </div>
                        </Tween>
                    </div>
                </Slide>
        )
    }
}
export default Content;

