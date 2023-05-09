import React,{Component} from 'react';
import {motion} from 'framer-motion'
import "./quizz.scss";
import {Grid, Paper, Card, CardContent, CardActions, Button, Radio, Slide} from  '@material-ui/core/';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import Helpers from "../../helpers/helpers"
import divider from './../../images/divider.png';

const params={
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-10%",y:0},
  }
  const feedbacks={
      open:{opacity:1,scale:1},
      closed:{opacity:0,scale:0.8,y:"10%"}
  }
class Quizz extends Component{
    constructor (props){
        super(props)
        this.state={
            questionEnCours: 0,
            question:this.initQuestion(0),
            mounted:false,
            answer: new Map(),
            questionComplete: false,
            isGood:false,
            quizzComplete:false,
            slide: false,
        }
        this.validateQuestion=this.validateQuestion.bind(this); 
        this.changeQuestion=this.changeQuestion.bind(this);
        this.rebootQuestion=this.rebootQuestion.bind(this);
    }
    fireEndTransition(){
        this.setState({slide:true,mounted:true})
    }
    initQuestion(id){
        return this.props.content.items[id].choices.sort((a, b) => 0.5 - Math.random())
    }
    isQuestionMultiple(){
        const question=this.props.content.items[this.state.questionEnCours]
        let isMultiple=0
        question.choices.forEach(item=>{
            if(item.value==="true")
            isMultiple++
        })
        return (isMultiple>1 ?true :false)
    }
    handleClick(indice, value){
        let mapCopy = this.state.answer;
        console.log("answer : ", mapCopy)
        if(this.state.questionComplete)
            return
            
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
        }); 
        
        
    }
    rebootQuestion(){
        this.setState({
            questionComplete: false,
            answer: new Map(),
            //question:this.initQuestion(this.state.questionEnCours),
            slide: !this.state.slide
        });
    }
    changeQuestion(){
        const indice=this.state.questionEnCours+1;
        if(indice < this.props.content.items.length){
            this.setState({
                questionEnCours: indice,
                questionComplete: false,
                answer: new Map(),
                question:this.initQuestion(indice),
                slide: !this.state.slide
            });
        }else{
            if(!this.state.quizzComplete)
                this.setState({quizzComplete:true,slide:false})
            else
                this.props.handleNext();
        }
    }

    validateQuestion(){
        let result;          
        let feedback = {
            value: "",
            content: ""
        }  
        result = "Correct"; 
        //if only one is false, the feedback will be false
        if(this.isQuestionMultiple())
        {
            for (let v of this.state.answer) {
                if (v[1] === "false") { 
                    result = "false"; 
                }
            }
        }else{
            for (let v of this.state.answer) {
               result=v[1]
            }
        }
     
        let feedback1 = this.props.content.items[this.state.questionEnCours].feedbacks;
        if(this.isQuestionMultiple()){
            feedback1.forEach(item => {
                if(item.value === result){
                    feedback.content = item.lib;
                    feedback.value = result;
                }
            });
        }else{
            feedback.content=feedback1[parseInt(result)].lib;
            feedback.value=feedback1[parseInt(result)].value;
        }
        this.setState({
            questionComplete: true,
            questionFeedback: feedback,
            isGood:(result==="Correct" || parseInt(result)===2)?true:false
        })
    }

    displayQuestions(question,useSize){
        if(!this.state.slide){
            setTimeout(function(){
                this.setState({
                    slide: true
                });
            }.bind(this), 200)
        }
        return (
            <Slide 
                direction={'left'}
                in={this.state.slide}
                mountOnEnter unmountOnExit>
                <div className="quizz-viewer">
                    {
                        question.map((item,i)=>{
                            return(
                            <Paper key={i} className={`quizz-item ${this.state.answer.has(i)&&'item-active'}` }elevation={0} onClick={() => this.handleClick(i, item.value)}>
                                {this.state.questionComplete&&this.displayIcons(i)}
                                <Radio value={i} checked={this.state.answer.has(i)}/>  
                                <p>{item.lib}</p>
                            </Paper>
                            )
                        })
                    }
                    {this.state.questionComplete ? this.displayFeedBack(true) : null}
                </div>  
            </Slide>
        )
    }
    
    displayFeedBack(pAnim){
        return(
            <motion.div initial="closed" animate={pAnim?'open':'closed'} variants={feedbacks} className="quizz-feedback-wrapper">
                <Paper className={(this.state.questionFeedback.value === "next" ? "quizz-good" : "quizz-bad") + " quizz-feedback"}>
                    <p dangerouslySetInnerHTML={Helpers.cleanHTML(this.state.questionFeedback.content)}></p>
                </Paper>
            </motion.div>
        )
    }
    displayConclustion(pConclusion){

        if(!this.state.slide){
            setTimeout(function(){
                this.setState({
                    slide: true
                });
            }.bind(this), 200)
        }
        return (
            <Slide 
                direction={'left'}
                in={this.state.slide}
                mountOnEnter unmountOnExit>
                <div className="quizz-viewer">
                    <div className='quizz-conclusion' dangerouslySetInnerHTML={Helpers.cleanHTML(pConclusion)}/>
                </div>  
            </Slide>
        )
    }
    displayIcons(i){

        if(this.isQuestionMultiple()){
            if(this.state.answer.has(i)){
                if(this.props.content[this.state.questionEnCours].items[i].action==="true")
                 return <CheckCircleOutlinedIcon className="green"/>
                else
                return <HighlightOffOutlinedIcon className="red"/>
            }else{
                if(this.props.content[this.state.questionEnCours].items[i].action==="true")
                return <CheckCircleOutlinedIcon  className="green"/>
            }
        }else{
            if(this.state.answer.has(i)){
                console.log(this.state.answer.get(i))
                if(this.props.content.items[this.state.questionEnCours].feedbacks[this.state.answer.get(i)].value==="Correct")
                    return <CheckCircleOutlinedIcon className="green"/>
                else if(this.props.content.items[this.state.questionEnCours].feedbacks[this.state.answer.get(i)].value==="Average")
                    return <CheckCircleOutlinedIcon className="orange"/>
                else
                    return <HighlightOffOutlinedIcon className="red"/>
            }
        }
      

    }
    
    render(){
        const question=this.props.content.items[this.state.questionEnCours]
        const {mounted}=this.state
        return(
            <Grid container spacing={0} className='quizz-container' style={{marginBottom:this.props.useSize.isVerySmall ? '100px' : ''}}>
                 <div className='quizz-top-header'>
                    <h3 className='underline' dangerouslySetInnerHTML={Helpers.cleanHTML(this.props.content.TITRE)}/>
                    {/* <img src={divider} alt='divider' style={{width:'200px',height:'1px'}}/> */}
                 <Slide
                    direction="left"
                    in={true}
                    timeout={300}
                    mountOnEnter
                    unmountOnExit>
                        {
                            !this.state.quizzComplete ?
                            <div className="titre-quizz" dangerouslySetInnerHTML={Helpers.cleanHTML(question.question)}/>
                            :
                            <div className="titre-quizz"><p>{Helpers.findLabelInData("EXCIPIT-LABEL")}</p></div>
                        }
                        
                </Slide>
                 </div>
                 <Grid item xs={12}>
                    <Slide 
                            direction="left"
                            in={true}
                            mountOnEnter
                            unmountOnExit
                            timeout={500}
                            onEntered={this.fireEndTransition.bind(this)}
                        >
                        <Card className={this.props.useSize.isVerySmall ? "content-steps content-steps-small " :"content-steps" }>
                            {!this.state.quizzComplete?
                            this.displayQuestions(this.state.question,this.props.useSize)
                            :
                            this.displayConclustion(this.props.content.CONCLUSION)}
                            <CardActions className="steps-bloc-btn">
                                <Button variant="contained" disableElevation color="primary" 
                                disabled={this.state.answer.size === 0 ? true : false}
                                onClick={this.state.questionComplete ? this.state.isGood?this.changeQuestion:this.rebootQuestion : this.validateQuestion} 
                                className='button-steps'>{this.state.questionComplete ?this.state.isGood?Helpers.findLabelInData("BTN-NEXT"):Helpers.findLabelInData("QUIZZ-RESTART"): Helpers.findLabelInData("VALIDATE-BTN")}</Button>
                            </CardActions>       
                        </Card>
                    </Slide>
                 </Grid>
            </Grid>
        )
    }
}
export default Quizz;