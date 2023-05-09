import React , {useState} from 'react';
import "./navbar.scss"
import {Stepper, Step, StepLabel, Divider, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import logo from '../../images/logo-white.svg';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import helpers from '../../helpers/helpers';


const checkIndice=(content,gamePath)=>{
    const pas=100/content.length
    const progRef=gamePath.progress
    const seqMax=progRef/pas
   // console.log("value : ",pas," ",progRef," ",seqMax," ",gamePath)
    return Math.round(seqMax)
}


function TemporaryDrawer(content, goToModule, activeSeq, backHandler,docHandler,gamePath){
    const [open, setIsOpen] = useState(false);
    const iconKing=`${window.PUBLIC_URL}/data/assets/DAC6_SG_Work_Icons_NavBarIcon.png`
    //console.log("menu",docHandler,gamePath)

    const toggleDrawer = (event, pOpen, index = null) => {
        console.log("gamepath :",gamePath, " : ", index)
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsOpen(!open);
        if(index !== null){
          
                backHandler(index);
        
        }
    };
    const gotoDoc=()=>{
        setIsOpen(false);
        docHandler();
    }
    return (
        <div className="menu-drawer">
            <IconButton 
                aria-label="Menu"
                style={{ backgroundColor: 'transparent' }} 
                onClick={(event) => toggleDrawer(event, true)}>
                <MenuIcon className="menu-icon" style={{fontSize : "2em"}}/>
            </IconButton>
            <Drawer
                anchor={"left"}
                width={500}
                open={open}
                onClose={(event) => toggleDrawer(event, false)}
            >
                
                <List className="drawer-title">
                    <ListItem >
                        <MenuOpenIcon 
                            style={{fontSize:'2rem',color:'#333333'}}
                            onClick={(event) => toggleDrawer(event, true)}
                        />
                        <ListItemText disableTypography={true} primary="CHOICES - MENU" style={{fontFamily:"'Permanent Marker', cursive",marginLeft: "1rem"}}/>
                    </ListItem>
                    <Divider style={{margin : "0.5em"}}/>
                </List>
                <List className="drawer-list">
                    <ListItem button className="drawer-item-actif" onClick={goToModule}>
                        <ListItemText disableTypography={true} primary={helpers.findLabelInData("BTN-MENU")} style={{fontFamily:"'Montserrat', sans-serif",fontWeight:'700',marginLeft: "1rem"}} />
                    </ListItem>
                    <Divider style={{margin : "0.5em"}}/>
                    {activeSeq === null ? null :
                        content.map((item, index)=>{
                            let text = (index+1) +". "+ item.titre;
                            return(
                                <ListItem 
                                    key={index}
                                    button
                                    disable={index<=checkIndice(content,gamePath)? "true" : "false"} 
                                    onClick={index<=checkIndice(content,gamePath)?(event) => toggleDrawer(event, false, index):null}
                                    className={index<=checkIndice(content,gamePath)? "drawer-item-actif" : null}>
                                    <ListItemText 
                                    disableTypography={true} 
                                    primary={<span dangerouslySetInnerHTML={helpers.cleanHTML(text)} />} 
                                    style={{fontFamily:"'Montserrat', sans-serif",fontWeight:'400',marginLeft: "2rem"}}
                                    />
                                </ListItem>
                            )
                        })
                    }
                    <Divider style={{margin : "0.5em"}}/>
                        <ListItem button className="drawer-item-actif" onClick={gotoDoc}>
                            <ListItemText disableTypography={true} primary={helpers.findLabelInData("BTN-DOCUMENTS")} style={{fontFamily:"'Montserrat', sans-serif",fontWeight:'700',marginLeft: "1rem"}} />
                    </ListItem>
                </List>
            </Drawer>    
        </div>
    )
}



const NavBar = ({simple, titre, content, activeSeq, goToModule, backHandler,docHandler,gamePath}) => {
    if(window.APP_DATA===undefined)
        return(<></>)
    return(
        <div className='nav'>
            {simple ? <><img className='logo' src = {logo} alt="CHOICES"/> <p className="baseline-header">{helpers.findLabelInData("MENU-LABEL")}</p></>
                : <>
                    {TemporaryDrawer(content, goToModule, activeSeq, backHandler,docHandler,gamePath)}
                    <img className='logo-small' src = {logo} alt="Choices"/>
                    <div className="l-separator"></div> : 
                    <h2 className="titre-nav">{titre}</h2>
                    {activeSeq === null ? 
                        <div className="m-separator"></div> : 
                        <div className="active-seq">
                            <ArrowRightIcon style={{fontSize:'2 rem',color:'#FFFFFF'}}/>
                            <p dangerouslySetInnerHTML={helpers.cleanHTML(content[activeSeq].titre)}/>
                        </div>
                    }
                    
                </>
            }
        </div>
    )

}

export default NavBar;
