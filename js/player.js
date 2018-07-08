// Instances
import audioManager from './audio-manager.js';
import renderer from './renderer.js';


let midiAccess;
let source1;
let source2;
let analyser1;
let analyser2;
let audio1;
let audio2;
let curVol1 = 0.25;
let curVol2 = 0.25;
let volumeSlider1;
let volumeSlider2;
let gainage1;
let gainage2;
let filter1;
let filter2;
let delay1 = audioManager.ctx.createDelay();
let delay2 = audioManager.ctx.createDelay();
let feedback1 = audioManager.ctx.createGain();
let feedback2 = audioManager.ctx.createGain();


let rotary1;
let rotary2;
let rotary3;
let rotary4;
let rotary5;
let rotary6;
let rotary7;
let rotary8;
let rotary9;
let rotary10;
let rotary11;
let rotary12;
let rotary13;
let rotary14;
let rotary15;
let rotary16;
let gain1;
let gain2;
let gain3;
let gain4;
let crossfade;
let highpassbtn1;
let highpassbtn2;

let lowpassbtn1;
let lowpassbtn2;


let filteron1 = false;
let filteron2 = false;
let delayon1 = false;
let delayon2 = false;

export default class Player extends HTMLElement {
    constructor() {
        super();
        initMidi();
            

        
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = this.template();

        
        const url = this.getAttribute('url');
        this.audio = new Audio(url);
        this.audio.loop = true;
		//this.audio.play();
	

        renderer.addRenderTask(this.updateAudioTime.bind(this));
        renderer.addRenderTask(this.update.bind(this));

        // Get Audio element in Audio API
        this.source = audioManager.ctx.createMediaElementSource(this.audio);

        this.gainNode = audioManager.ctx.createGain();
        this.biquadFilter = audioManager.ctx.createBiquadFilter();

        // Create AnalyserNode
        this.analyser = audioManager.ctx.createAnalyser();
        this.analyser.fftSize = 256;

        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);


        

        
        highpassbtn1 = this.shadowRoot.querySelector('#highpassbtn1');
        highpassbtn2 = this.shadowRoot.querySelector('#highpassbtn2');
        lowpassbtn1 = this.shadowRoot.querySelector('#lowpassbtn2');
        lowpassbtn2 = this.shadowRoot.querySelector('#lowpassbtn2');
        if (volumeSlider1 != null) //set up after both players are set up
        {
            shadowRoot.innerHTML += this.createSliders();
            rotary1 = this.shadowRoot.querySelector('#rotaryswitch1');
            rotary2 = this.shadowRoot.querySelector('#rotaryswitch2');
            rotary3 = this.shadowRoot.querySelector('#rotaryswitch3');
            rotary4 = this.shadowRoot.querySelector('#rotaryswitch4');
            rotary5 = this.shadowRoot.querySelector('#rotaryswitch5');
            rotary6 = this.shadowRoot.querySelector('#rotaryswitch6');
            rotary7 = this.shadowRoot.querySelector('#rotaryswitch7');
            rotary8 = this.shadowRoot.querySelector('#rotaryswitch8');
            rotary9 = this.shadowRoot.querySelector('#rotaryswitch9');
            rotary10 = this.shadowRoot.querySelector('#rotaryswitch10');
            rotary11 = this.shadowRoot.querySelector('#rotaryswitch11');
            rotary12 = this.shadowRoot.querySelector('#rotaryswitch12');
            rotary13 = this.shadowRoot.querySelector('#rotaryswitch13');
            rotary14 = this.shadowRoot.querySelector('#rotaryswitch14');
            rotary15 = this.shadowRoot.querySelector('#rotaryswitch15');
            rotary16 = this.shadowRoot.querySelector('#rotaryswitch16');

            gain1 = this.shadowRoot.querySelector('#gain1')
            gain2 = this.shadowRoot.querySelector('#gain2')
            gain3 = this.shadowRoot.querySelector('#gain3')
            gain4 = this.shadowRoot.querySelector('#gain4')

            gain1.value = gain2.value = gain3.value = gain4.value = 0;

            crossfade = this.shadowRoot.querySelector('#crossfade');
        }


        const cnvEl = this.shadowRoot.querySelector("#cnv");
        this.cnvCtx = cnvEl.getContext("2d");

        this.source.connect(this.analyser);         //connect the nodes
        this.analyser.connect(this.biquadFilter);
        this.biquadFilter.connect(this.gainNode);
     
