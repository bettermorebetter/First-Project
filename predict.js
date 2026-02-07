// The link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/MODEL_ID/"; // IMPORTANT: Replace MODEL_ID with your actual model ID

let model, webcam, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or tmImage.loadFromURL() support files from a URL
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    labelContainer = document.getElementById("predictionResult");
}

async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(document.getElementById("uploadedImage"));
    let classLabel = document.getElementById("classLabel");
    let confidence = document.getElementById("confidence");

    // Assuming the model outputs probabilities for "Cat Face" and "Dog Face"
    // You might need to adjust the indices based on your model's output
    let catPrediction = prediction[0]; // Assuming index 0 is Cat Face
    let dogPrediction = prediction[1]; // Assuming index 1 is Dog Face

    if (catPrediction.probability > dogPrediction.probability) {
        classLabel.textContent = catPrediction.className;
        confidence.textContent = `${(catPrediction.probability * 100).toFixed(2)}%`;
    } else {
        classLabel.textContent = dogPrediction.className;
        confidence.textContent = `${(dogPrediction.probability * 100).toFixed(2)}%`;
    }
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
    }
});

// Initialize the model when the script loads
init();
