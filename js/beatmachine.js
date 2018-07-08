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

      renderer.addRenderTask(this.update.bind(this));

      kickfreqSlider = this.shadowRoot.querySelector('#kickFrequenzy');
      snarefreqSlider = this.shadowRoot.querySelector('#snareFrequenzy');
      pewfreqSlider = this.shadowRoot.querySelector('#pewFrequenzy');


      kickfreqSlider.addEventListener("change", function() {
        kickfrequenzy = this.value;

        if (kickInterval != null)
        {
          clearInterval(kickInterval)
          kickInterval = setInterval(kick, kickfrequenzy*100)
        }

      },false)

      snarefreqSlider.addEventListener("change", function() {
        snarefrequenzy = this.value;

        if (snareInterval != null)
        {
          clearInterval(snareInterval)
          snareInterval = setInterval(snare, snarefrequenzy*100)
        }

      },false)

      pewfreqSlider.addEventListener("change", function() {
        pewfrequenzy = this.value;

        if (pewInterval != null)
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
    <input class="range" id="kickFrequenzy" type="range" min="1" max="40" value="10" "step=5">
    <input class="range" id="snareFrequenzy" type="range" min="1" max="40" value="20" "step=5">
    <input class="range" id="pewFrequenzy" type="range" min="5" max="40" value="20" "step=5">

    </div>
      `;

  }

  update() {
      
  }



  connectedCallback() {
    const kick = this.shadowRoot.querySelector('#kick');
    const snare = this.shadowRoot.querySelector('#snare');
    const pew = this.shadowRoot.querySelector('#pew');

    kick.addEventListener('click', this.startKickLoop.bind(this));
    snare.addEventListener('click', this.startSnareLoop.bind(this));
    pew.addEventListener('click', this.startPewLoop.bind(this));
  }
  startKickLoop() {
    kickLoopOn = !kickLoopOn
    if (kickLoopOn)
    {
      console.log(kickfreqSlider.value*100)
      kickInterval = setInterval(kick, kickfrequenzy*100)
    }
    else
    {
      clearInterval(kickInterval);
    }
  }
  startSnareLoop() {
    snareLoopOn = !snareLoopOn
    if (snareLoopOn)
    {
      console.log(snarefreqSlider.value*100)
      snareInterval = setInterval(snare, snarefrequenzy*100)
    }
    else
    {
      clearInterval(snareInterval);
    }
  }
  startPewLoop() {
    pewLoopOn = !pewLoopOn
    if (pewLoopOn)
    {
      console.log(pewfreqSlider.value*100)
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
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
      gain.gain.setValueAtTime(1, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
      osc.connect(gain);
      gain.connect(audioManager.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.5);
}

function snare()
{
      
      let noiseBuffer = audioManager.ctx.createBuffer(1, 44100, 44100);
      let noiseBufferOutput = noiseBuffer.getChannelData(0);
      for (let i = 0; i < 44100; i++)
      {
          noiseBufferOutput[i] = Math.random() * 2 - 1;
      }

      let time = audioManager.ctx.currentTime
      let noise = audioManager.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      let noiseFilter = audioManager.ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
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
      noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
      noise.start(time);
      osc.frequency.setValueAtTime(100, time);
      oscEnvelope.gain.setValueAtTime(0.7, time);
      oscEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      osc.start(time);
      osc.stop(time + 0.2);
      noise.stop(time + 0.2);
}

function pew()
{
  	let osc = audioManager.ctx.createOscillator();
    let gain = audioManager.ctx.createGain();
    let time = audioManager.ctx.currentTime
    osc.frequency.setValueAtTime(100, time);
    osc.frequency.exponentialRampToValueAtTime(800, time + 0.25);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.75);

    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.75);
    osc.connect(gain);
    gain.connect(audioManager.ctx.destination);
    osc.start(time);
    osc.stop(time + 0.75);
};
customElements.define('x-beat', Beat);