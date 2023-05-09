
import React,{Component} from 'react';
import {motion} from 'framer-motion'
import "./infox.scss";
import { Grid, Paper,Card, CardContent, CardActions, Button, Zoom,Slide} from  '@material-ui/core/';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';

const params={
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-10%" },
  }
const feedbacks={
    open:{opacity:1,scale:1},
    closed:{opacity:0,scale:1.1}
}

class Infox extends Component{
    constructor (props){
        super(props)
        this.state={
            questionEnCours: 0,
            questionComplete: false,
            answer:"",
            selectedChoice: "",
            cardColor: "",
            mounted:false,
            slide: false
        }
        this.validateQuestion = this.validateQuestion.bind(this);
        this.changeQuestion = this.changeQuestion.bind(this);
        //this.cardColor = this.cardColor.bind(this);
    }
    fireEndTransition(){
        this.setState({mounted:true,slide:true})
    }
    changeQuestion(){
        const indice=this.state.questionEnCours+1;
        if(indice < this.props.content.length){
            this.setState({
                questionEnCours:indice,
                questionComplete:false,
                selectedChoice: "",
                answer:"",
                slide: !this.state.slide
            })
        }else{
            this.props.handleNext();
        }
    }
    validateQuestion(i){
        if(!this.state.questionComplete){
            const rep = this.props.content[this.state.questionEnCours].items[i].action;
            this.setState({
                questionComplete:true,
                answer:rep,
                selectedChoice: i   
            })
        }
    }

    displayCards(question){
        if(!this.state.slide){
            setTimeout(function(){
                this.setState({
                    slide: true
                });
            }.bind(this), 300)
        }
        else{
            return (
            <Zoom in={this.state.slide} 
                style={{ transitionDelay: '300ms'}}
                mountOnEnter unmountOnExit>
                <CardContent className="infox-viewer">
                    <div className="question-infox">
                        <div className="header-question">
                            <div className="logo-infox">DAC 6</div>
                            <div className="flash-infox">FLASH INFOS</div>
                        </div>
                        <div className="body-question">
                            <div className="alerte-infox">alerte INFO</div>
                            <h3>{question.lib}</h3>
                        </div>
                    </div>
                    {
                        question.items.map((item,i)=>{
                            return(
                            <Paper key={i} className={(
                                this.state.selectedChoice === i ? [
                                    this.state.answer === "true" ? "borderGood" : "borderWrong"
                                ] : "") + " info-card"} elevation={0} 
                                onClick={() =>this.validateQuestion(i)}>
                                <p>{item.content}</p>
                            </Paper>
                            )
                        })
                    }
                        {this.state.questionComplete ? this.displayFeedBack(true) : null}
                </CardContent>  
            </Zoom>
            )
        }
    }

    displayFeedBack(pAnim){
        let feedback = this.props.content[this.state.questionEnCours].feedbacks[0];
        return(
            <motion.div initial="closed" animate={pAnim?'open':'closed'} variants={feedbacks} className="quizz-feedback-wrapper">
                <Paper className={(this.state.answer === "true" ? "isGood" : "isBad") + " quizz-feedback"}>
                    {(this.state.answer === "true") ? 
                    (<h3 className="icon-feedback"><CheckCircleOutlinedIcon className="white icon" /><div>BRAVO !</div></h3>) : 
                    (<h3 className="icon-feedback"><HighlightOffOutlinedIcon className="white icon"/><div>DÉSOLÉ !</div></h3>)}
                    <p>{feedback.content}</p>
                </Paper>
            </motion.div>
        )
    }
    
    render(){
        const question = this.props.content[this.state.questionEnCours]
        const {mounted}=this.state
        return(
            <Grid container spacing={3}>         
                 <Grid item xs={12}>
                    <Slide
                            direction="left"
                            in={true}
                            timeout={300}
                            mountOnEnter
                            unmountOnExit>
                            <Paper className="titre-infox">
                                <motion.h3 initial='closed' animate={mounted? 'open' :'closed'} variants={params}>{this.props.titre}</motion.h3>
                                <motion.p animate={mounted? 'open' :'closed'} variants={params}>{this.props.incipit}</motion.p>
                            </Paper>
                    </Slide>
                 </Grid>
                 <Grid item xs={12}>
                    <Slide 
                        direction="left"
                        in={true}
                        mountOnEnter
                        unmountOnExit
                        timeout={500}
                        onEntered={this.fireEndTransition.bind(this)}
                    >
                        <Card className="content-infox">
                            
                            {this.displayCards(question)}
                            <CardActions className="steps-bloc-btn">
                                {this.state.questionComplete &&<Button variant="contained" disableElevation color="primary" disabled={false} onClick={this.changeQuestion} className='button-steps'>{this.state.questionComplete ? "CONTINUER" : "VALIDER"}</Button>}
                            </CardActions>       
                        </Card>
                    </Slide>
                 </Grid>
            </Grid>
        )
    }
}
export default Infox;