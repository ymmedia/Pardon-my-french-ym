import React, { useState } from "react";
import "./basics.scss";
import { Tween, PlayState } from "react-gsap";
import checked from "../../../images/checked.svg";
import Helpers from "../../../helpers/helpers.js";
import InfoIcon from "@material-ui/icons/Info";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import LanguageIcon from "@material-ui/icons/Language";
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import CloseIcon from "@material-ui/icons/Close";
import ArrowForwardRoundedIcon from "@material-ui/icons/ArrowForwardRounded";
import { isIE } from "react-device-detect";
import logo from "../../../images/logo-omnes.svg";
import useSizes from "../../../hooks/useSizes";
import { breakpoints } from "../../../constants/breakpoints";
import MediaQuery from "react-responsive";

const ResponsiveImage = (props) => {
  let useSize = useSizes();
  let customStyle =
    props.className !== undefined
      ? `responsive-image${isIE ? "-IE11" : ""} ${props.className}`
      : isIE
      ? "responsive-image-IE11"
      : "responsive-image";
if(useSize.isVerySmall){
  customStyle +=" isSmall"
}
      
  if (props.type !== "svg") {
    if (isIE) {
      return (
        <img src={props.file} className={customStyle} alt={props.content} />
      );
    } else {
      return (
        <img src={props.file} className={customStyle} alt={props.content} />
      );
    }
  } else {
    return (
      <object
        type="image/svg+xml"
        data={props.file}
        className={customStyle}
      ></object>
    );
  }
};

const Vignette = (props) => {
  const { isSelected, viewed, titre, obj, id, isIntro, img } = props;
  //console.log("vignette", props)
  let useSize = useSizes();
  let classMenu = "";
  if (isSelected) {
    if (viewed) {
      classMenu = "menu-v-small";
    } else {
      classMenu = "menu-v-big";
    }
  } else {
    classMenu = "menu-v-small";
  }
  if(useSize.isVerySmall){
    classMenu+=" fullWidth"
  }
  return (
    <div className={classMenu}>
      {props.viewed && (
        <img src={checked} alt="icon-checked" className="v-checked" />
      )}
      <ClipImage
        enabled={isSelected}
        onclick={isSelected ? () => props.handleClick(id) : null}
        img={img}
        width={isSelected ? (isIntro || viewed ? "150px" : "200px") : "150px"}
       
      />
      <div
        className={
          isSelected
            ? viewed
              ? "label-v-small"
              : "label-v-big"
            : "label-v-small"
        }
      >
        <h3>{titre}</h3>
        {obj !== undefined && <p>{obj}</p>}
      </div>
    </div>
  );
};
const Slider = (props) => {
  const { min, max, value } = props;
  return (
    <div className="slidecontainer">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        className="slider"
        onChange={props.onChange}
      />
    </div>
  );
};

const Notification = (props) => {
  const { text, fired } = props;
  const [mounted, setMounted] = useState(!fired);
  console.log("I NOTIF -->", text, fired);
  let useSize = useSizes();
  return (
    <Tween
      from={{ y: "10vh", opacity: "0" }}
      duration={1}
      stagger={0.5}
      ease="elastic.out(0.1, 0.1)"
      onReverseComplete={() => props.callBack()}
      playState={!mounted ? PlayState.play : PlayState.reverse}
    >
      <div  className={useSize.isVerySmall ? 'over-notification over-notification-small ' : 'over-notification'}>
        <div className="notification">
          <div className="header">
            <div onClick={(e) => setMounted(true)} className="btn-close">
              <CloseIcon />
              <p>{Helpers.findLabelInData("CLOSE-BTN")}</p>
            </div>
          </div>
          <InfoIcon fontSize="large" style={{ color: "#FFF" }} />{" "}
          <p dangerouslySetInnerHTML={Helpers.cleanHTML(text)} />
        </div>
      </div>
    </Tween>
  );
};

const FileBtn = (props) => {
  const big = props.big !== undefined ? props.big : false;
  const fileToOpen =
    Helpers.findRessource(Number(props.file)).type === "pdf"
      ? `${window.PUBLIC_URL}/data/${
          Helpers.findRessource(Number(props.file)).url
        }`
      : Helpers.findRessource(Number(props.file)).url;
  let icon;
  switch (Helpers.findRessource(Number(props.file), props.data).type) {
    case "pdf":
      icon = (
        <InsertDriveFileIcon
          fontSize={big ? "large" : "default"}
          className="icon-doc"
        />
      );
      break;
    case "lng":
      icon = (
        <LanguageIcon
          fontSize={big ? "large" : "default"}
          className="icon-doc"
        />
      );
      break;
    case "bonus video":
      icon = (
        <OndemandVideoIcon
          fontSize={big ? "large" : "default"}
          className="icon-doc"
        />
      );
      break;
    case "campus":
      icon = (
        <LocationOnIcon
          fontSize={big ? "large" : "default"}
          className="icon-doc"
        />
      );
      break;
    default:
      break;
  }
  console.log("FILE TO OPEN : ", fileToOpen, props.file);
  const file = Helpers.findRessource(Number(props.file));
  let useSize = useSizes();
  let classItem  
  if(big){
    classItem =  "item-document-big";
  }else{
    classItem =  "item-document";
  }
  if(useSize.isVerySmall){
    classItem = classItem + " item-document-small"
  }
  return (
    <div
      className={classItem}
      onClick={() => window.open(fileToOpen, "file-choices")}
    >
      {icon}
      <p className={big ? "lib-big" : "lib"}>{file.name}</p>
      {!file.viewed && <div className="new-doc" />}
    </div>
  );
};

