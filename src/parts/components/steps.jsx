import React,{Component} from 'react';
import "./steps.scss"
import Quizz from "./quizz";
import Infox from "./infox";
import Reveal from "./reveal";
import Images from "./images";
import Infographie from "./infographie";
import Cases from "./cases";
import Content from "./content";
import Introduction from './introduction';
import Video from './video';
import Audio from './Audio';
import Conclusion from './conclusion';
//import {Paper, CardContent} from  '@material-ui/core/';
//import { ReactCSSTransitionGroup } from 'react-transition-group';


class Steps extends Component{
    constructor()
    {
        super();
        this.state={
            activities:[],
            activityEnCours:0,
            activeStep:0,
            activityComplete:false,
            lastImage:'',

        }
        this.handleNextActivity=this.handleNextActivity.bind(this);
        this.handleNavigate=this.handleNavigate.bind(this)
    }
    componentDidUpdate(prevProps){
        if(prevProps.content !==this.props.content){
            console.log("I'M UPDATED");
            this.setState({activityEnCours:0})
        }
            
    }

    //Handle next activity or step
    handleNextActivity(...params){
         console.log("activités de la séquence", this.props.content.activities);
         console.log("activité en cours", this.state.activityEnCours);
         console.log("state activities", this.state.activities);

        const newActivity = this.state.activityEnCours + 1;
        if(newActivity === this.props.content.activities.length){
            console.log("Next Module or Sequence");
            this.nextModule();
        }  
        else{
            this.setState({
                activityEnCours:newActivity,
                activeStep:0,
                activityComplete:false,
                lastImage:params[0],
            })
        }
    }
    handleNavigate(pId){
        console.log("NAVIGATE IN STEPS", pId, this.props)
        this.props.navigateToSequence(pId, this.props._id)
        this.reset()
    }
    nextModule(){
        this.props.continueHandler();
        this.reset();
    }
    reset(){
        this.setState({
            activities:[],
            activityEnCours:0,
            activeStep:0,
            activityComplete:false

        })
    }
    
    displayActivity(){
        console.log("---------CONTENT---------");
        console.log("props content", this.props.content);
         //console.log("props activities", this.props.content.activities);
         console.log("activity en cours", this.state.activityEnCours);
         console.log("quel type d'activity ?", this.props.content.activities[this.state.activityEnCours].type);
        switch(this.props.content.activities[this.state.activityEnCours].type){
            case "INTRO" :
                return <Introduction useSize={this.props.useSize} isBranch={false} image={this.props.content.illustration} content={this.props.content.activities[this.state.activityEnCours]} navigateTo={this.handleNavigate} continueHandler={this.handleNextActivity}/>
            case "CONCLUSION" :
                return <Conclusion useSize={this.props.useSize} image={this.props.content.activities[this.state.activityEnCours].IMG} content={this.props.content.activities[this.state.activityEnCours]} backHandler={this.goBackToModule} continueHandler={this.handleNextActivity} notifHandler={this.props.notifHandler}/>
            case "IMAGES" :
                return <Images useSize={this.props.useSize} init={true} content={this.props.content.activities[this.state.activityEnCours]} handleNext={this.handleNextActivity}/>;
            case "VIDEO" :
                return <Video useSize={this.props.useSize} init={true} content={this.props.content.activities[this.state.activityEnCours]} handleNext={this.handleNextActivity}/>;
            case "AUDIO" :
                return <Audio useSize={this.props.useSize} init={true} content={this.props.content.activities[this.state.activityEnCours]} handleNext={this.handleNextActivity}/>;
            case "BRANCH" :
                return <Introduction useSize={this.props.useSize} isBranch={true} socle={this.props.socleEnCours} image={this.props.content.illustration} content={this.props.content.activities[this.state.activityEnCours]} navigateTo={this.handleNavigate} continueHandler={this.handleNextActivity}/>
            case "PICS" :
                return <Content useSize={this.props.useSize} init={true} content={this.props.content.activities[this.state.activityEnCours]} handleNext={this.handleNextActivity}/>
            case "REVEAL" :
                return <Reveal useSize={this.props.useSize} content={this.props.content.activities[this.state.activityEnCours]} handleNext={this.handleNextActivity}/>;
            case "QUIZZ" :
               return <Quizz useSize={this.props.useSize} content={this.props.content.activities[this.state.activityEnCours]} handleNext={this.handleNextActivity}/>;
            case "INFOX" :
                return <Infox useSize={this.props.useSize} titre={this.props.content.titre} incipit={this.props.content.activities[this.state.activityEnCours].INCIPIT} content={this.props.content.activities[this.state.activityEnCours].questions} handleNext={this.handleNextActivity}/>;
            case "INFOGRAPHIE" :
                return <Infographie useSize={this.props.useSize} content={this.props.content.activities[this.state.activityEnCours]} handleNext={this.handleNextActivity}/>;
            case "CASE" :
                return <Cases useSize={this.props.useSize} init={true} content={this.props.content.activities[this.state.activityEnCours]} bgImage={this.state.lastImage} handleNext={this.handleNextActivity}/>;
            default :
                break;
        }
    }

    render(){
        //const img=`${window.PUBLIC_URL}/data/assets/bg/socle-0.png`
        return(
            this.displayActivity()
        )
    }
}
export default Steps;