        this.gainNode.connect(audioManager.ctx.destination);
        this.gainNode.gain.value = 0.25


    
   

	if (volumeSlider1 == null) { //set up player one's fields and listener
        volumeSlider1 = this.shadowRoot.querySelector('#musicVolRange');
		volumeSlider1.addEventListener("change", function() {
                gainage1.gain.value = this.value / 127;
                curVol1 = gainage1.gain.value;
        }, false);
            source1 = this.source;
            analyser1 = this.analyser;
            audio1 = this.audio;
            gainage1 = this.gainNode;
            filter1 = this.biquadFilter;
            filter1.type = "highpass"
            filter1.frequency.setValueAtTime(0, audioManager.ctx.currentTime)
	}
	else {
        	volumeSlider2 = this.shadowRoot.querySelector('#musicVolRange'); //set up player one's fields and listener
		    volumeSlider2.addEventListener("change", function() {
                gainage2.gain.value = this.value / 127;
                curVol2 = gainage2.gain.value;

            }, false);
            source2 = this.source;
            analyser2 = this.analyser;
            audio2 = this.audio;
            gainage2 = this.gainNode;
            filter2 = this.biquadFilter;
            filter2.type = "highpass"
            filter2.frequency.setValueAtTime(0, audioManager.ctx.currentTime)

    }

    }


   createSliders() {
        const html = String.raw;

        return html`
        
        <style>
        div {
            background-color: white;
        }
        #playercnv {
            background-color: lightgray;
        }
        #slidecontainer {
            background-color: lightgray;
        }
        #progress {
            background-color: gray;
            width: 0%;
            height: 22px;
        }
        #crossfader {
            background-color: transparent;
        }
        #highpassbtn1{margin-left:25px;}
        #highpassbtn2{margin-left:50px;}
        #lowpassbtn1{margin-left:50px;}

        #lowpassbtn2{margin-left:50px;}

        cnv {
          width: 300;
          height: 500;
        }
        </style>

        <h2>Drehregler</h2>
        <div>
            <input id="rotaryswitch1" class="demo" type="range" min="0" max="127" value="64">
            <input id="rotaryswitch2" class="demo" type="range" min="0" max="127" value="64">
            <input id="rotaryswitch3" class="demo" type="range" min="0" max="127" value="64">
            <input id="rotaryswitch4" class="demo" type="range" min="0" max="127" value="64">
        </div>
        <div>
            <input id="rotaryswitch5" class="demo" type="range" min="0" max="127" value="64">
            <input id="rotaryswitch6" class="demo" type="range" min="0" max="127" value="64">
            <input id="rotaryswitch7" class="demo" type="range" min="0" max="127" value="64">
            <input id="rotaryswitch8" class="demo" type="range" min="0" max="127" value="64">
        </div>
        <div>
            <input id="rotaryswitch9" class="demo" type="range" min="0" max="127" value="64">
            <input id="rotaryswitch10" class="demo" type="range" min="0" max="127" value="64">
            <input id="rotaryswitch11" class="demo" type="range" min="0" max="127" value="64">
            <input id="rotaryswitch12" class="demo" type="range" min="0" max="127" value="64">
        </div>
        <div>
            <input id="rotaryswitch13" class="demo" type="range" min="0" max="127" value="64">
            <input id="rotaryswitch14" class="demo" type="range" min="0" max="127" value="64">
            <input id="rotaryswitch15" class="demo" type="range" min="0" max="127" value="64">
            <input id="rotaryswitch16" class="demo" type="range" min="0" max="127" value="64">
        </div>
        <br>
            <button id="highpassbtn1">Highpass T1</button>
            <button id="lowpassbtn1">Lowpass T1</button>

            <button id="highpassbtn2"">Highpass T2</button>
            <button id="lowpassbtn2"">LowpassT2</button>

        <br>
        <br>

        <input class="vertical-slider" id="gain1" orient="vertical" type="range" min="0" max="127" value="127">
        <input class="vertical-slider" id="gain2" orient="vertical" type="range" min="0" max="127" value="127">
        <input class="vertical-slider" id="gain3" orient="vertical" type="range" min="0" max="127" value="127">
        <input class="vertical-slider" id="gain4" orient="vertical" type="range" min="0" max="127" value="127"><br>
            
        <h2>Crossfader</h2>        
        <div id="crossfader">
            <input class="horizontal-slider" id="crossfade" type="range" min="0" max="127" value="64">
        </div>
        
        <br>
        <br>
        `;
   } 
   template() {
        const html = String.raw;

        if (volumeSlider1 == null)
        {
        return html`
        
        <style>
        div {
            background-color: white;
        }
        #playercnv {
            background-color: lightgray;
        }
        #slidecontainer {
            background-color: lightgray;
        }
        #progress {
            background-color: gray;
            width: 0%;
            height: 22px;
        }
        cnv {
          width: 300;
          height: 500;
        }
        </style>

        <div id = "playercnv">
            <div id="progress"></div>
            <button type="button" id="play">Play/Pause</button>
            <button type="button" id="volume">Mute</button>
            
        <div id="slidecontainer">
        <input type="range" min="0" max="127" value="50" class="slider" id="musicVolRange" step="1"  >
        </div>
            <canvas id="cnv" width="1000" height="100"></canvas>
        </div>
            `;
        }

        else {

        return html`
         
        <style>
        #playercnv {
            background-color: lightgray;
        }
        #progress {
            background-color: gray;
            width: 0%;
            height: 22px;
        }
        cnv {
          width: 300;
          height: 500;
        }
    </style>
    
    <div id ="playercnv">
        <div id="progress"></div>
        <button type="button" id="play">Play/Pause</button>
        <button type="button" id="volume">Mute</button>
        
    <div id="slidecontainer">
    <input type="range" min="0" max="127" value="50" class="slider" id="musicVolRange" step="1"  >
    </div>
        <canvas id="cnv" width="1000" height="100"></canvas>
    </div>
        `;
    }

    }

    /**
     * draw the waveform of the soundfile using rectangles on a canvas
     */
    update() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.cnvCtx.clearRect(0, 0, 1000, 100);

        let barWidth = (1000 / this.bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        for (let i = 0; i < this.bufferLength; i++) {
            barHeight = this.dataArray[i];

            this.cnvCtx.fillStyle = '#F62459';
            this.cnvCtx.fillRect(x, 100 - barHeight / 3, barWidth, barHeight);

            x += barWidth + 1;
        }
    
    }
 
    /** Setting up listeners for the play and mute button
     * 
     */  
    connectedCallback() {
        const button = this.shadowRoot.querySelector('#play');
        const mute = this.shadowRoot.querySelector('#volume');

        this.elProgress = this.shadowRoot.querySelector('#progress');

        button.addEventListener('click', this.handleButtonClick.bind(this));
        mute.addEventListener('click', this.changeAudioVolume.bind(this));
    }

    /**
     * the function to handle click on play button
     */
    handleButtonClick() {
        if (this.audio.paused) {
            console.log(this.gainNode.gain.value);
            this.audio.play();
            

        }
        else {
            this.audio.pause();
        }
    }
    
    /**
     * display how much of the song has already played and how much is left
     */
    updateAudioTime() {
        const progress = this.audio.currentTime / this.audio.duration;
        this.elProgress.style.width = (progress * 100) + '%';
    }

    /**
     * the function to handle click on mute button
     */
    changeAudioVolume(value) {

        if (this.gainNode.gain.value != 0) {
            this.gainNode.gain.value = 0;
            volumeSlider.value = 0;
        }
        else {

            this.gainNode.gain.value = curVol1;
            volumeSlider.value = curVol1 * 127;
            
        }
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
    console.log("Midi is working!");

    midiAccess = midi;
    let inputs = midi.inputs;
    for (let input of inputs.values()) {
        input.onmidimessage = onMidiMessage;
    }
}

