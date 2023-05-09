import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';

import { WaveformContianer, Wave, PlayButton ,WaveformContianerSmall, WaveSmall, PlayButtonSmall } from './Wavesurfer.styled';

class AudioPlayer extends Component {  
    constructor (props){
        super(props)
        this.state = {
            playing: true,
            file : this.props.file
          };
        this.waveform ={}
        this.handlePlay=this.handlePlay.bind(this)
    }
   

  componentDidMount() {
   console.log("AUDIO MOUNT WaveformContianerSmall",this.props)
    this.init(this.props.useSize.isVerySmall ? 100 : 180);
  };
  componentDidUpdate(prevProps){
    if(prevProps.file!==this.props.file){
        this.setState({file:this.props.file,playing:true})
        this.waveform.load(this.props.file,'')
        this.waveform.on('ready',()=> {
            console.log("ready to play", this.waveform)
            this.waveform.play()
        })
    } 
  }
  init(size){
    const track = document.querySelector('#track');
    console.log("sizes",size)
    this.waveform = WaveSurfer.create({
      barWidth: 1,
      cursorWidth: 1,
      container: '#waveform',
      backend: 'WebAudio',
      height: size,
      progressColor: '#f9e66e',
      responsive: true,
      waveColor: '#FFFFFF',
      cursorColor: 'transparent',
    });

    this.waveform.load(track);
    this.waveform.on('finish',()=>{
        console.log("AUDIO PLAYED !!!");
        this.setState({playing:false})
        this.props.handleFinish()
    })
    this.waveform.on('ready',()=> {
        console.log("ready to play", this.waveform)
        this.waveform.play()
    })
  }
  handlePlay() {
    console.log("PLAY AUDIO")
    this.setState({ playing: !this.state.playing });
    this.waveform.playPause();
  };
  render() {
    //console.log("render in audio",this.props.file)
    const url = this.state.file;
    let audio
    console.log(this.props)
    if (this.props.useSize.isVerySmall){
      audio = (
        <WaveformContianerSmall>
        <PlayButtonSmall onClick={this.handlePlay}>
        {!this.state.playing ? 'Play' : 'Pause'}
        </PlayButtonSmall>
        <WaveSmall id="waveform" />
        <audio id="track" src={url}/>
      </WaveformContianerSmall>
     )
   } else {
     audio = (
      <WaveformContianer>
      <PlayButton onClick={this.handlePlay}>
      {!this.state.playing ? 'Play' : 'Pause'}
      </PlayButton>
      <Wave id="waveform" />
      <audio id="track" src={url}/>
    </WaveformContianer>
   )
   }

    return  audio
  }
};

export default AudioPlayer