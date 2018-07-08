import Renderer from './renderer.js';

let video1Volume;
let video2Volume;
let midiAccess;
let videoa;
let videob;
let vid2canvas;
let chromecheckvid2;
let invertvid1;

export default class VideoPlayer extends HTMLElement {

  constructor() {
    super();
    initMidi();
    const url = this.getAttribute('url');
    const controls = this.getAttribute("controls");
    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = this.template(url);

    this.shadowRoot.querySelector(".video-filter-wrapper").style.cssFloat = controls;

    vid2canvas = this.canvas = this.shadowRoot.querySelector("#video-canvas");
    this.canvas.context = this.canvas.getContext("2d");
    if (controls == "right") {
	 //this.canvas.style.left = "788px";
}
      if (videoa == null)
      	videoa = this.video = this.shadowRoot.querySelector("#video-file");
	  else
        videob = this.video = this.shadowRoot.querySelector("#video-file");
      this.video.playbackRate = 1;
	  this.video.addEventListener('loadedmetadata', () => {
      this.width = this.video.videoWidth;
      this.height = this.video.videoHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      
     
      Renderer.addRenderTask(this.updateCanvas.bind(this));
    });
    
    if (videob == null)
    	invertvid1 = this.filterInvertCheckbox = this.shadowRoot.querySelector("#filter-invert");
    else
	{
	this.filterInvertCheckbox = this.shadowRoot.querySelector("#filter-invert");
	videob.play();
	}
    this.filterGrayScaleCheckbox = this.shadowRoot.querySelector("#filter-grayscale");
    chromecheckvid2 = this.filterChromeKeyAlphaCheckbox = this.shadowRoot.querySelector("#filter-chrome-key-alpha");
    this.filterRedCheckbox = this.shadowRoot.querySelector("#filter-redscale");
    this.filterGreenCheckbox = this.shadowRoot.querySelector("#filter-greenscale");
    this.filterBlueCheckbox = this.shadowRoot.querySelector("#filter-bluescale");
	

	
	
	videoa.play();
  }

  template(url) {
    const html = String.raw;
    return html`
      <style>
        video {
          display : none;
        }
        .video {
          position: absolute;
          left: 0;
        }
        .video-filter-wrapper {
          margin-top: 70%;
          width: 50%;
        }
        .canvas-video-wrapper {
          position: relative;
        }
      </style>
	
      <div class="canvas-video-wrapper">
        <video class="video" id="video-file" src="${url}" loop></video>
        <canvas class="video" id="video-canvas"></canvas>
      </div>
      <div class="video-filter-wrapper">
      <div class="video-filter chrome-key-alpha">
        <label for="filter-chrome-key-alpha">ChromeKeyAlpha-Filter</label>
        <input id="filter-chrome-key-alpha" type="checkbox">
      </div>
        <div class="video-filter grayscale">
          <label for="filter-grayscale">Grauwert-Filter</label>
          <input id="filter-grayscale" type="checkbox">
        </div>
        <div class="video-filter invert">
          <label for="filter-invert">Invert-Filter</label>
          <input id="filter-invert" type="checkbox">
        </div>
        <div class="video-filter redscale">
          <label for="filter-redscale">Rotwert-Filter</label>
          <input id="filter-redscale" type="checkbox">
        </div>
        <div class="video-filter greenscale">
          <label for="filter-greenscale">Grünwert-Filter</label>
          <input id="filter-greenscale" type="checkbox">
        </div>
        <div class="video-filter bluescale">
          <label for="filter-bluescale">Blauwert-Filter</label>
          <input id="filter-bluescale" type="checkbox">
        </div>
      </div>
    `;
  }

  updateCanvas() {
    this.canvas.context.clearRect(0,0,this.width, this.height);
    this.canvas.context.drawImage(this.video,0,0,this.width,this.height);

    if(this.filterChromeKeyAlphaCheckbox.checked)
      this.chromaKeyAlpha(this.canvas.context.getImageData(0,0,this.width,this.height));

    if (this.filterGrayScaleCheckbox.checked)
      this.grayScale(this.canvas.context.getImageData(0,0,this.width,this.height));

    if (this.filterInvertCheckbox.checked)
      this.invertColor(this.canvas.context.getImageData(0,0,this.width,this.height));

    if (this.filterRedCheckbox.checked)
      this.redScale(this.canvas.context.getImageData(0,0,this.width,this.height));

    if (this.filterGreenCheckbox.checked)
      this.greenScale(this.canvas.context.getImageData(0,0,this.width,this.height));

    if (this.filterBlueCheckbox.checked)
      this.blueScale(this.canvas.context.getImageData(0,0,this.width,this.height));
     


  }

