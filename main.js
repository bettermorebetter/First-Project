class LottoBall extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const number = this.getAttribute('number');
        this.shadowRoot.innerHTML = `
            <style>
                .ball {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: radial-gradient(circle at 30% 30%, #fff, #b0c4de);
                    color: #333;
                    font-size: 1.5em;
                    font-weight: bold;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), inset 0 -3px 5px rgba(0,0,0,0.1);
                    position: relative;
                }
                .ball::before {
                    content: '';
                    position: absolute;
                    top: 5%;
                    left: 10%;
                    width: 80%;
                    height: 80%;
                    border-radius: 50%;
                    background: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0) 70%);
                }
            </style>
            <div class="ball">${number}</div>
        `;
    }
}

customElements.define('lotto-ball', LottoBall);


const generateButton = document.getElementById('generate-button');
const lottoNumbersContainer = document.getElementById('lotto-numbers-container');

generateButton.addEventListener('click', () => {
    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();
    while(numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    numbers.forEach(number => {
        const lottoBall = document.createElement('lotto-ball');
        lottoBall.setAttribute('number', number);
        lottoNumbersContainer.appendChild(lottoBall);
    });
});