function midiFailure() {
    console.log("Failure: Midi is not working!");
}

/** Toggles the highpass filter on or off
 * 
 * @param {*} filter the filter node for which the highpass is supposed to be set up/deactivated 
 * @param {*} filteron true if filter is supposed to be on
 */
function FilterHighPass(filter, filteron)
{
    if (filteron)
    {
        filter.type = "highpass";
        filter.frequency.setValueAtTime(5000, audioManager.ctx.currentTime);
    }
    else
    {
        filter.type = "highpass";
        filter.frequency.setValueAtTime(0, audioManager.ctx.currentTime);
    }
}   

/** Toggles the lowpass filter on or off
 * 
 * @param {*} filter the filter node for which the lowpass is supposed to be set up/deactivated 
 * @param {*} filteron true if filter is supposed to be on
 */
function Filterlowpass(filter, filteron)
{
    if (filteron)
    {
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(12000, audioManager.ctx.currentTime);
    }
    else
    {
        filter.type = "highpass";
        filter.frequency.setValueAtTime(0, audioManager.ctx.currentTime);
    }
}  

/** Activates an echo filter for the audio
 * 
 * @param {*} delay  the delaynode
 * @param {*} feedback  the feedback node
 * @param {*} delayon  true if echo is already active for the source
 * @param {*} source the source audio
 * @param {*} filter the biquadfilter node connected to the audiosource
 * @param {*} analyser the analyser node connected to the audiosource
 */