  chromaKeyAlpha(imageData) {
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i + 3] = (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    this.canvas.context.putImageData(imageData,0,0);
  }

  invertColor(imageData) {
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i]     = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
    this.canvas.context.putImageData(imageData,0,0);
  }

  grayScale(imageData) {
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      let y = (0.2126*r + 0.7152*g + 0.0722*b);

      data[i]     = y;
      data[i + 1] = y;
      data[i + 2] = y;
    }
    this.canvas.context.putImageData(imageData,0,0);
  }

  redScale(imageData) {
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      let red = this.getHighestColorValue(data , i);
      let greenBlue = this.getLowestColorValue(data , i);

      data[i] = red;
      data[i + 1] = greenBlue;
      data[i + 2] = greenBlue;
    }
    this.canvas.context.putImageData(imageData,0,0);
  }

  greenScale(imageData) {
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      let green = this.getHighestColorValue(data , i);
      let redBlue = this.getLowestColorValue(data , i);

      data[i] = redBlue;
      data[i + 1] = green;
      data[i + 2] = redBlue;
    }
    this.canvas.context.putImageData(imageData,0,0);
  }

  blueScale(imageData) {
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      let blue = this.getHighestColorValue(data , i);
      let redBlue = this.getLowestColorValue(data , i);

      data[i] = redBlue;
      data[i + 1] = redBlue;
      data[i + 2] = blue;
    }
    this.canvas.context.putImageData(imageData,0,0);
  }

  getHighestColorValue(data , i) {
    let result = data[i];

    if(result < data[i + 1]) {
      result = data[i + 1];
    }

    if(result < data[i + 2]) {
      result = data[i + 2];
    }
    return result;
  }

  getLowestColorValue(data , i) {
    let result = data[i];

    if(result > data[i + 1]) {
      result = data[i + 1];
    }

    if(result > data[i + 2]) {
      result = data[i + 2];
    }
    return result;
  }
}

function initMidi() {
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(
            midiSuccess,
            midiFailure
        );
    } else {
        midiFailure();
    }
}

function midiSuccess(midi) {
    
    midiAccess = midi;
    var inputs = midi.inputs;
    for (var input of inputs.values()) {
        input.onmidimessage = onMidiMessage;
    }
}

function midiFailure() {
    
}

function onMidiMessage(event) {
    let cmd = event.data[0] >> 4;
    let channel = event.data[0] & 0xf;
    let btnID = event.data[1];
    let value = event.data[2];
    /** pause first video with button with the ID 32 on the Midi controller and play it with 		*	Button with ID 31
    */
	if (btnID == 32) 
		videob.pause(); 
    
    if (btnID == 31)
		videob.play();
	/** pause second video with button with the ID 20 on the Midi controller and play it with 		*	Button with ID 19
    */    
	if (btnID == 20)
		videoa.pause(); 
    
    if (btnID == 19)
		videoa.play();
	/** Control volume of first video with the slider with the ID 21 on the MIDI controller
    */    
	if (btnID == 21)
		videob.volume = value/127;
	/** Control volume of second video with the slider with the ID 18 on the MIDI controller
    */     
	if (btnID == 18)
		videoa.volume = value/127;
	/** Move the first video to the right of the other video with the button with the ID 17 on the 		*   Midi controller
    */ 
    if (btnID == 17 && value == 127) { 
		vid2canvas.style.left = "788px";
    }
	/** Move the first video on top of the other video with the button with the ID 16 on the 		*   Midi controller
    */     
	if (btnID == 16 && value == 127) { 
		vid2canvas.style.left = "0px";
    }
	/** Activate the ChromeKeyAlpha-Filter with the button with the ID 48 on the Midi controller
    */ 
    if (btnID == 48) {
		chromecheckvid2.checked = true;
    }
	/** Deactivate the ChromeKeyAlpha-Filter with the button with the ID 49 on the Midi controller
    */ 
    if (btnID == 49) {
		chromecheckvid2.checked = false;
    }
    /** Activate the Invert-Filter with the button with the ID 50 on the Midi controller
    */ 
	if (btnID == 50) {
		invertvid1.checked = true;
    }
	/** Deactivate the ChromeKeyAlpha-Filter with the button with the ID 51 on the Midi controller
    */ 
    if (btnID == 51) {
		invertvid1.checked = false;
    }
	/** Control the playback speed of the first video with the slider with the ID 1
    */ 	
	if (btnID == 1) 
		videoa.playbackRate = value/127;
	/** Control the playback speed of the second video with the slider with the ID 2
    */ 	
	if (btnID == 2) 
		videob.playbackRate = value/127;
}

customElements.define('x-video-player', VideoPlayer);
