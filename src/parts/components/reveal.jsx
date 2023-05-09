import React,{Component} from 'react';
import {motion} from 'framer-motion';
import {Grid, Paper,Card, Slide, CardActions, Button, CardMedia, GridList, GridListTile, Modal} from  '@material-ui/core/';
import Flippy, {FrontSide, BackSide} from 'react-flippy';
import Helpers from "../../helpers/helpers";
import "./reveal.scss";

const slider={
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-10%" },
  }
const params={
    open:{opacity:1,scale:1},
    closed:{opacity:0,scale:1.1}
}
const end={
    open:{opacity:1,x:0},
    closed:{opacity:0,x:"-10%"}
}

class Reveal extends Component {
    constructor (props){
        super(props)
         this.state={
            activities:[],
            activityComplete:false,
            open: false,
            mounted:false,
            indice: 0
        }
        this.handleClose = this.handleClose.bind(this);
    }

    handleReveal(i){
        const sA = this.state.activities;
        sA[i] = !sA[i];
        this.setState({
            activities:sA,
            activityComplete:this.checkRevealisComplete()
        })

        if(this.props.content.items.length >= 4){
            this.setState({
                open: true,
                indice: i
            })
        }
    }

    handleClose(){
        this.handleReveal(this.state.indice);
        this.setState({
            open: false,
            indice: 0
        })
        
    }
    fireEndTransition(){
        this.setState({mounted:true})
    }
    checkRevealisComplete(){
        let array = this.state.activities;
        let itemsActivity = this.props.content.items.length;
        let isComplete = true;
        if(!this.state.activityComplete){
            if(array.includes(undefined) || array.length < itemsActivity){
                isComplete = false;
            }
            //console.log("isComplete : ",isComplete);
        }
        return isComplete;
    }
  
  render(){
    const {items}=this.props.content;
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
                        <Paper className="titre-reveal">
                            <motion.h3 initial='closed' animate={mounted? 'open' :'closed'} variants={params}>{this.props.content.INCIPIT}</motion.h3>
                            <motion.p initial='closed' animate={mounted? 'open' :'closed'} variants={params}>{this.props.content.CONSIGNE}</motion.p>
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
                        <Card className="content-reveal">
                        <GridList className="reveal-viewer" cellHeight={160} cols={2} spacing={20}>
                            <motion.div 
                                    initial='closed'
                                    animate={this.state.mounted?'open':'closed'}
                                    variants={slider}
                                    transition={{ duration: 0.5 }}
                                    className="card-viewport"
                                   
                                    
                                >
                            {items.map((item, i) => (
                                items.length >= 3 ?
                                        [item.file.includes("assets") ?
                                            <CardMedia key={i} onClick={()=>this.handleReveal(i)}
                                                className="reveal-card-img-max"
                                                //image={`${window.PUBLIC_URL}/data/assets/activities/S0-2-P2.png`}
                                                image={`${window.PUBLIC_URL}/data/${item.file}`}
                                                title={item.file}
                                            /> : 
                                            <Card key={i} elevation={0} className="reveal-card-text" onClick={()=>this.handleReveal(i)}>
                                                <div className="text-reveal" dangerouslySetInnerHTML={Helpers.cleanHTML(item.file)} />
                                            </Card>
                                        ]   
                                    :
                                    <Flippy key={i} isFlipped={this.state.activities[i]} flipDirection="horizontal" className="bloc-cards">
                                        <FrontSide className="flippy-card-front" onClick={()=>this.handleReveal(i)}>
                                            {item.file.includes("assets") ?
                                                <CardMedia 
                                                    className="flippy-card-img-min"
                                                    //image={`${window.PUBLIC_URL}/data/assets/activities/S0-2-P2.png`}
                                                    image={`${window.PUBLIC_URL}/data/${item.file}`}
                                                    title={item.file}
                                                /> : 
                                                <Card elevation={0} className="flippy-card-text">
                                                    <div dangerouslySetInnerHTML={Helpers.cleanHTML(item.file)} />
                                                </Card>
                                            }
                                        </FrontSide>
                                        <BackSide className="flippy-card-back" onClick={()=>this.handleReveal(i)}>
                                            <Card elevation={0} className="flippy-card-back-text">
                                                <div dangerouslySetInnerHTML={Helpers.cleanHTML(item.content)} />
                                            </Card>
                                        </BackSide>
                                    </Flippy>
                                
                            ))}
                            <Modal
                                open={this.state.open}
                                onClose={this.handleClose}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                                style={{display:'flex',alignItems:'center',justifyContent:'center'}}
                            >
                                <Slide direction="up" in={this.state.open} mountOnEnter unmountOnExit>
                                    <div className="reveal-modal">
                                        {!items[this.state.indice].file.includes("assets")&&<div dangerouslySetInnerHTML={Helpers.cleanHTML(items[this.state.indice].file)} />}
                                        <div dangerouslySetInnerHTML={Helpers.cleanHTML(items[this.state.indice].content)} />
                                    </div>
                                </Slide>
                            </Modal>
                        </motion.div>
                        </GridList>
                        {this.props.content.CONCLUSION === undefined ? 
                            this.state.activityComplete&&
                            <motion.div
                                initial='closed'
                                animate={this.state.activityComplete?'open':'closed'}
                                variants={end}
                                transition={{ duration: 0.5 }}
                                className="motion-end"
                            
                            >
                                 <CardActions className="steps-bloc-btn">
                                    <Button variant="contained" disableElevation color="primary" disabled={!this.state.activityComplete} onClick={() => this.props.handleNext()} className='button-steps'>{"CONTINUER"}</Button>
                                </CardActions>
                            </motion.div>
                           
                                :
                            this.state.activityComplete&&
                            <motion.div
                                initial='closed'
                                animate={this.state.activityComplete?'open':'closed'}
                                variants={end}
                                transition={{ duration: 1.5 }}
                                className="motion-end"
                            
                            >
                                <CardActions className="reveal-bloc-btn">
                                    <Paper elevation={1} className="reveal-conclusion">
                                        <p>{this.props.content.CONCLUSION}</p>
                                    </Paper>
                                    <Button variant="contained" disableElevation color="primary" disabled={!this.state.activityComplete} onClick={() => this.props.handleNext()} className='button-steps'>{"CONTINUER"}</Button>
                                </CardActions>   
                            </motion.div>    
                        }  
                    </Card>
                </Slide>
             </Grid>
        </Grid>  
        )
    }
}
export default Reveal;