function HallFilter(delay, feedback, delayon, source, filter, analyser)
{
    console.log(delayon)
    if (!delayon)
    {
        delay.delayTime.value = 0.2; //the time before the echo sounds

        feedback.gain.value = 0.3; //the echo is slowly fading out over time

        delay.connect(feedback)
        feedback.connect(delay)

       
        source.connect(delay)
        //source1.connect(audioManager.ctx.destination)
        delay.connect(filter)
        console.log("yes")
    }
    source.connect(analyser)
   

}


function onMidiMessage(event) {
    let cmd = event.data[0] >> 4;
    let channel = event.data[0] & 0xf;
    let btnID = event.data[1];
    let value = event.data[2];

    console.log ("command: "+cmd +"btnID "+btnID+"value: "+ value)

    /** Controls the delay of the Echo effect for the first track
     * 
     */
    if (btnID == 1 && cmd == 11)
    {
        delay1.delayTime.value = value/127;
    }

     /** Controls the feedback of the Echo effect for the first track
     * 
     */
    if (btnID == 2 && cmd == 11)
    {
        feedback1.gain.value = value/127
    }

     /** Controls the delay of the Echo effect for the second track
     * 
     */
    if (btnID == 4 && cmd == 11)
    {
        delay2.delayTime.value = value/127;
    }

    /** Controls the feedback of the Echo effect for the second track
     * 
     */
    if (btnID == 5 && cmd == 11)
    {
        feedback2.gain.value = value/127
    }
    /** Volume control of first sound file through slider with the ID 48 on the Midi controller
    */
    if (btnID == 6) {

        rotary1.value = value;
        gainage1.gain.value = value / 127;
        volumeSlider1.value = value;
        curVol1 = value / 127;
	
    }

    if (btnID == 7) {     

        rotary2.value = value;

    }
    if (btnID == 8) {   
        rotary3.value = value;
    }

    /** Volume control of second sound file through slider with the ID 49 on the Midi controller
    */
   if (btnID == 9) {

    rotary4.value = value;
    gainage2.gain.value = value / 127;
    volumeSlider2.value = value;
    curVol2 = value / 127;

    }

    if (btnID == 10 && cmd == 11) {    
            
        rotary5.value = value;
        

    }

    if (btnID == 11) {  

        rotary6.value = value;

    }

    if (btnID == 12) {  

        rotary7.value = value;

    }

    if (btnID == 13) { 

        rotary8.value = value;
    
    }

    if (btnID == 14) { 

        rotary9.value = value;
    
    }

    if (btnID == 15) { 

        rotary10.value = value;
    
    }

    if (btnID == 16 && cmd == 11) { 

        rotary11.value = value;
    
    }

    if (btnID == 17 && cmd == 11) { 

        rotary12.value = value;
    
    }

     /** activates the echo effect for the first track
      * 
      */
    if (btnID == 16 && cmd == 9)
    {
       
        HallFilter(delay1, feedback1, delayon1, source1, filter1, analyser1)
        delayon1 = true;
    }

    /** activates the echo effect for the second track
     * 
     */
    if (btnID == 17 && cmd == 9)
    {
       
        HallFilter(delay2, feedback1, delayon2, source2, filter2, analyser2)
        delayon2 = true;
    }

    /** deactivates all echo effects
     * 
     */
    if (btnID == 18 && cmd == 9)
    {
        if (delayon1)
        {
            source1.disconnect(0)
            source1.connect(analyser1)
            delayon1 = false;
        }

        if (delayon2)
        {
            source2.disconnect(0)
            source2.connect(analyser2)
            delayon1 = false;
        }
    }

    if (btnID == 18 && cmd == 11)
    {
        rotary13.value = value;
        
    }

    if (btnID == 19 && cmd == 11)
    {
        rotary14.value = value;
       
    }
    
    /** activates the highpass filter for the first track
     * 
     */
    if (btnID == 19 && cmd == 9)
    {
        filteron1 = true;
        FilterHighPass(filter1, filteron1);
    }

     /** deactivates the highpass filter for the first track
     * 
     */
    if (btnID == 20 && cmd == 9)
    {
        filteron1 = false;
        if (filter1.type == "highpass")
            FilterHighPass(filter1, filteron1);
    }

    if (btnID == 20 && cmd == 11 )
    {
        rotary15.value = value;
        
    }

    if (btnID == 21 && cmd == 11)
    {
        rotary16.value = value;
       
    }
     /** activates the highpass filter for the second track
     * 
     */
    if (btnID == 23 && cmd == 9)
    {
        filteron2 = true;
        FilterHighPass(filter2, filteron2);
    }

     /** deactivates the highpass filter for the first track
     * 
     */
    if (btnID == 24 && cmd == 9)
    {
        filteron2 = false;

        if (filter2.type == "highpass")
        FilterHighPass(filter2, filteron2);
    }

     /** activates the lowpass filter for the first track
     * 
     */
    if (btnID == 27 && cmd == 9)
    {
        filteron1 = true;
        Filterlowpass(filter1, filteron1);
    }

     /** deactivates the lowpass filter for the first track
     * 
     */
    if (btnID == 28 && cmd == 9)
    {
        filteron1 = false;

        if (filter1.type == "lowpass")
        Filterlowpass(filter1, filteron1);
    }


     /** activates the lowpass filter for the second track
     * 
     */
    if (btnID == 31 && cmd == 9)
    {
        filteron2 = true;
        Filterlowpass(filter2, filteron2);
    }

     /** deactivates the lowpass filter for the second track
     * 
     */
    if (btnID == 32 && cmd == 9)
    {
        filteron2 = false;

        if (filter2.type == "lowpass")
        Filterlowpass(filter2, filteron2);
    }

    /** changes the frequenzy threshold for the highpass filter of the first track
     * 
     */
    if (btnID == 48 && cmd == 11) {
        gain1.value = value;
        if (filteron1 && filter1.type == "highpass")
            filter1.frequency.setValueAtTime(value*188, audioManager.ctx.currentTime)
    }

    /** starts playing the first track
     * 
     */
    if (btnID == 48 && cmd == 8) {
        audio1.play()
    }

     /** changes the frequenzy threshold for the highpass filter of the second track
     * 
     */
    if (btnID == 49 && cmd == 11) {
        gain2.value = value;
        if (filteron2 && filter2.type  == "highpass")
            filter2.frequency.setValueAtTime(value*188, audioManager.ctx.currentTime)
    }
    /** pauses the first track
     * 
     */
    if (btnID == 49 && cmd == 8) {
        audio1.pause()
    }

     /** changes the frequenzy threshold for the lowpass filter of the first track
     * 
     */
    if (btnID == 50 && cmd == 11) {
        gain3.value == value
        if (filteron1 && filter1.type == "lowpass")
            filter1.frequency.setValueAtTime(value*188, audioManager.ctx.currentTime)
    }

    /** starts playing the second track
     * 
     */
    if (btnID == 50 && cmd == 8) {
        audio2.play()
    }

    /** changes the frequenzy threshold for the lowpass filter of the second track
     * 
     */
    if (btnID == 51 && cmd == 11) {
        gain4.value = value;
        if (filteron2 && filter2.type  == "lowpass")
            filter2.frequency.setValueAtTime(value*188, audioManager.ctx.currentTime)
    }
    /** pauses thesecond track
     * 
     */
    if (btnID == 51 && cmd == 8) {
        audio2.pause()
    }

    /** crossfader control through slider with the ID 64 on the Midi controller
    */
    if (btnID == 64) {
        crossfade.value = value
        gainage1.gain.value = Math.cos(value/127 * 0.5*Math.PI);
        gainage1.gain.value = curVol1 * gainage1.gain.value

        gainage2.gain.value = Math.cos((1.0 - value/127) * 0.5*Math.PI);
        gainage2.gain.value = curVol2 * gainage2.gain.value
    }
	
    
}
customElements.define('x-player', Player);
