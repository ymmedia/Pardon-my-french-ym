import React, { Component } from "react";
import "./module.scss";
import Helpers from "../helpers/helpers";
import UserStore from "../stores/UserStore";
import * as UserActions from "../actions/UserActions";
import { Slide, LinearProgress, Fade } from "@material-ui/core/";
import { withStyles } from "@material-ui/core/styles";
import NavBar from "./components/navbar";
import Introduction from "./components/introduction";
import Conclusion from "./components/conclusion";
import Steps from "./components/steps";
import QuizzFinal from "./quizzFinal";
import { Redirect } from "react-router-dom";
import helpers from "../helpers/helpers.js";
import CloseIcon from "@material-ui/icons/Close";
import {
  Vignette,
  FileBtn,
  Header,
  CallToAction,
  TravelProgress,
  Profil,
} from "./components/units/basics";
import { Tween, PlayState } from "react-gsap";
import axios from "axios";
import iconLocation from "./../images/icon-location.svg";
import iconNotif from "./../images/icon-notification.svg";
import { breakpoints } from "../constants/breakpoints";
import MediaQuery from "react-responsive";

const isTest = false;
const CustomLinear = withStyles({
  root: {
    backgroundColor: "#f9e66e",
    borderColor: "#5d0482",
  },
  bar: {
    backgroundColor: "#5d0482",
  },
})(LinearProgress);

const Notification = (props) => {
  return (
    <div
      className="icon-notif"
      style={{ backgroundImage: `url(${iconNotif})` }}
    >
      <span>{props.number}</span>
    </div>
  );
};
const ProfileDisplay = (props) => {
  return (
    <div className="profile-display">
      <div className="profile-header">
        <Profil onClick={props.handleClick} />
        <div onClick={props.handleClick} className="btn-close">
          <CloseIcon />
          <p>{Helpers.findLabelInData("CLOSE-BTN")}</p>
        </div>
      </div>
      <div className="profile-progression">
        <p>{Helpers.findLabelInData("PROGRESS-LABEL")}</p>
        <div className="linear-wrapper">
          <CustomLinear
            className="linear-profile"
            variant="determinate"
            value={props.progress}
          />
          <span>{`${Math.round(props.progress)} %`}</span>
        </div>
        <p>{Helpers.findLabelInData("RESSOURCES-LABEL")}</p>
        <span
          dangerouslySetInnerHTML={Helpers.cleanHTML(
            `${props.docs.viewed} / <strong>${props.docs.total}</strong>`
          )}
        />
      </div>
      <div className="profile-actions">
        <div className="profile-btn" onClick={props.handleBack}>
          {Helpers.findLabelInData("BTN-REVENIR")}
        </div>
        <div className="profile-btn" onClick={props.handleRestart}>
          {Helpers.findLabelInData("QUIZZ-RESTART")}
        </div>
        <div className="profile-btn" onClick={props.handleQuit}>
          {Helpers.findLabelInData("BTN-QUIT")}
        </div>
      </div>
    </div>
  );
};
const DashBoard = (props) => {
  console.log(props);
  return (
    <div className={props.useSize.isVerySmall ? "wrapper-dashboard verySmallDashboard" :"wrapper-dashboard"}>
      <div className="dashBoard" />
      <div className="circle-location" onClick={props.clickHandler}>
        {props.isNew && (
          <Notification number={UserStore.getUser().newDoc.nbOfNew} />
        )}
        <div
          className="icon-location"
          style={{ backgroundImage: `url(${iconLocation})` }}
        />
      </div>
      <p>{Helpers.findLabelInData("DASH-LABEL")}</p>
    </div>
  );
};

