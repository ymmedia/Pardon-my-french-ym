import React,{Component} from 'react';
import "./images.scss";
import {Grid, Paper,Card, CardContent, CardActions, Button, Fab, CardMedia} from  '@material-ui/core/';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import SwipeableViews from 'react-swipeable-views';
import Helpers from "../../helpers/helpers"


class Images extends Component {
    constructor (props){
        super(props)
         this.state={
            imageActive:0,
            activityComplete:false
        }
        this.imageBackward=this.imageBackward.bind(this);
        this.imageForward=this.imageForward.bind(this);
        this.handleStepChange=this.handleStepChange.bind(this);
    }
    componentWillReceiveProps(newProps){
        if(newProps.content!==this.props.content){
            this.initState()
        }

    }
    initState(){
        this.setState({imageActive:0,
            activityComplete:false})
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
            imageActive: nextImage
        })
        this.getActivityComplete();
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
            imageActive: nextImage
        },this.getActivityComplete());
        
    }
    handleStepChange(step){
        this.setState({
            imageActive:step
        })
    }
    getActivityComplete(){
        const { imageActive } = this.state;
        if(this.props.content.items !== undefined){
            //console.log(imageActive, this.props.content.items.length)
            if(imageActive === this.props.content.items.length - 2){
                this.setState({
                    activityComplete: true
                })
            }
        }
    }
  
  render(){
    const {items}=this.props.content;
    //console.log("STATE CHANGED ",this.state.imageActive);

    return(
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper className="titre-images">
                    <h3>{this.props.content.INCIPIT}</h3>
                    <p>{this.props.content.CONSIGNE}</p>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Card className="content-images">
                    <Fab color="primary" aria-label="add" className="arrow-stepper" onClick={this.imageBackward}>
                            <ArrowLeftIcon />
                    </Fab>
                    <CardContent className="content-viewer">
                        <Paper elevation={0} className="cont-imgs">
                        <SwipeableViews index={this.state.imageActive} onChangeIndex={this.handleStepChange} >
                                {items.map((item,key)=>{
                                    return(
                                        <div key={key} className="step-container">
                                              <img src={`${window.PUBLIC_URL}/data/${item.file}`} alt=""/> 
                                            <div className="legend">
                                                <div dangerouslySetInnerHTML = {Helpers.cleanHTML(item.content)}></div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </SwipeableViews>
                        </Paper>
                        <CardActions className="steps-bloc-btn">
                            <Button variant="contained" disableElevation color="primary" disabled={!this.state.activityComplete} onClick={() => this.props.handleNext()} className='button-steps'>{"CONTINUER"}</Button>
                        </CardActions>  
                    </CardContent>
                    <Fab color="primary" aria-label="add" onClick={this.imageForward}>
                        <ArrowRightIcon />
                    </Fab>
                </Card>
            </Grid>
        </Grid>
        )
    }
}
export default Images;

