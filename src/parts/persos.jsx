import React,{Component} from 'react';
import './persos.scss';
import {CardContent, Button, MobileStepper, Slide, Zoom } from '@material-ui/core';
import {Redirect } from "react-router-dom";
import * as UserActions from "../actions/UserActions"
import {ResponsiveImage,Vignette} from "./components/units/basics"
import helpers from '../helpers/helpers.js'
import {Tween, PlayState} from 'react-gsap';
import CloseIcon from '@material-ui/icons/Close';

class Persos extends Component{
    constructor(){
        super();
        this.state={
            step: 0,
            redirect: false,
            slide: true,
            mounted:false,
            mountedModal:true,
            modal:false,
            perso:"",
            modalComplete:false,
            complet:[false,false,false]
        }
        this.handle_Click=this.handle_Click.bind(this);
    }
    handle_Click(){
        if(this.state.step <1){
            let step = this.state.step+1;
            this.setState({ 
                step: step,
                slide: !this.state.slide
            })
        }else{
            this.setState({redirect:true})
        }
       
    }
    setAnimation(){
        console.log("ENTER")
        const{mounted}=this.state
        this.setState({mounted:true})
    }
    setExitAnimation(){
        console.log("EXIT")
        this.setState({mounted:false})
    }
    selectPerso(perso){
        console.log(perso);
        this.setState({modal:true,perso:perso,mountedModal:true})
    }
    isPersosComplete(){
        const {complet}=this.state
        let v=true
        complet.forEach(item=>{
            console.log(item)
            if(item===false)
                v=false
        })
        return v;
    }
    disableBtn(){
        switch(this.state.step){
            case 0 :
                if(this.isPersosComplete())
                    return false
                else
                    return true
                    
            case 1 :
                    return false
            default:
               return false;
        }
    }
    modalComplete(){
        console.log("JE SUIS COMPLET")
        this.setState({modalComplete:true})
    }
    updatePersos(indice){
        const a=this.state.complet
        a[indice]=true
        this.setState({mountedModal:false,modalComplete:false,complet:a})
    }
    displayPart(indice){
        if(!this.state.slide){
            setTimeout(function(){
                this.setState({
                    slide: true
                });
            }.bind(this), 400)
        }
        switch(indice){
            case 0:
                console.log("INTRO")
                return this.displayIntro()
            case 1 :
                return this.displayObjectifs();
            case 2 :
                return this.displayContext();
            default:
                return false;
        }
    }
    displayObjectifs(){
        const titre=window.APP_DATA.contents.OBJECTIFS.INCIPIT;
        const content=window.APP_DATA.contents.OBJECTIFS.MSG;
        
        return(
            this.displayContent(titre,content)
        )
    }
    displayContext(){
        const titre=window.APP_DATA.contents.START.INCIPIT;
        const content=window.APP_DATA.contents.START.MSG;
        
        return(
            this.displayContent(titre,content)
        )
    }
    displayContent(titre,content){
        return(
            <div className="persos-content">
                 <Tween from={{ x: '100vw', opacity:'0'}} duration={2} stagger={0.3} ease="elastic.out(0.2, 0.1)" playState={this.state.mounted ? PlayState.play :PlayState.stop}>
                    <h3 className="titre" dangerouslySetInnerHTML={helpers.cleanHTML(titre)} />
                    <div className="core-content" dangerouslySetInnerHTML={helpers.cleanHTML(content)} />
                </Tween>

            </div>
        )
    }
    displayModal(){
        let color,picture,content,indice
        switch(this.state.perso){
            case "allan":
                 color="#76b1b8"
                 picture=`${window.PUBLIC_URL}/data/assets/bg/allan.png`;
                 content=window.APP_DATA.contents.PERSOS.ALAN
                 indice=0;
                break;
            case "zoe" :
                 color="#78ba95"
                 picture=`${window.PUBLIC_URL}/data/assets/bg/zoe.png`;
                 content=window.APP_DATA.contents.PERSOS.ZOE
                 indice=1;
                break;
            case "lucy" :
                 color="#959fc7"
                 picture=`${window.PUBLIC_URL}/data/assets/bg/lucy.png`;
                 content=window.APP_DATA.contents.PERSOS.LUCY
                 indice=2;
                break;
            default :
        }
        return(
            <Tween from={{ x: '100vw', opacity:'0'}} duration={1} ease="strong.in(0.2, 0.1)" onComplete={()=>this.modalComplete()} onReverseComplete={()=>this.setState({modal:false})} playState={this.state.mountedModal ? PlayState.play :PlayState.reverse}>
                <div className="modal" style={{backgroundColor:color}}>
                    
                    <div onClick={()=>this.updatePersos(indice)} className="modal-header"><p>{helpers.findLabelInData("CLOSE-BTN")}</p><CloseIcon style={{ color: 'white',cursor:'pointer'}} fontSize="large"  /></div>
                    <div className="modal-viewport">
                        <Tween from={{ x: '-300px', opacity:'0' }} duration={1} stagger={0.5} ease="elastic.out(0.2, 0.1)" playState={this.state.modalComplete? PlayState.play :PlayState.stop}>
                            <div className="img-modal">
                                <ResponsiveImage file={picture} content="perso" title={this.state.perso} type="png"/>
                            </div>
                            <div className="modal-content" dangerouslySetInnerHTML={helpers.cleanHTML(content)}/>
                        </Tween>
                    </div>
                    
                </div>
            </Tween>
        )
    }
    displayIntro(){
        const incipit=window.APP_DATA.contents.PERSOS.INCIPIT
        const allan= `${window.PUBLIC_URL}/data/assets/bg/allan.png`;
        const zoe= `${window.PUBLIC_URL}/data/assets/bg/zoe.png`;
        const lucy= `${window.PUBLIC_URL}/data/assets/bg/lucy.png`;
        return(
            <>
                <Tween from={{ x: '50px', opacity:'0'}} duration={3} ease="elastic.out(0.2, 0.1)" playState={this.state.mounted ? PlayState.play :PlayState.stop}>
                    <p className="persos-incipit" dangerouslySetInnerHTML={helpers.cleanHTML(incipit)} />
                </Tween>
                    <div className="persos-images">
                        <Tween from={{ x: '50px', opacity:'0',scale:1.2}} duration={2} stagger={0.3} ease="elastic.out(0.2, 0.1)" playState={this.state.mounted ? PlayState.play :PlayState.stop}>
                            <div className="allan-img" onClick={()=>this.selectPerso("allan")}>
                                <ResponsiveImage file={allan} content="Allan" title="Allan" type="png" />
                            </div>
                            <div className="zoe-img" onClick={()=>this.selectPerso("zoe")}>
                                <ResponsiveImage file={zoe} content="Allan" title="zoe" type="png" />
                            </div>
                            <div className="lucy-img" onClick={()=>this.selectPerso("lucy")}>
                                <ResponsiveImage file={lucy} content="Allan" title="lucy" type="png"/>
                            </div>
                        </Tween>
                    </div>
                    
        </>
        )
    }
    render(){
       
        return(
            this.state.redirect ?
            <Redirect to="/module"/>
            :
            <Slide direction="left" in={this.state.slide} mountOnEnter unmountOnExit onEntered={this.setAnimation.bind(this)} onExit={this.setExitAnimation.bind(this)}>
                <div className={this.state.step===0 ? "persos-viewport" : "persos-viewport bg-persos"}>
                    {this.state.modal&&this.displayModal()}
                    {this.displayPart(this.state.step)}
                    <CardContent className="persos-end-card">
                        <Button 
                            varriant="outlined"
                            disabled={this.disableBtn()} 
                            onClick={this.handle_Click} 
                            className={(this.state.step === 1 ? "btn-intro" : null) + " btn-validate" }
                            color="primary">
                                {this.state.step < 1 ? helpers.findLabelInData("BTN-NEXT"): helpers.findLabelInData("OK-BTN")}
                        </Button>
                        <MobileStepper
                            variant="dots"
                            steps={2}
                            position="static"
                            activeStep={this.state.step}
                            className='steppers'
                        />
                    </CardContent>
                </div>
            </Slide>
        )
    }
}

export default Persos;