const Ressources = (props) => {
  return (
    <div  className={props.useSize.isVerySmall ? "ressources-wrapper ressources-wrapper-small" :"ressources-wrapper"}>
      <div className="themes-selector">
        {props.themes.map((theme, id) => {
          return (
            <div
              className={`theme-container${
                props.selected === id ? "-active" : ""
              }`}
              key={id}
              onClick={() => props.handleClick(id)}
            >
              <div className="num-theme">{id + 1}</div>
              <div className="label-theme">{theme}</div>
              {UserStore.getNewDocsByTheme(id + 1) > 0 && (
                <div className="notif-new">
                  <span>{UserStore.getNewDocsByTheme(id + 1)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="theme-display">
        {props.categories.map((cat, id) => {
          const docs = UserStore.getFilteredDocs(props.selected + 1, id);
          return (
            docs.length > 0 && (
              <div className="cat-display" key={id}>
                <h3>{cat}</h3>
                <Tween
                  from={{ y: "+30px", opacity: "0" }}
                  duration={0.8}
                  stagger={0.2}
                  ease="elastic.out(0.2, 0.1)"
                  playState={PlayState.play}
                >
                  {docs.map((doc, i) => {
                    return (
                      <div key={i}>
                        <FileBtn key={i} big={false} file={doc._id} />
                      </div>
                    );
                  })}
                </Tween>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

class Module extends Component {
  constructor() {
    super();
    this.state = {
      user: UserStore.getUser(),
      viewMenu: true,
      socleEnCours: "",
      sequenceEnCours: 0,
      quizzFinal: false,
      APP_DATA: UserStore.getData(),
      slide: true,
      mounted: false,
      windowSize: window.innerWidth,
      sliderValue: this.calcSliderPos(1),
      viewDoc: false,
      docSelected: 0,
      isNewDoc: false,
      animRessources: false,
      animDocComplete: false,
      disclaimer: true,
      showMenu: false,
      render: false,
      isRedirect: false,
      redirect: "/",
    };
    this.goBackToModule = this.goBackToModule.bind(this);
    this.handle_Continue = this.handle_Continue.bind(this);
    this.handle_Back = this.handle_Back.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handle_document = this.handle_document.bind(this);
    this.navigateToSequence = this.navigateToSequence.bind(this);
    this.toogleMenu = this.toogleMenu.bind(this);
    this.goRestartModule = this.goRestartModule.bind(this);
  }

  handleWindowClose(e) {
    e.preventDefault();
    UserActions.finishModule(UserStore.getUser().score);
    window.SCORM_HANDLER.windowUnloadHandler();
    console.log("close module");
  }
  componentDidMount() {
    console.log("component mount : ", this.state.user.lng);
    if (this.state.user.lng !== "" && this.state.APP_DATA.title === undefined) {
      //console.log("init file")
      window.addEventListener("beforeunload", (e) => this.handleWindowClose(e));
      this.timer = setInterval(this.checkData.bind(this), 100);
      const url = `${window.PUBLIC_URL}/data/${this.state.user.lng}/structure.json`;
      //console.log("mount !!! ", url);
      axios.get(url).then((results) => {
        //console.log(results.data);
        UserActions.loadData({ data: results.data });
      });
    } else {
      if (!this.state.mounted) {
        this.setState({ render: true, mounted: true });
      }
    }
    // window.addEventListener("resize", this.handleResize);
  }
  componentDidUpdate() {
    console.log("update component module");
  }
  componentWillUnmount() {
    console.log("componentWillUnmount");
    window.removeEventListener("beforeunload", (e) =>
      this.handleWindowClose(e)
    );
    window.removeEventListener("resize", this.handleResize);
  }
  getSequence(indice) {
    console.log(
      "SEQUENCE EN COURS !!!! ---> ",
      indice,
      "/// ",
      UserStore.getUser().gamePath[indice].sequences
    );
    return UserStore.getUser().gamePath[indice].sequences;
  }
  checkData() {
    if (this.state.APP_DATA !== undefined) {
      // console.log("get Data",this.state.APP_DATA);
      clearInterval(this.timer);
      this.setState({ render: true, APP_DATA: UserStore.getData() });
    }
  }
  handleResize() {
    console.log(window.innerWidth);
    this.setState({ windowSize: window.innerWidth });
    window.resizeTo(window.width, window.height);
  }
  closeDocWindow() {
    UserStore.setNewDocsToViewed();
    this.setState({ viewDoc: false, isNewDoc: false, docSelected: 0 });
  }
  setAnimation() {
    console.log("ENTER");
    const { mounted } = this.state;
    this.setState({ mounted: true });
  }
  setExitAnimation() {
    console.log("EXIT");
    this.setState({ mounted: false });
  }
  handleSliderChange = (event) => {
    this.setState({ sliderValue: event.target.value });
    //console.log("value :", event.target.value)
  };
  checkUser() {
    // go back to intro if there is no user
    let { user } = this.state;
    if (user.lng === "") {
      //UserActions.restartGame();
      return <Redirect to="/" />;
    }
  }

  startModule(event, module, indice) {
    // Démarre le module
    let { currentSocleIndex, currentSocle } = this.getGameStatus();
    let gamePath = UserStore.getUser().gamePath;
    console.log("-----START-----");
    console.log(module, "/////", indice);
    if (currentSocleIndex !== -1) {
      gamePath[currentSocleIndex] = {
        module: currentSocle,
        progress: gamePath[currentSocleIndex].progress,
        sequence: 0,
        sequences: this.getSequence(indice),
      };
    }

    this.setState({
      viewMenu: false,
      socleEnCours: module,
      slide: true,
      sliderValue: 1,
    });
    UserActions.changeUser({
      gamePath: gamePath,
    });
    console.log(UserStore.getUser().gamePath);

    console.log("Module ", module, "démarré");
  }

  toogleMenu() {
    this.setState({ showMenu: !this.state.showMenu });
  }
  goBackToModule() {
    //Retour au Menu/Dashboard
    console.log(
      UserStore.getUser().gamePath,
      " // ",
      this.state.sequenceEnCours,
      " //",
      this.state.socleEnCours
    );
    this.setState({
      viewMenu: true,
      quizzFinal: false,
      showMenu: false,
      sliderValue: this.calcSliderPos(
        this.getGameStatus().currentSocleIndex + 1
      ),
    });
    //return <Redirect to="/module" />;
  }
  goRestartModule() {
    UserActions.restartGame();
    this.setState({
      viewMenu: true,
      showMenu: false,
      isRedirect: true,
      redirect: "/",
    });
  }
  handle_document() {
    console.log("DOC !!!");
    this.setState({ viewDoc: true });
  }
  handle_Continue() {
    // Appellé depuis steps. Check si le module prends fin et passe au suivant
    // ou bien si on reste sur le même module et on change de séquence.

    let newStateSequence;
    let stateViewMenu;
    let newStateSocle;
    let globalProgress;

    let gamePath = UserStore.getUser().gamePath;
    let { nextSocle, currentSocleIndex, currentSocle } = this.getGameStatus();
    const nextSequence = this.state.sequenceEnCours + 1;
    let progress = this.calculModuleProgress(currentSocle, currentSocleIndex);
    if (
      nextSequence <=
      this.state.APP_DATA.chapters[currentSocleIndex].sequences.length - 1
    ) {
      console.log("je continue sur le socle : ", this.state.socleEnCours);
      console.log("Sequence en cours : ", nextSequence);

      stateViewMenu = false;
      newStateSequence = nextSequence;
      newStateSocle = this.state.socleEnCours;
      globalProgress = this.state.user.globalProgress;
      gamePath[currentSocleIndex] = {
        module: currentSocle,
        progress: progress,
        sequences: this.updateSequences(
          this.state.sequenceEnCours,
          currentSocleIndex
        ),
        sequence: nextSequence,
      };
    } else if (
      this.state.sequenceEnCours ===
      this.state.APP_DATA.chapters[currentSocleIndex].sequences.length - 1
    ) {
      console.log("je change de socle", nextSocle);

      globalProgress = this.calculGlobalProgress();
      let inside;
      if (nextSocle !== undefined)
        inside = this.state.user.gamePath.find(
          (i) => i.module._id === nextSocle._id
        );
      else inside = null;

      stateViewMenu = true;
      newStateSequence = 0;
      newStateSocle = inside !== null ? nextSocle._id : currentSocle._id;
      gamePath[currentSocleIndex] = {
        module: currentSocle,
        progress: progress,
        sequences: this.updateSequences(
          this.state.sequenceEnCours,
          currentSocleIndex
        ),
        sequence: 0,
      };

      if (inside === undefined || !inside === null) {
        //Ajout du nouveau module débloqué dans GamePath
        if (gamePath.length < this.state.APP_DATA.chapters.length) {
          gamePath.push({
            module: nextSocle,
            progress: 0,
            sequence: 0,
          });
        }
      }
    }
    UserActions.changeUser({
      globalProgress: globalProgress,
      gamePath: gamePath,
    });

    this.setState({
      slide: false,
    });
    setTimeout(
      function () {
        this.setState({
          user: UserStore.getUser(),
          viewMenu: stateViewMenu,
          sequenceEnCours: newStateSequence,
          socleEnCours: newStateSocle,
          sliderValue: stateViewMenu
            ? this.calcSliderPos(currentSocleIndex + 2)
            : 0,
        });
      }.bind(this),
      150
    );

    console.log("slide continue : ", this.state.slide);
    console.log("gamePath : ", this.state.user.gamePath);
    console.log("user : ", this.state.user);
  }

  handle_Back(indexMenuSeq) {
    console.log("NEW SEQUENCE", indexMenuSeq);
    let gamePath = UserStore.getUser().gamePath;
    let { currentSocleIndex, currentSocle } = this.getGameStatus();
    //const sequenceClicked = this.state.sequenceEnCours - 1;
    gamePath[currentSocleIndex].module = currentSocle;
    gamePath[currentSocleIndex].progress = this.updateProgress(
      gamePath[currentSocleIndex].sequences
    );
    gamePath[currentSocleIndex].sequence = indexMenuSeq;

    UserActions.changeUser({
      gamePath: gamePath,
    });
    this.setState({
      user: UserStore.getUser(),
      sequenceEnCours: indexMenuSeq,
    });
  }
  navigateToSequence(indexSequence) {
    let { currentSocleIndex, currentSocle } = this.getGameStatus();
    let gamePath = UserStore.getUser().gamePath;
    //let currentSequenceIndex= gamePath[currentSocleIndex].sequences.findIndex(s=>s.id===currentSequence);
    //console.log("current : ",currentSequence,currentSequenceIndex)
    gamePath[currentSocleIndex].sequences[
      this.state.sequenceEnCours
    ].completed = true;
    UserActions.changeUser({
      gamePath: gamePath,
    });
    const sequence = this.state.APP_DATA.chapters[
      currentSocleIndex
    ].sequences.findIndex((s) => s._id === indexSequence);
    console.log("INDEX SEQUENCE : ", sequence, indexSequence);
    this.handle_Back(sequence);
  }
  updateSequences(pNumSeq, pSocle) {
    let s = this.getSequence(pSocle);
    console.log("sequences :", s, " : ", pNumSeq);
    s[pNumSeq].completed = true;
    return s;
  }
  updateProgress(sequences) {
    let fraction = 0;
    console.log(sequences);
    sequences.map((seq) => {
      if (seq.completed) fraction++;
    });
    return (fraction / sequences.length) * 100;
  }
  calcSliderPos(indice) {
    //return ((600*4)-window.innerWidth)*(indice*600/((600*4)-window.innerWidth))   ;
    //const max=4
    return 600 * indice - window.innerWidth < 0
      ? 0
      : 600 * indice - window.innerWidth;
  }
  calculGlobalProgress() {
    console.log("CALCUL GLOBAL PROGRESS : ", UserStore.getUser().gamePath);
    const { gamePath } = this.state.user;
    let globalProgress = 0;
    gamePath.forEach((module) => {
      globalProgress += module.progress;
    });
    console.log("PROGRES TOTAL : ", globalProgress / gamePath.length);
    if (Math.round(globalProgress / gamePath.length))
      UserActions.changeUser({ moduleFinished: true });
    return Math.round(globalProgress / gamePath.length);
    //return 100;
  }
  changeGlobalProgress() {
    console.log("CHANGE GLOBAL PROGRESS : ", UserStore.getUser().gamePath);
    let progress = 0;
    UserStore.getUser().gamePath.map((sequence) => {
      progress += sequence.progress;
      //console.log("progress" +progress)
    });
    UserActions.changeUser({
      globalProgress: Math.round(
        progress / UserStore.getUser().gamePath.length
      ),
    });
    //return 100;
  }
  calculModuleProgress(currentSocle, currentSocleIndex) {
    let moduleProgress = this.state.user.gamePath[currentSocleIndex].progress;
    if (moduleProgress > 90) return 100;

    console.log("MODULE PROGRESS,", moduleProgress);
    if (this.state.user.gamePath[currentSocleIndex].progress < 100) {
      let nbSeq =
        this.state.APP_DATA.chapters[currentSocleIndex].sequences.length;
      let fraction = Math.round(100 / nbSeq);
      if (moduleProgress === 0) {
        return fraction;
      } else if (moduleProgress + fraction > 95) {
        return 100;
      } else {
        return moduleProgress + fraction;
      }
    } else {
      return moduleProgress;
    }
  }

  getGameStatus() {
    //Définit les variables qui serviront à poursuivre le flow entre séquence et module
    let currentSocleId = this.state.socleEnCours;
    if (this.state.socleEnCours === "") {
      currentSocleId = "D1";
    }
    let array = this.state.APP_DATA.chapters;
    let currentSocleIndex = array.findIndex((i) => i._id === currentSocleId);
    //console.log("LES PARAMS : ",currentSocleIndex, currentSocleId)
    let currentSocle =
      currentSocleIndex !== -1
        ? array.find((i) => i._id === currentSocleId)._id
        : null;
    let nextSocle = array[currentSocleIndex + 1];
    let ongoingGame = {
      currentSocle: currentSocle,
      currentSocleId: currentSocleId,
      currentSocleIndex: currentSocleIndex,
      nextSocle: nextSocle,
    };
    //console.log("ongoingGame", ongoingGame);
    return ongoingGame;
  }

  isModuleFinish(i) {
    if (i <= this.state.user.gamePath.length - 1) {
      if (this.state.user.gamePath[i].progress === 100) {
        return "REPRENDRE";
      } else if (this.state.user.gamePath[i].progress > 0) {
        return "CONTINUER";
      } else {
        return "DEMARRER";
      }
    } else {
      return "DEMARRER";
    }
  }

  continueModule(event, module, indice) {
    //console.log(this.state.user.gamePath);
    this.setState({
      viewMenu: false,
      slide: !this.state.slide,
      socleEnCours: module,
      sequenceEnCours: this.state.user.gamePath[indice].sequence,
    });
  }

  navBarSequence(seq) {
    // Regroupe le nom des séquence en tableau pour la navbar.
    const menu = [];
    if (this.state.quizzFinal) {
      this.state.APP_DATA.quizz.forEach((element, i) => {
        menu.push({
          id: i,
          titre: "Question # " + i,
        });
      });
    } else {
      const sequences = this.state.APP_DATA.chapters.find(
        (item) => item._id === seq
      ).sequences;
      sequences.forEach((element, i) => {
        menu.push({
          id: i,
          titre: element.titre,
        });
      });
    }
    return menu;
  }

  getTitre(seq) {
    if (this.state.quizzFinal) {
      return helpers.findLabelInData("QUIZZ-TITRE");
    } else {
      return seq !== ""
        ? this.state.APP_DATA.chapters.find((item) => item._id === seq).title
        : "TITRE DE LA SÉQUENCE";
    }
  }

  isVisible(indice) {
    // Active un module lorsque qu'il arrive dans la GamePath
    if (indice <= this.state.user.gamePath.length - 1) {
      return true;
    } else {
      return false;
    }
  }
  isSequenceComplete(indice) {
    //console.log("indice ",indice, UserStore.getUser().gamePath[indice])
    if (UserStore.getUser().gamePath[indice] === undefined) return false;

    if (UserStore.getUser().gamePath[indice].progress > 90) return true;
    else return false;
   // return true
  }
  displayActivity(socle, sequence,useSize) {
   console.log("activity : ",socle,sequence,useSize)
    if (!this.state.slide) {
      setTimeout(
        function () {
          this.setState({
            slide: true,
          });
        }.bind(this),
        300
      );
    } else {
      if (this.state.quizzFinal) {
        return (
          <QuizzFinal
            handleBack={() =>
              this.setState({ quizzFinal: false, viewMenu: true })
            }
          />
        );
      } else {
        const activity = this.state.APP_DATA.chapters.find(
          (seq) => seq._id === socle
        ).sequences[sequence];
        console.log("activity : ", activity);
        console.log("activity type : ", activity.type);
        switch (activity.type) {
          case "INTRO":
            return (
              <Slide
                direction={"left"}
                in={this.state.slide}
                mountOnEnter
                unmountOnExit
              >
                <Introduction
                  image={
                    this.state.APP_DATA.chapters.find(
                      (seq) => seq._id === socle
                    ).illustration
                  }
                  content={activity}
                  backHandler={this.goBackToModule}
                  continueHandler={this.handle_Continue}
                  useSize = {useSize}
                />
              </Slide>
            );
          case "CONCLUSION":
            return (
              <Slide
                direction={"left"}
                in={this.state.slide}
                mountOnEnter
                unmountOnExit
              >
                <Conclusion
                  image={
                    this.state.APP_DATA.chapters.find(
                      (seq) => seq._id === socle
                    ).illustration
                  }
                  content={activity}
                  backHandler={this.goBackToModule}
                  continueHandler={this.handle_Continue}
                  useSize = {useSize}
                />
              </Slide>
            );
          default:
            return (
              <Slide
                direction={"left"}
                in={this.state.slide}
                mountOnEnter
                unmountOnExit
              >
                <Steps
                  socleEnCours={this.getGameStatus().currentSocleIndex}
                  content={activity}
                  backHandler={this.goBackToModule}
                  navigateToSequence={this.navigateToSequence}
                  continueHandler={this.handle_Continue}
                  notifHandler={() => this.setState({ isNewDoc: true })}
                  useSize = {useSize}
                />
              </Slide>
            );
        }
      }
    }
  }

  displayMenu() {
    if (this.state.APP_DATA === undefined) return;
    const chapters = this.state.APP_DATA.chapters;
    let timeout = 0;
    const colors = ["#78ba95", "#6eacb0", "#959fc7", "#6eacb0"];
    console.log("CHAPTERS", chapters.length);
    let { currentSocleIndex, currentSocle } = this.getGameStatus();
    console.log(
      "INDEX EN COURS",
      currentSocleIndex,
      this.calculGlobalProgress()
    );
    return (
      <>
        <CallToAction content={"IT'S YOUR TURN!"} />

        {chapters.map((chapter, i) => {
          return (
            <>
              <Tween
                from={{ x: "+15px", opacity: "0", scale: 1.1 }}
                duration={1}
                delay={i === 0 ? 0 : i / 3}
                stagger={0.4}
                ease="elastic.out(0.2, 0.1)"
                playState={this.state.mounted ? PlayState.play : PlayState.stop}
              >
                <div
                  key={i}
                  className={
                    i === 0
                      ? "vignette-wrapper"
                      : this.isSequenceComplete(i - 1)
                      ? "vignette-wrapper"
                      : null
                  }
                >
                  <Vignette
                    key={i}
                    img={`${window.PUBLIC_URL}/data/${chapter.illustration}`}
                    color={colors[i]}
                    isSelected={
                      i === 0
                        ? true
                        : this.isSequenceComplete(i - 1)
                        ? true
                        : isTest
                    }
                    viewed={this.isSequenceComplete(i)}
                    id={chapter._id}
                    titre={chapter.title}
                    obj={chapter.resume}
                    handleClick={(event) =>
                      this.startModule(event, chapters[i]._id, i)
                    }
                  />
                  { (chapters.length-1>i ) ?
                    <MediaQuery maxWidth={breakpoints.sm}>
                    <div className="dashed-menu-full" />
                  </MediaQuery> : <MediaQuery maxWidth={breakpoints.sm}><div style={{with:'100%' ,height:'160px'}}></div></MediaQuery>
                  }
                  
                </div>
                <MediaQuery minWidth={breakpoints.lg}>
                  <div className="dashed-menu" />
                </MediaQuery>
              </Tween>
            </>
          );
        })}
      </>
    );
  }
  calculatePos() {
    const v = this.state.sliderValue;
    //console.log("position ",v)
    return -v;
  }
  processChaptersHeaders() {
    const a = [];
    this.state.APP_DATA.chapters.map((chapter) => {
      a.push({
        _id: chapter._id,
        title: chapter.title,
      });
    });
    return a;
  }
  render() {
    const {
      viewMenu,
      viewDoc,
      socleEnCours,
      sequenceEnCours,
      user,
      windowSize,
      APP_DATA,
      isNewDoc,
    } = this.state;
    //console.log("DATAS --->", user,APP_DATA);
    console.log("DOCS---> ", UserStore.getUser().docs);
    //let animDocComplete=false;
    const useSize = this.props.useSize;
    console.log(useSize);

    return (
      <>
        {this.state.isRedirect && <Redirect to={this.state.redirect} />}
        {UserStore.getUser().lng === undefined && <Redirect to={"./"} />}
        {this.state.render && (
          <Slide
            direction="left"
            in={this.state.slide}
            mountOnEnter
            unmountOnExit
            onEntered={this.setAnimation.bind(this)}
            onExit={this.setExitAnimation.bind(this)}
          >
            <div className={useSize.isVerySmall ? 'viewer viewer-small ' : 'viewer'}>
              <div className="module-header">
                <Header
                  main="Pardon my French !"
                  second={`A newcomer's journey`}
                  onGoBack={this.toogleMenu}
                />
              </div>
              {this.checkUser()}
              {APP_DATA !== undefined && (
                <NavBar
                  simple={viewMenu}
                  titre={viewMenu ? null : this.getTitre(socleEnCours)}
                  content={viewMenu ? null : this.navBarSequence(socleEnCours)}
                  activeSeq={this.state.quizzFinal ? null : sequenceEnCours}
                  goToModule={this.goBackToModule}
                  backHandler={this.handle_Back}
                  docHandler={this.handle_document}
                  gamePath={
                    UserStore.getUser().gamePath[
                      this.getGameStatus().currentSocleIndex
                    ]
                  }
                />
              )}
              {this.state.showMenu && (
                <Tween
                  from={{ y: "+30px", opacity: "0" }}
                  duration={1}
                  stagger={0.6}
                  ease="strong.out(0.2, 0.1)"
                  playState={
                    this.state.showMenu ? PlayState.play : PlayState.reverse
                  }
                >
                  <div className="over-documents">
                    <Tween
                      from={{ x: "+250px" }}
                      duration={0.8}
                      delay={1}
                      ease="strong.out(0.2, 0.1)"
                      playState={
                        this.state.showMenu ? PlayState.play : PlayState.reverse
                      }
                    >
                      <div className="menu-profile">
                        <ProfileDisplay
                          handleClick={() =>
                            this.setState({ showMenu: !this.state.showMenu })
                          }
                          handleBack={this.goBackToModule}
                          handleClose={() => window.onCloseHandler()}
                          handleRestart={() => this.goRestartModule()}
                          progress={this.calculGlobalProgress()}
                          docs={{
                            viewed: UserStore.getUser().docs.length,
                            total: this.state.APP_DATA.ressources.length,
                          }}
                        />
                      </div>
                    </Tween>
                  </div>
                </Tween>
              )}
              {this.calculGlobalProgress() > 95 &&
                this.state.disclaimer &&
                UserStore.getUser().score < 80 &&
                APP_DATA !== undefined && (
                  <Tween
                    from={{ y: "+30px", opacity: "0" }}
                    duration={1}
                    stagger={0.6}
                    ease="strong.out(0.2, 0.1)"
                    playState={
                      this.state.disclaimer ? PlayState.play : PlayState.reverse
                    }
                  >
                    <div className="over-documents">
                      <div className="viewer-disclaimer">
                        <div className="header">
                          <h3>{Helpers.findLabelInData("TITRE-DISCLAIMER")}</h3>
                          <div
                            onClick={(e) =>
                              this.setState({ disclaimer: false })
                            }
                            className="btn-close"
                          >
                            <CloseIcon />
                            <p>{Helpers.findLabelInData("CLOSE-BTN")}</p>
                          </div>
                        </div>
                        <div
                          className="messages"
                          dangerouslySetInnerHTML={Helpers.cleanHTML(
                            APP_DATA.contents.DISCLAIMER.MSG
                          )}
                        />
                      </div>
                    </div>
                  </Tween>
                )}
              {viewDoc && (
                <Tween
                  from={{ y: "+30px", opacity: "0" }}
                  duration={1}
                  stagger={0.6}
                  ease="strong.out(0.2, 0.1)"
                  onComplete={() => this.setState({ animRessources: true })}
                  onReverseComplete={() =>
                    this.setState({
                      viewDoc: false,
                      animRessources: false,
                      animDocComplete: false,
                    })
                  }
                  playState={viewDoc ? PlayState.play : PlayState.stop}
                >
                  <div className="over-documents">
                    <div className="viewer-document">
                      <div className="header">
                        <h3>{Helpers.findLabelInData("DASH-LABEL")}</h3>
                        <div
                          onClick={() => this.closeDocWindow()}
                          className="btn-close"
                        >
                          <CloseIcon />
                          <p>{Helpers.findLabelInData("CLOSE-BTN")}</p>
                        </div>
                      </div>
                      <div className="document-comment">
                        {Helpers.findLabelInData("INCIPIT-DOCS")}
                      </div>
                      <Ressources
                        categories={UserStore.getCategories()}
                        themes={UserStore.getThemes()}
                        selected={this.state.docSelected}
                        useSize={useSize}
                        handleClick={(i) => {
                          this.setState({ docSelected: i });
                        }}
                      />
                    </div>
                  </div>
                </Tween>
              )}
              <Tween
                to={{ x: `0px` }}
                duration={2}
                ease="elastic.out(0.2, 0.1)"
                playState="play"
              >
                <div className="main-viewport">
                  {viewMenu ? (
                    this.displayMenu()
                  ) : (
                    <>
                      <TravelProgress
                        id={socleEnCours}
                        content={this.processChaptersHeaders()}
                      />
                      {this.displayActivity(socleEnCours, sequenceEnCours,useSize)}
                    </>
                  )}
                </div>
              </Tween>
              <DashBoard
                isNew={isNewDoc}
                clickHandler={() => this.setState({ viewDoc: true })}
                useSize={useSize}
              />
            </div>
          </Slide>
        )}
      </>
    );
  }
}
export default Module;
