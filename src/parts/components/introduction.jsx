import React,{Component} from 'react';
import "./introduction.scss"
import {CardActions, Button, Slide, Fade} from  '@material-ui/core/';
import {ResponsiveImage, Notification,FileBtn,Vignette} from './units/basics'
import divider from './../../images/divider.png';
import helpers from '../../helpers/helpers.js';
import {Tween, PlayState} from 'react-gsap';
import userStore from '../../stores/UserStore';
const params={
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  }

class Introduction extends Component{
    constructor(props)
    {
        super(props);
        this.state={
            
            mounted:false,
            notification:false,
            displayDocs:false,
            idChoice:1000,
            slideIn:true,
            selectedNav:0
        }
        //this.handle_Click_Seq=this.handle_Click_Seq.bind(this)
        this.fireEndTransition=this.fireEndTransition.bind(this);
        this.fireEndTransitionOut=this.fireEndTransitionOut.bind(this);
        this.displayDocs=this.displayDocs.bind(this);
    }
    componentDidUpdate(prevProps){
        if(prevProps.content !==this.props.content){
            this.setState({
                mounted:false,
                notification:false,
                displayDocs:false,
                idChoice:1000,
                slideIn:true,
                selectedNav:0
            })
        }
    }
    initFiles(pContent){
        //const aFiles=[]
        console.log("FILES-->",pContent.file)
        if(pContent.file!==undefined){
           return helpers.processFiles(pContent.file)
        }else
            return []
    }
    fireEndTransition(){
       this.setState({mounted:true})
    }
    fireEndTransitionOut(){
        if(this.state.selectedNav===1000)
            this.props.continueHandler()
        else
            this.props.navigateTo(this.state.selectedNav)
    }
    displayDocs(){
        //console.log("JE DOIS AFFICHER LES DOCUMENTS")
        this.setState({displayDocs:true})
    }
    selectNav(pChoice){
        console.log("SEQUENCE TO NAVIGATE : ",pChoice.slice(pChoice.indexOf('#')+1))
        return pChoice.slice(pChoice.indexOf('#')+1)
    }
    isSequenceComplete(pSeq){
        //console.log("------USER-----");
        //console.log(userStore.getUser().gamePath, this.props.socle)
        const seq=userStore.getUser().gamePath[this.props.socle].sequences.find(seq => seq.id === pSeq)
        if(seq.completed)
            return true;
        else
            return false;
    }
    selectNextSeq(){
        if(!this.isSequenceComplete(this.props.content.items[0].link)){
           return this.props.content.items[0].action
        }else{
            return this.props.content.items[1].action
        }
    }
    selectContent(){
        if(this.isSequenceComplete(this.props.content.items[0].link)){
            return this.props.content.items[1]
        }else{
            return this.props.content.items[0]
        }
    }
    render(){
        //const img=`${window.PUBLIC_URL}/data/assets/bg/socle-0.png`
        const img=`${window.PUBLIC_URL}/${this.props.image}`
        //console.log("titre-->",this.props.content.TITRE)
        //console.log("helpers-->",helpers.findLabelInData("BTN-NEXT"));
        const isChoices=this.props.content.choices!==undefined ? true : false;
        const {mounted,files,slideIn}=this.state
        const useSize =  this.props.useSize
        console.log(this.props)
        return(
                <Slide 
                    direction="left"
                    in={slideIn}
                    mountOnEnter
                    unmountOnExit
                    timeout={700}
                    onEntered={this.fireEndTransition}
                    onExited={this.fireEndTransitionOut}
                 >
                        <div className = {useSize.isVerySmall ?  "content-intro-full" : "content-intro"} >
                        <Tween from={{ x: '-300px', opacity:'0' }} duration={1} stagger={0.5} onComplete={()=>this.setState({notification:true})} ease="elastic.out(0.2, 0.1)" playState={this.state.mounted? PlayState.play :PlayState.stop}>
                            <div className="content-intro-incipit">
                                <h3 className='underline' dangerouslySetInnerHTML={this.props.isBranch?helpers.cleanHTML(helpers.findLabelInData("EXCIPIT-PLUS")):helpers.cleanHTML(this.props.content.TITRE)}/>
                                {/* <img src={divider} alt='divider' style={{width:'60%',height:'1px'}}/> */}
                                <div dangerouslySetInnerHTML={this.props.isBranch?helpers.cleanHTML(this.selectContent().lib):helpers.cleanHTML(this.props.content.INCIPIT)}/>
                            </div>
                            <div className="content-intro-choice">
                                {
                                    isChoices ?
                                    this.props.content.choices.map((choice,id)=>{
                                        return(
                                            <div
                                                className="choice-wrapper" 
                                                onMouseEnter={()=>{this.setState({idChoice:id})}}
                                                onMouseLeave={()=>{this.setState({idChoice:1000})}}
                                                key={id}
                                            >
                                                <Vignette 
                                                    key={id}
                                                    isIntro={true} 
                                                    img={`${window.PUBLIC_URL}/data/${choice.img.replace(/[\[\]]/g,"")}`} 
                                                    isSelected={this.state.idChoice===id ? true : false} 
                                                    viewed={false}
                                                    id={id} 
                                                    titre={choice.item} 
                                                    handleClick={()=>{this.setState({selectedNav:this.selectNav(choice.value),slideIn:false})}}
                                                />
                                            </div>
                                        )
                                    })
                                    :
                                    <div className="choice-wrapper">
                                            <Vignette 
                                                    isIntro={false} 
                                                    img={`${window.PUBLIC_URL}/data/${this.props.isBranch?this.selectContent().img.replace(/[\[\]]/g,""):this.props.content.pic.replace(/[\[\]]/g,"")}`} 
                                                    isSelected={true} 
                                                    viewed={false}
                                                   
                                                    titre={helpers.findLabelInData("BTN-NEXT")} 
                                                    handleClick={()=>{this.setState({selectedNav:this.props.isBranch?this.selectNextSeq():1000,slideIn:false})}}
                                                />
                                    </div>
                                }

                            </div>
                        </Tween>
                        </div>
                </Slide>
        )
        
    }

}
export default Introduction;