import React,{Component} from 'react';
import {Tween, PlayState} from 'react-gsap';
import "./images.scss";
import {Grid, Paper,Card, CardContent, CardActions, Button, Fab, CardMedia,Slide} from  '@material-ui/core/';
import {ResponsiveImage} from './units/basics'
//import SwipeableViews from 'react-swipeable-views';
import Helpers from "../../helpers/helpers"
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';

let timer;

class Images extends Component {
    constructor (props){
        super(props)
         this.state={
            imageActive:0,
            activityComplete:false,
            displayLib:false,
            mounted:false,
            displayImg:false
        }
        this.imageBackward=this.imageBackward.bind(this);
        this.imageForward=this.imageForward.bind(this);
        this.handleStepChange=this.handleStepChange.bind(this);
        this.fireEndTransition=this.fireEndTransition.bind(this);
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
            displayImg:false
        })
        timer=setTimeout(function(){this.setState({mounted:true,displayImg:true});clearTimeout(timer)}.bind(this), 500);
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
            mounted:false
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
        if(this.props.content.items !== undefined){
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
        }
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
    const {mounted,imageActive,displayImg,displayLib}=this.state;
    //console.log("STATE CHANGED ",this.state.imageActive);
    //const lengthText=items[imageActive].content.length
    const tabImg=Helpers.stripArray(items[imageActive].images);
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
                    <div className="content-images">
                            <div className="img-masked">
                                <Tween  from={{ scale: '1.05', opacity:'0' }} stagger={1.6} duration={1}  ease="easy.in(0.2, 0.1)" playState={this.state.displayImg? PlayState.play :PlayState.stop} onComplete={()=>this.setState({displayLib:true})}>  
                                    {
                                        tabImg.map((image,id)=>{
                                            return(
                                                <div className="img-container">
                                                    <ResponsiveImage key ={id} file={`${window.PUBLIC_URL}/data/${image}`} content={image} title={image} type="png" className="img-narrative"/>
                                                </div>
                                            )
                                        })
                                   }
                                 </Tween>     
                            </div> 
                       <Tween  from={{ opacity: 0, y:'230px' }} duration ={0.6} onComplete={()=>this.setState({displayImg:true})} ease="strong.out(0.2, 0.1)" playState={this.state.displayLib? PlayState.play :PlayState.stop}>  
                            <div className="legend">
                                {imageActive>0?<ArrowLeftIcon style={{color:'white',fontSize:'3rem'}} onClick={this.imageBackward} className='button-steps'/>
                                :
                                <div className="btn-spacer"/>
                                }
                                <div 
                                    
                                    dangerouslySetInnerHTML = {Helpers.cleanHTML(items[imageActive].question)}
                                />

                                <ArrowRightIcon style={{color:'white',fontSize:'3rem'}} onClick={this.isActivityComplete()?() => this.props.handleNext(`${window.PUBLIC_URL}/${items[imageActive].file}`):this.props.content.items.length===1?() => this.props.handleNext(`${window.PUBLIC_URL}/${items[imageActive].file}`):this.imageForward} className='button-steps'/>
                            </div>
                        </Tween>
                    </div>
                </Tween>
                </Slide>
        )
    }
}
export default Images;

