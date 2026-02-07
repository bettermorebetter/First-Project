// DOM Elements
const handContainer = document.getElementById('hand-container');
const handRankDisplay = document.getElementById('hand-rank-display');
const scoreDisplay = document.getElementById('score');
const drawButton = document.getElementById('draw-button');
const rankingsList = document.getElementById('rankings-list'); // New: Get the rankings list element

// Game state
let score = 0;

// Card constants
const suits = ['♥', '♦', '♣', '♠'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Poker Hand Rankings and Scores (for display)
const pokerHandRankings = [
    { name: "Royal Flush", score: 200 },
    { name: "Straight Flush", score: 100 },
    { name: "Four of a Kind", score: 120 },
    { name: "Full House", score: 80 },
    { name: "Flush", score: 50 },
    { name: "Straight", score: 40 },
    { name: "Three of a Kind", score: 30 },
    { name: "Two Pair", score: 20 },
    { name: "One Pair", score: 10 },
    { name: "High Card", score: 0 }
];

// --- Core Game Logic ---

// Create a standard 52-card deck
function createDeck() {
    const deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ suit, rank });
        }
    }
    return deck;
}

// Shuffle the deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Draw a 5-card hand
function drawHand(deck) {
    return deck.slice(0, 5);
}

// --- Hand Evaluation ---

function getRankValue(rank) {
    if (rank === 'A') return 14;
    if (rank === 'K') return 13;
    if (rank === 'Q') return 12;
    if (rank === 'J') return 11;
    return parseInt(rank);
}

function evaluateHand(hand) {
    const handRanks = hand.map(card => getRankValue(card.rank)).sort((a, b) => a - b);
    const handSuits = hand.map(card => card.suit);

    const isFlush = new Set(handSuits).size === 1;
    const isStraight = handRanks.every((rank, i) => i === 0 || rank === handRanks[i - 1] + 1);
    
    // Ace-low straight (A-2-3-4-5)
    const isAceLowStraight = JSON.stringify(handRanks) === JSON.stringify([2, 3, 4, 5, 14]);
    if (isAceLowStraight) {
        // For straight calculation, treat Ace as 1
        // Note: The score for Ace-low straight flush might differ from regular straight flush
        // For simplicity, we'll assign the same score for now.
        if (isFlush) return { rank: "Straight Flush", score: 100 }; 
        return { rank: "Straight", score: 40 };
    }

    if (isStraight && isFlush) {
        // Check for Royal Flush (10, J, Q, K, A of same suit)
        const isRoyalFlush = handRanks[0] === getRankValue('10') && handRanks[4] === getRankValue('A');
        if (isRoyalFlush) return { rank: "Royal Flush", score: 200 };
        return { rank: "Straight Flush", score: 100 };
    }
    if (isStraight) return { rank: "Straight", score: 40 };
    if (isFlush) return { rank: "Flush", score: 50 };

    const rankCounts = handRanks.reduce((acc, rank) => {
        acc[rank] = (acc[rank] || 0) + 1;
        return acc;
    }, {});

    const counts = Object.values(rankCounts).sort((a, b) => b - a);

    if (counts[0] === 4) return { rank: "Four of a Kind", score: 120 };
    if (counts[0] === 3 && counts[1] === 2) return { rank: "Full House", score: 80 };
    if (counts[0] === 3) return { rank: "Three of a Kind", score: 30 };
    if (counts[0] === 2 && counts[1] === 2) return { rank: "Two Pair", score: 20 };
    if (counts[0] === 2) return { rank: "One Pair", score: 10 };

    return { rank: "High Card", score: 0 };
}


// --- UI Interaction ---

function displayHand(hand) {
    handContainer.innerHTML = '';
    for (const card of hand) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.textContent = `${card.rank}${card.suit}`;
        if (card.suit === '♥' || card.suit === '♦') {
            cardElement.classList.add('red');
        }
        handContainer.appendChild(cardElement);
    }
}

function populateRankingsList() {
    rankingsList.innerHTML = ''; // Clear existing list
    for (const ranking of pokerHandRankings) {
        const listItem = document.createElement('li');
        listItem.textContent = `${ranking.name}: ${ranking.score} points`;
        rankingsList.appendChild(listItem);
    }
}

function handleDraw() {
    const deck = createDeck();
    shuffleDeck(deck);
    const hand = drawHand(deck);
    displayHand(hand);

    const result = evaluateHand(hand);
    handRankDisplay.textContent = `Hand: ${result.rank}`;
    score += result.score;
    scoreDisplay.textContent = score;
}


// --- Event Listeners ---
drawButton.addEventListener('click', handleDraw);

// Initial setup on page load
populateRankingsList(); // New: Populate the rankings list
handleDraw();
