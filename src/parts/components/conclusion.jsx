import React,{Component} from 'react';
import "./introduction.scss";
import {Vignette,Notification, FileBtn} from "./units/basics.jsx";
import UserStore from "../../stores/UserStore";
import * as UserActions from "../../actions/UserActions"
import helpers from "../../helpers/helpers";
import divider from './../../images/divider.png';
import  {Paper, CardContent, CardActions, Button,Slide,Fade} from  '@material-ui/core/';
import {Tween, PlayState} from 'react-gsap';

class Conclusion extends Component{
    constructor(props)
    {
        super(props);
        this.state={
            mounted:false,
            files:this.initFiles(this.props.content),
            notification:false,
            displayDocs:false,
            removeNotification:false,
    
        }
        this.fireEndTransition=this.fireEndTransition.bind(this);
        this.displayDocs=this.displayDocs.bind(this)
    }
    initFiles(pContent){
        //const aFiles=[]
        console.log("FILES-->",pContent.pic)
        if(pContent.pic!==undefined){
           return helpers.processFiles(pContent.pic)
        }else
            return []
    }
    displayDocs(){
        console.log("JE DOIS AFFICHER LES DOCUMENTS")
        /* const Tempdocs=UserStore.getUser().docs;
        Tempdocs.push(...this.state.files)
        console.log("docs",this.state.files,"/", Tempdocs)
        UserActions.changeUser({docs:Tempdocs.filter((item, index) => Tempdocs.indexOf(item) === index)}) */
        UserActions.updateDocs(this.state.files)
        this.setState({displayDocs:false,removeNotification:true})
        this.props.notifHandler();
    }
    displayAddContent(mounted){
        if(this.props.content.activities.length>1){
           return this.props.content.activities.map((element,id) => {
            return this.displayBloc(element,id,mounted)
            });
        }
    }
    fireEndTransition(){
        this.setState({mounted:true})
     }
    displayBloc(content,id,mounted){
        //console.log("add bloc",content);
        if(content.type === "MORE"){
          return(
            <Fade key={id} 
            in={mounted} 
            mountOnEnter unmountOnExit onEntered={()=>this.setState({notification:true})}>
                    <Paper key={id} className="bloc-content-conclusion">
                        <h3>{content.TITRE}</h3>
                        <p>{content.PAR !== undefined ? CardContent.PAR :null }</p>
                        <ul>
                        {content.items ? 
                        content.items.map((item,key)=>{
                            return(<li key={key}>{item.content}</li>)
                            }) : <div dangerouslySetInnerHTML={helpers.cleanHTML(content.CONTENT)}/>}
                        </ul>
                        <p dangerouslySetInnerHTML={helpers.cleanHTML(content.WARNING)}/>
                    </Paper>
            </Fade>
            )  
        }
        else{
            return (
                <Fade key={id} 
                in={mounted} 
                mountOnEnter unmountOnExit>
                <div key={id} dangerouslySetInnerHTML={helpers.cleanHTML(content.CONTENT)}/>
                </Fade>
            )
        }
        
    }
    render(){
        //const img=`${window.PUBLIC_URL}/data/assets/bg/socle-0.png
        const {mounted,files}=this.state;
        const ressources=UserStore.getData().ressources
        const finalMsg=helpers.findLabelInData("NOTIF-MSG").replace('%%%',files.length);
        console.log("PROPS", this.props.continueHandler)
        const useSize =  this.props.useSize
        return(
            <Slide 
                direction="left"
                in={true}
                mountOnEnter
                unmountOnExit
                timeout={700}
                onEntered={this.fireEndTransition}
            >
                <div className = {useSize.isVerySmall ?  "content-intro-full" : "content-intro"} >
                {(files.length>0&&this.state.notification&&!this.state.removeNotification)&&
                        <Notification 
                            fired={this.state.notification}
                            text={finalMsg}
                            callBack={this.displayDocs}
                        />
                    }
                <Tween from={{ x: '-300px', opacity:'0' }} duration={1} stagger={0.5} ease="elastic.out(0.2, 0.1)" onComplete={()=>this.setState({notification:true})} playState={this.state.mounted? PlayState.play :PlayState.stop}>
                   
                    <div className="content-intro-incipit">
                        <h3 className='underline'>{helpers.findLabelInData("EXCIPIT-LABEL")}</h3>
                        {/* <img src={divider} alt='divider' style={{width:'60%',height:'1px'}}/> */}
                        <div dangerouslySetInnerHTML={helpers.cleanHTML(this.props.content.CONTENT)}/>
                    </div>
                    <div className="content-intro-choice">
                        <div className="choice-wrapper">
                            <Vignette 
                                isIntro={false} 
                                img={`${window.PUBLIC_URL}/data/${this.props.image.replace(/[\[\]]/g,"")}`} 
                                isSelected={true} 
                                viewed={false}
                                
                                titre={helpers.findLabelInData("BTN-NEXT")} 
                                handleClick={this.props.continueHandler}
                            />
                        </div>
                    </div>
                </Tween>
                {this.state.displayDocs&&
                        <div className="container-doc-end">
                            <Tween from={{ x: '+30px', opacity:'0' }} duration={0.8} stagger={0.3} onComplete={()=>this.setState({notification:true})} ease="elastic.out(0.2, 0.1)" playState={this.state.mounted? PlayState.play :PlayState.stop}>
                                {
                                    this.state.files.map((file,i)=>{
                                        return(
                                            <div key={i} > 
                                                    <FileBtn file={file} data={ressources}/>
                                            </div>
                                            

                                        )
                                    })
                                }
                            </Tween>
                        </div>
                    }  
                </div>
        </Slide>
        )
        
    }

}
export default Conclusion;