// The link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/qWlZWbar9/"; // IMPORTANT: Replace MODEL_ID with your actual model ID

let model, labelContainer;
let isModelLoaded = false;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        isModelLoaded = true;
        document.getElementById("classLabel").textContent = "Ready to classify!";
        document.getElementById("confidence").textContent = "";
        console.log("Teachable Machine model loaded successfully.");
    } catch (error) {
        document.getElementById("classLabel").textContent = "Error loading model.";
        document.getElementById("confidence").textContent = "Please check console for details and ensure MODEL_ID is correct.";
        console.error("Failed to load Teachable Machine model:", error);
    }

    labelContainer = document.getElementById("predictionResult");
}

async function predict() {
    if (!isModelLoaded) {
        document.getElementById("classLabel").textContent = "Model not loaded.";
        document.getElementById("confidence").textContent = "Please wait or check MODEL_ID in predict.js.";
        return;
    }

    const image = document.getElementById("uploadedImage");
    if (!image || image.style.display === 'none' || !image.src || image.src.includes('#')) {
        document.getElementById("classLabel").textContent = "No image uploaded.";
        document.getElementById("confidence").textContent = "";
        return;
    }

    const prediction = await model.predict(image);
    
    let topPrediction = { className: "Unknown", probability: 0 };
    for (let i = 0; i < prediction.length; i++) {
        if (prediction[i].probability > topPrediction.probability) {
            topPrediction = prediction[i];
        }
    }

    document.getElementById("classLabel").textContent = topPrediction.className;
    document.getElementById("confidence").textContent = `${(topPrediction.probability * 100).toFixed(2)}%`;
}

document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('uploadedImage');
            img.src = e.target.result;
            img.style.display = 'block';
            // Once image is loaded, run prediction
            predict();
        };
        reader.readAsDataURL(file);
    } else {
        document.getElementById('uploadedImage').style.display = 'none';
        document.getElementById("classLabel").textContent = "";
        document.getElementById("confidence").textContent = "";
    }
});

// Initialize the model when the script loads
init();
