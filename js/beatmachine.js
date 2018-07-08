// Instances
import audioManager from './audio-manager.js';
import renderer from './renderer.js';

let kickLoopOn = false;
let snareLoopOn = false;
let pewLoopOn = false;
let kickfrequenzy = 10;
let snarefrequenzy = 10;
let pewfrequenzy = 10;
let kickInterval;
let snareInterval;
let pewInterval;

let kickfreqSlider;
let snarefreqSlider;
let pewfreqSlider;


export default class Beat extends HTMLElement {
  constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = this.template();

      const url = this.getAttribute('url');

      kickfreqSlider = this.shadowRoot.querySelector('#kickFrequenzy'); //sliders to change the frequenzy of the beat frequency
      snarefreqSlider = this.shadowRoot.querySelector('#snareFrequenzy');
      pewfreqSlider = this.shadowRoot.querySelector('#pewFrequenzy');

        //if the beat is active, changing the slider will change the frequency
        kickfreqSlider.addEventListener("change", function() {
        kickfrequenzy = this.value;


        if (kickInterval != null && kickLoopOn)
        {
          clearInterval(kickInterval) //clear the old interval ...
          kickInterval = setInterval(kick, kickfrequenzy*100) /// ... and set up a new one with the new frequency
        }

      },false)

      snarefreqSlider.addEventListener("change", function() {
        snarefrequenzy = this.value;

        if (snareInterval != null && snareLoopOn)
        {
          clearInterval(snareInterval)
          snareInterval = setInterval(snare, snarefrequenzy*100)
        }

      },false)

      pewfreqSlider.addEventListener("change", function() {
        pewfrequenzy = this.value;

        if (pewInterval != null && pewLoopOn)
        {
          clearInterval(pewInterval)
          pewInterval = setInterval(pew, pewfrequenzy*100)
        }

      },false)

  }
  

  template() {
    const html = String.raw;
    return html`
    <style>
    .headline {
      text-align: center;
      margin: 40px 0px 40px 0px;
    }
    .center {
      text-align: center;
    }
    #snare{margin-left:100px;}
    #pew{margin-left:100px;}
    </style>
     
    <div>
      <button type="button" id="kick">Kick</button>
      <button type="button" id="snare">Snare</button>
      <button type="button" id="pew">Pew</button>
    </div>
    <div>
    <input class="range" id="kickFrequenzy" type="range" min="1" max="40" value="10" "step=1">
    <input class="range" id="snareFrequenzy" type="range" min="1" max="40" value="20" "step=1">
    <input class="range" id="pewFrequenzy" type="range" min="1" max="40" value="20" "step=1">

    </div>
      `;

  }

  connectedCallback() {
    const kick = this.shadowRoot.querySelector('#kick');
    const snare = this.shadowRoot.querySelector('#snare');
    const pew = this.shadowRoot.querySelector('#pew');

    kick.addEventListener('click', this.startKickLoop.bind(this));
    snare.addEventListener('click', this.startSnareLoop.bind(this));
    pew.addEventListener('click', this.startPewLoop.bind(this));
  }

  /**
   * Toggle the kick loop on or off
   */
  startKickLoop() {
    kickLoopOn = !kickLoopOn
    if (kickLoopOn)
    {
      console.log(kickfrequenzy)
      kickInterval = setInterval(kick, kickfrequenzy*100)
    }
    else
    {
      clearInterval(kickInterval);
    }
  }

  /**
   * Toggle the kick loop on or off
   */
  startSnareLoop() {
    snareLoopOn = !snareLoopOn
    if (snareLoopOn)
    {
      console.log(snarefrequenzy)
      snareInterval = setInterval(snare, snarefrequenzy*100)
    }
    else
    {
      clearInterval(snareInterval);
    }
  }

  /**
   * Toggle the Pew loop on or off
   */
  startPewLoop() {
    pewLoopOn = !pewLoopOn
    if (pewLoopOn)
    {
      console.log(pewfrequenzy)
      pewInterval = setInterval(pew, pewfrequenzy*100)
    }
    else
    {
      clearInterval(pewInterval);
    }
  }

}

function kick()
{
      let osc = audioManager.ctx.createOscillator();
      let gain = audioManager.ctx.createGain();
      let time = audioManager.ctx.currentTime
      osc.frequency.setValueAtTime(150, time); //low frequenzy sound ...
      osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5); //... that goes even lower over a short time
      gain.gain.setValueAtTime(1, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5); //while simultaneously going quiet
      osc.connect(gain);
      gain.connect(audioManager.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.5);
}

function snare()
{
      
      let noiseBuffer = audioManager.ctx.createBuffer(1, 44100, 44100); //creating random noise
      let noiseBufferOutput = noiseBuffer.getChannelData(0);
      for (let i = 0; i < 44100; i++)
      {
          noiseBufferOutput[i] = Math.random() * 2 - 1;
      }

      let time = audioManager.ctx.currentTime
      let noise = audioManager.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      let noiseFilter = audioManager.ctx.createBiquadFilter();
      noiseFilter.type = 'highpass'; //don't want the low frequency sounds of the noise
      noiseFilter.frequency.value = 1000;
      noise.connect(noiseFilter);
      let noiseEnvelope = audioManager.ctx.createGain();
      noiseFilter.connect(noiseEnvelope);
      noiseEnvelope.connect(audioManager.ctx.destination);
      let osc = audioManager.ctx.createOscillator();
      osc.type = 'triangle'; 
      let oscEnvelope = audioManager.ctx.createGain();
      osc.connect(oscEnvelope);
      oscEnvelope.connect(audioManager.ctx.destination);
      noiseEnvelope.gain.setValueAtTime(1, time);
      noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2); //... qzuickly fading out
      noise.start(time);
      osc.frequency.setValueAtTime(100, time);
      oscEnvelope.gain.setValueAtTime(0.7, time);
      oscEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.1);//... same
      osc.start(time);
      osc.stop(time + 0.2);
      noise.stop(time + 0.2);
}

function pew()
{
  	let osc = audioManager.ctx.createOscillator();
    let gain = audioManager.ctx.createGain();
    let time = audioManager.ctx.currentTime
    osc.frequency.setValueAtTime(100, time); //low frequency sound ...
    osc.frequency.exponentialRampToValueAtTime(800, time + 0.25); //... going higher pitched relatively quickly
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.75); //... slowly back down again

    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.75); // ...while fading over time
    osc.connect(gain);
    gain.connect(audioManager.ctx.destination);
    osc.start(time);
    osc.stop(time + 0.75);
};
customElements.define('x-beat', Beat);