const LogoOmnes = (props) => {
  const lg = props.width;
  return (
    <div
      className="basics-logo-omnes"
      style={{ backgroundImage: `url(${logo})`, width: lg }}
    />
  );
};

const ClipImage = (props) => {
  const lg = props.width;
  const mt = props.mt !=="" ? props.mt : "";
  const pic = props.img;
  const enabled = props.enabled;
  const small = parseFloat(lg) < 180 ? true : false;
  let useSize = useSizes();
  console.log("MT" , mt,props.mt)
  return (
    <div
      className="basics-clip-image"
      style={{ width: lg, height: lg, margin: !useSize.isLarge ? "auto" : "",marginTop:mt }}
    >
      <div
        className={
          props.color !== undefined
            ? "basics-clip-image-color"
            : "basics-clip-image-pic"
        }
        style={
          props.color !== undefined
            ? { backgroundColor: props.color, width: lg, height: lg }
            : { backgroundImage: `url(${pic})`, width: lg, height: lg }
        }
      />
      {enabled && props.color === undefined && (
        <div
          className={`basics-clip-image-btn ${small ? "btn-small" : ""}`}
          onClick={props.onclick !== undefined ? props.onclick : null}
        >
          <ArrowForwardRoundedIcon className="arrow" />
        </div>
      )}
    </div>
  );
};
const Title = (props) => {
  let useSize = useSizes();
  return (
    <div
      className={`basics-title-box ${!props.big && "basics-title-center"}`}
      style={{ width: props.width }}
    >
      <div className="content-title">
        <div className="content-left">
          <div className="space-icon"></div>{" "}
          <div
            className={props.big ? "icon-left bigHeight" : "icon-left"}
            style={{ height: useSize.isLarge ? "86px" : "65px" }}
          >
            “
          </div>
        </div>
        <div className="content-text">
          <h1 className={props.big ? "main-small bigText" : "main-small"}>
            {props.main}
          </h1>
          <h3 className={useSize.isLarge ? "second-small" : "second-small"}>
            {props.second}
          </h3>
        </div>
        <div className="content-right">
          <div className="icon-right">„</div>
        </div>
      </div>
    </div>
  );
};
const Profil = (props) => {
  return (
    <div
      className="basics-profile"
      onClick={() => {
        props.handleClick();
      }}
    />
  );
};
const Header = (props) => {
  let useSize = useSizes();
  return (
    <div className="basics-header">
      <LogoOmnes width={useSize.isVerySmall ? "80px" : "120px"} />
      <MediaQuery minWidth={breakpoints.lg}>
        <div className="divider" />
      </MediaQuery>

      <Title
        main={props.main}
        second={props.second}
        big={false}
        width={useSize.isLarge ? "23%" : "100%"}
      />
      <MediaQuery minWidth={breakpoints.lg}>
        <div className="divider " style={{ paddingLeft: "70px" }} />
      </MediaQuery>
      <Profil handleClick={props.onGoBack} />
    </div>
  );
};
const CallToAction = (props) => {
    let useSize = useSizes();
  return (
    <div className="basics-cta" style={{marginBottom:useSize.isVerySmall ? "20px" : "80px"}}>
      <div className="cta-separator" />
      <div className="cta-content">{props.content}</div>
      <div className="cta-separator" />
    </div>
  );
};
const TravelProgress = (props) => {
  const { content } = props;
  console.log("----PROPS ID-----", props.id);
  let useSize = useSizes();
  return (
    <div className={useSize.isVerySmall ?  "travel-wrapper-full" : "travel-wrapper"}>
      {content.map((item, id) => {
        return (
          <>
            <div className="step-wrapper" key={id}>
              <ClipImage
                enabled={props.id === item._id ? true : false}
                color={props.id === item._id ? "#f9e66e" : "#9e9db6"}
                width={props.id === item._id ? (useSize.isVerySmall ? "70px" : "100px") : (useSize.isVerySmall ? "55px" : "70px")}
                mt={(useSize.isVerySmall && props.id === item._id ) ? "16px" : "" }
              />
              <div
                className={
                  props.id === item._id ? "step-title-active" : "step-title"
                }
              >
                {item.title}
              </div>
              {props.id === item._id && <div className="step-active" />}
            </div>
            <div className="travel-separator" />
          </>
        );
      })}
    </div>
  );
};
export {
  ResponsiveImage,
  Vignette,
  Slider,
  Notification,
  FileBtn,
  LogoOmnes,
  ClipImage,
  Title,
  Header,
  CallToAction,
  TravelProgress,
  Profil,
};
