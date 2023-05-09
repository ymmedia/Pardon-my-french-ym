import React,{Component} from 'react';
import "./infographie.scss"
import Helpers from "../../helpers/helpers"
import {Grid, Paper,Card, CardContent, CardActions, Button} from  '@material-ui/core/';
import Image from "react-image-enlarger";

class Infographie extends Component{
    constructor()
    {
        super();
        this.state={
            zoomed: false
        }
    }

    setZoomed(bool){
        this.setState({
            zoomed: bool,
        })
    }

    render(){
        const content = this.props.content;
        const img=`${window.PUBLIC_URL}/data/${content.file}`;
        console.log(content);
        return(
            <Grid container spacing={3}>
                 <Grid item xs={12}>
                    <Paper className="titre-infographie">
                        <h3 dangerouslySetInnerHTML={Helpers.cleanHTML(content.INCIPIT)}/>
                    </Paper>
                 </Grid>
                 <Grid item xs={12}>
                    <Card className="content-bloc">
                        <div>
                            <Image
                                className="infographie-img"
                                zoomed={this.state.zoomed}
                                src={img}
                                onClick={() => this.setZoomed(true)}
                                onRequestClose={() => this.setZoomed(false)}
                            />
                        </div>
                        <CardContent className="content-infographie">
                            <Paper className="infographie-comment">
                                <div dangerouslySetInnerHTML={Helpers.cleanHTML(content.COMMENT)}/>
                            </Paper>
                            <CardActions className="infographie-bloc-btn">
                                <Button variant="contained" disableElevation color="primary" onClick={this.props.handleNext} className='button-intro'>{Helpers.findLabelInData("BTN-NEXT")}</Button>
                            </CardActions>  
                        </CardContent>
                    </Card>
                 </Grid>
            </Grid>
        )
        
    }

}
export default Infographie;