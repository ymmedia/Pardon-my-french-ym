import React, { Component } from "react";
import ReactPlayer from "react-player";
import axios from "axios";

const options = {
  headers: { Accept: "application/json", "Content-Type": "application/json" }
};

class ApiPlayer extends Component {
  constructor(props) {
    super(props);
    this.playerRef = React.createRef();
    this.state = {
      //player:new PlayerSdk(this.playerRef,{id:props.id}),
      played: false,
      loaded: false,
      caploaded:false,
      isCaption:false,
      isReady:false,
      videos: {
        titre: "",
        uri: ""
      },
      caption:{}
    };
    this.options = { apiKey: "GlBgDurYrFnBW2sxt9CvlySL5xKb7txtpaxx5pRTyKh" };
  }
  componentDidMount() {
    console.log("mount");
    this.loadVideo()
  }
  componentDidUpdate(prevProps){
    if(prevProps.id!==this.props.id){
       this.loadVideo()
    }
  }
  loadVideo(){
    axios
    .post("https://ws.api.video/auth/api-key", JSON.stringify(this.options))
    .then(async (result) => {
      console.log(result);
      await this.getVideo(result.data.access_token, this.props.id);
      if(this.props.isCaption){
       // console.log("J'AI DES CAPTIONS !!! ")
        await this.getCaption(result.data.access_token, this.props.id)
      }
       
    })
    .catch((err) => {
      console.log("erreur : ", err);
    });
  }
  async getVideo(bearer, id) {
    console.log(bearer, " // ", id);
    const header = {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + bearer
      }
    };
    axios
      .get(`https://ws.api.video/videos/${id}`, header)
      .then(async (result) => {
        console.log("video ", result);
        const vid = {
          titre: result.data.title,
          uri: result.data.assets.hls
        };
        this.setState({ videos: vid, loaded: true });
      })
      .catch((err) => {
        console.log("erreur video : ", err);
      });
  }
  async getCaption(bearer,id){
    const header = {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + bearer
      }
    };
    axios
      .get(`https://ws.api.video/videos/${id}/captions/${this.props.lng}`, header)
      .then(async (result) => {
        //console.log("caption",this.props.lng, result);
        const cap = {
          uri: result.data.uri,
          src: result.data.src,
          lng:result.data.srclang
        };
        this.setState({caption: cap,caploaded:true, isCaption:true});
      })
      .catch((err) => {
        console.log("erreur caption : ", err);
        this.setState({ caption: {},caploaded:true,isCaption:false});
      });

  }
  renderPlayer() {
    return "toto";
  }
  processCaption(){
    const cap=this.state.isCaption?
    { file: {
      attributes: {
        crossOrigin: 'true',
      },
      tracks: [
        {kind: 'subtitles', src: this.state.caption.src, default:true, mode:'showing',srcLang: this.state.caption.lng, showing:this.state.caption.lng}
      ]
    }}
    :
    {file: {
      attributes: {
        crossOrigin: 'true',
        }
      }
    }
    console.log("MES BEAUX CAPTIONS : ", cap)
    return cap
  }
  onReady(){
    console.log("ready :",this, this.state.isReady)
    if (!this.state.isReady) {
      const timeToStart = (7 * 60) + 12.6;
      this.playerRef.current.seekTo(timeToStart, "seconds");
      this.setState({isReady:true})
    }
  }
  fixCaptions(){
    console.log("JE START LES CAPTIONS")
    const video=document.querySelector('video')
    if(this.state.isCaption){
      for(let i=0;i<video.textTracks.length;i++){
        if(video.textTracks[i].language===this.state.caption.lng){
          video.textTracks[i].mode='showing'
          break;
        }
      }
    }
     // document.querySelector('video').textTracks[0].mode='showing'
  }
  render() {
   // console.log("check loading : ", this.state.caploaded," and ", this.state.loaded);
    //this.state.isCaption&&console.log("video in dom ", document.querySelector('video').textTracks);
    const fullLoaded=this.props.isCaption?this.state.caploaded :true
    //const player=new PlayerSdk(this.playerRef,{id:this.props.id});
    return (
      <div>
        {this.state.loaded&&fullLoaded ? (
          <ReactPlayer playing url={this.state.videos.uri} controls={true} width="100%" height="100%" className={this.props.className} config={this.processCaption()} onEnded={this.props.onEndedVideo} onStart={()=>this.fixCaptions()} onReady={this.props.isReplay?()=>this.onReady():()=>{}}/>
        ) : (
          <p>Chargement en cours...</p>
        )}
      </div>
    );
  }
}

export default ApiPlayer;
