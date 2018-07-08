// Classes
import Player from './player.js';
//import Canvas from './canvas.js';
import audioManager from './audio-manager.js';

import VideoPlayer from './video-player.js';
import beats from './beatmachine.js';

let rotary1;
let rotary2;
let rotary3;
let rotary4;
let rotary5;
let rotary6;
let rotary7;
let rotary8;

export default class App extends HTMLElement {

    constructor() {
        super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = this.template();
	
	
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
      </style>
          <div>
          <h1 class="headline">Audio-Player</h1>
           
          </div>
          <h2>Player 1</h2>
          <!-- <x-player id="sound" controls></x-player> -->
          <x-player id="player1" url="./track3.mp3"></x-player>
          <h2>Player 2</h2>
	      <x-player id="player2" url="./track2.mp3"></x-player>
          <hr/>
          <h2> Beat Machine </h2>
          <x-beat id= "beat"><x-beat>
         
        </div>

        
      `;
    }

}
customElements.define('x-app', App);
