import React,{Component} from 'react';
import './intro.scss';
import { Select, FormControl, MenuItem, InputLabel, MobileStepper, Fade} from '@mui/material';
import {Redirect } from "react-router-dom";
import * as UserActions from "../actions/UserActions";
import UserStore from './../stores/UserStore';
import splash from './../images/img-accueil.png'
import divider from './../images/divider.png'
import {Header, LogoOmnes,ClipImage,Title} from "./components/units/basics"
import helpers from '../helpers/helpers.js'
import {Tween, PlayState} from 'react-gsap'
import axios from "axios";

const lngGenLib="<p>Welcome to this adventurous learning game that will help you succeed in your first steps in France!</p><p> Bienvenue dans cet étonnant jeu d'apprentissage qui t'aidera dans tes premiers pas en France !​</p>"
const choicelng="<p>Choose your language.<br />Choisissez votre langue de consultation.</p>"

        

class Intro extends Component{
    constructor(){
        super();
        this.state={
            lng:"",
            bu:"",
            fileLoaded:false,
            step: 0,
            aLng:[false,false],
            redirect: false,
            slide: true,
            mounted:false,
            APP_DATA:{}
        }
        this.handle_Change=this.handle_Change.bind(this);
        this.handle_Change_BU=this.handle_Change_BU.bind(this);
        this.handle_Click=this.handle_Click.bind(this);
        this.handle_select=this.handle_select.bind(this);
        
    }
    componentDidUpdate(){
       /*  if(this.state.lng!=="" && !this.state.fileLoaded){
            helpers.appendScript(`${window.PUBLIC_URL}/data/content/${this.state.lng}/choices-data.js`)
            this.setState({fileLoaded:true})

        } */
        
     }
    handle_Change(event){
        this.setState({
            lng:event.target.value,
        });
    }
    handle_Change_BU(event){
        this.setState({
            bu:event.target.value,
        });
    }
    handle_select(indice){
        const {aLng}=this.state;
        for (let i=0;i<this.state.aLng.length;i++){
           // console.log(i)
            if(i===indice){
                aLng[i]=!aLng[i]
            }else{
                aLng[i]=false
            }
        }
        this.setState({aLng:aLng})
    }
    handle_Click(event){
        switch(this.state.step){
            case 0 :
                this.loadFile()
                break;
            case 1 :
                this.setState({step:this.state.step+1,slide: !this.state.slide})
                break;
            case 2 :
                this.setState({step:this.state.step+1,slide: !this.state.slide})
                break;
            case 3 :
                this.setState({step:this.state.step+1,slide: !this.state.slide})
                break;
            default :
                UserActions.inituser();
                const base = this.getBase(this.state.bu);
                UserActions.changeUser({
                    lng: this.state.lng,
                    status: "incomplete",
                    basePath: base
                });
                this.setState({redirect:true})
        }
    }
    loadFile(){
        const lng=this.state.aLng[1] ? 'EN' : 'FR';
        const url = `${window.PUBLIC_URL}/data/${lng}/structure.json`;
       // console.log("mount !!! ", url);
        axios.get(url).then((results) => {
          console.log(results.data);
          UserActions.loadData({ data: results.data });
          UserStore.match();
          let step=this.state.step+1
          this.setState({ fileLoaded: true, lng:lng, slide: !this.state.slide,step:step,APP_DATA:UserStore.getData()});
        });

    }
    getData(){
        if(this.state.data!==undefined)
            return this.state.data
        else{
            return UserStore.getData()
        }
    }
    checkLngSelected(){
        for (let i=0;i<this.state.aLng.length;i++){
            if(this.state.aLng[i])
                return true
        }
        return false
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
    getBase(pBu){
        switch(pBu){
            case 0 :
                return [{socle:0},{socle:1},{socle:2}]
            case 1 :
                return [{socle:0},{socle:1},{socle:2},{socle:3},{socle:4}]
            default :
                return this.getChapters(this.state.APP_DATA.chapters)
        }
    }
    getChapters(chapters){
        const a=[]
        chapters.forEach((chapter,i)=>{
            //console.log(chapter)
            a.push({"socle":i})
        })
        return a
    }
    disableBtn(){
        switch(this.state.step){
            case 0 :
                if(this.state.lng!=="")
                    return false
                else
                    return true
                    
            case 1 :
                    return false
            default:
               return false;
        }
    }
    displayPart(indice){
      console.log('displayPart')
        if(!this.state.slide){
            setTimeout(function(){
                this.setState({
                    slide: true
                });
            }.bind(this), 200)
        }
        
        switch(indice){
            case 0:
                return this.displaySplash()
            case 1 :
                return this.displayIntro(this.state.APP_DATA.contents.INTRO.TITRE,this.state.APP_DATA.contents.INTRO.MSG,`${window.PUBLIC_URL}/data/${this.state.APP_DATA.contents.INTRO.IMG}`);
            case 2 : 
                return this.displayIntro(this.state.APP_DATA.contents.PERSO.TITRE,this.state.APP_DATA.contents.PERSO.MSG,`${window.PUBLIC_URL}/data/${this.state.APP_DATA.contents.PERSO.IMG}`);
            case 3 : 
                return this.displayIntro(this.state.APP_DATA.contents["RULES-1"].TITRE,this.state.APP_DATA.contents["RULES-1"].MSG,`${window.PUBLIC_URL}/data/${this.state.APP_DATA.contents["RULES-1"].IMG}`);
            case 4 : 
                return this.displayIntro(this.state.APP_DATA.contents["RULES-2"].TITRE,this.state.APP_DATA.contents["RULES-2"].MSG,`${window.PUBLIC_URL}/data/${this.state.APP_DATA.contents["RULES-2"].IMG}`);
            default:
                return false;
        }
    }
    displaySplash(){
        const useSize =  this.props.useSize
        console.log(useSize)
        return(
            <>
                
                <div className='intro-main-left' style={{minHeight:useSize.isVerySmall ? '300px' : ''}} >
                    <div dangerouslySetInnerHTML={helpers.cleanHTML(lngGenLib)}/>
                    <img src={divider} alt='divider' style={{width:'100%',height:'0.5px'}}/>
                    <div dangerouslySetInnerHTML={helpers.cleanHTML(choicelng)}/>
                    <div className='intro-btn-wrapper'>
                        <div 
                            varriant="outlined"
                            onClick={(e)=>this.handle_select(0)} 
                            className={`btn-choose-lng ${this.state.aLng[0]&&'btn-choose-lng-selected'}`}>
                               FRANÇAIS
                        </div>
                        <div 
                            varriant="outlined"
                            onClick={(e)=>this.handle_select(1)} 
                            className={`btn-choose-lng ${this.state.aLng[1]&&'btn-choose-lng-selected'}`}>
                               ENGLISH
                        </div>
                    </div>
                </div>         
                <div className='intro-main-right'>
                    <ClipImage width={useSize.isVerySmall ? '150px' : '300px'} img={splash} enabled={this.checkLngSelected()} onclick={this.handle_Click} />
                </div>
            </>
        )
    }
    displayLng(){
        //const langs=window.APP_DATA.langs;
        // const matches = useMediaQuery('(min-width:600px)');
    
        return(
            <div>
                <span className='separator'/>
                <div className="tagline" dangerouslySetInnerHTML={helpers.cleanHTML(lngGenLib)} />
                <FormControl variant="outlined" className="form-control">
                    <InputLabel id="lng-select-label" className="form-label">Langue / Language</InputLabel>
                    <Select
                        labelId='lng-select-label'
                        id='lng-select'
                        value={this.state.lng}
                        className="select-style input"
                        onChange={this.handle_Change}
                    >
                        {window.langs.map((item,i)=>{
                            return(
                                <MenuItem key={i} value={item.CODE}>{item.NAME}</MenuItem>
                            )
                        })}
                        </Select>
                </FormControl>
            </div>
        )
    }
    displayIntro(titre,content,image){
        const useSize =  this.props.useSize
        if(!this.state.fileLoaded){
            return(
                <div>
                    LOADING...
                </div>
            )
        }else{
            return(
                <>  
                    <div className='intro-main-left'>
                        <ClipImage width={useSize.isVerySmall ? '150px' : '350px'} img={image} enabled={true} onclick={this.handle_Click} />
                    </div>
                    <div className='intro-main-right-2' >
                        <h3 className='intro-second-title underline'>{titre}</h3>
                        {/* <img src={divider} alt='divider' style={{width:'50%',height:'1px'}}/> */}
                        <div dangerouslySetInnerHTML={helpers.cleanHTML(content)}/>
                        <MobileStepper
                                variant="dots"
                                steps={4}
                                position="static"
                                activeStep={this.state.step-1}
                        />
                    </div>         
                </>
            )  
        }
        
    }
    render(){
        //const background=`${window.PUBLIC_URL}/data/assets/bg/DAC6_SG_Work_Background_.png`
       console.log('render');
       const useSize =  this.props.useSize
        return(
            this.state.redirect ?
            <Redirect to="/module"/>
            :
            <div className="intro">
                <div className={(useSize.isVerySmall ? 'intro-header verySmall' : 'intro-header')}>
                    {
                        this.state.step===0 ?
                        <LogoOmnes width='150px' />
                        :
                        <Header
                            main='Pardon my French !'
                            second={`A newcomer's journey`}
                        />
                    }
                </div>
                <Fade direction="up" in={this.state.slide} mountOnEnter unmountOnExit onEntered={this.setAnimation.bind(this)} onExit={this.setExitAnimation.bind(this)}>
                    <div
                        className={(useSize.isVerySmall ? 'paper verySmall' : 'paper')}
                    >
                        <Tween from={{  opacity:'0' }} duration={3} stagger={0.3} ease="elastic.out(0.2, 0.1)" playState={this.state.mounted ? PlayState.play :PlayState.stop}>
                           <div style={{width:'100%'}}>
                               {this.state.step<1&&
                                    <Title
                                        main='Pardon my French !'
                                        second={`A newcomer's journey`}
                                        big={useSize.isVerySmall ? false : true}
                                        width='100%'
                                    />
                                }
                            </div>
                            <div className="content-main">
                                {this.displayPart(this.state.step)}    
                            </div>
                           
                        </Tween>
                    </div>
                </Fade>
            </div>
             
        )
    }
}
export default Intro;