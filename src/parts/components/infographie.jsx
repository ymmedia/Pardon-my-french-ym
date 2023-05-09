import React,{Component} from 'react';
import "./infographie.scss";
import {motion} from 'framer-motion';
import Helpers from "../../helpers/helpers"
import {Grid, Paper,Card, CardContent, CardActions, Button,Slide,Fade} from  '@material-ui/core/';
import Image from "react-image-enlarger";
const params={
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-10%" },
  }
const imgs={
    open:{opacity:1,y:0},
    closed:{opacity:0,y:"5%"}
}
class Infographie extends Component{
    constructor()
    {
        super();
        this.state={
            zoomed: false,
            mounted:false,
            imgMounted:false
        }
    }

    setZoomed(bool){
        this.setState({
            zoomed: bool,
        })
    }
    fireEndTransition(){
        this.setState({mounted:true})
    }
    displayImageComplete(){
        this.setState({imgMounted:true})
    }
    render(){
        const content = this.props.content;
        const{mounted,imgMounted}=this.state;
        const img=`${window.PUBLIC_URL}/data/${content.file}`;
        console.log(content);
        return(
            <Grid container spacing={3}>
                 <Grid item xs={12}>
                    <Slide
                        direction="left"
                        in={true}
                        timeout={300}
                        mountOnEnter
                        unmountOnExit>
                            <Paper className="titre-infographie">
                                <motion.h3 initial='closed' animate={mounted? 'open' :'closed'} variants={params} dangerouslySetInnerHTML={Helpers.cleanHTML(content.INCIPIT)}/>
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
                        <Card className="content-bloc">
                            <motion.div 
                                initial='closed'
                                animate={mounted?'open':'closed'}
                                variants={imgs}
                                transition={{ duration: 0.5 }}
                                onAnimationComplete={this.displayImageComplete.bind(this)}
                                >
                                <Image
                                    className="infographie-img"
                                    zoomed={this.state.zoomed}
                                    src={img}
                                    onClick={() => this.setZoomed(true)}
                                    onRequestClose={() => this.setZoomed(false)}
                                />
                            </motion.div>
                            <Fade
                                in={imgMounted}
                                mountOnEnter
                                unmountOnExit
                                timeout={500}
                            >
                                <CardContent className="content-infographie">
                                    <Paper className="infographie-comment">
                                        <div dangerouslySetInnerHTML={Helpers.cleanHTML(content.COMMENT)}/>
                                    </Paper>
                                    <CardActions className="infographie-bloc-btn">
                                        <Button variant="contained" disableElevation color="primary" onClick={this.props.handleNext} className='button-intro'>{Helpers.findLabelInData("BTN-NEXT")}</Button>
                                    </CardActions>  
                                </CardContent>
                            </Fade>
                        </Card>
                    </Slide>
                 </Grid>
            </Grid>
        )
        
    }

}
export default Infographie;