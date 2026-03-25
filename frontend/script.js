const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const dropArea = document.getElementById("dropArea");
const scanner = document.getElementById("scanner");

const result = document.getElementById("result");
const loader = document.getElementById("loader");
const button = document.getElementById("analyzeBtn");
const confidenceBar = document.getElementById("confidenceBar");

/* =========================
   DRAG & DROP + CLICK
========================= */

// Click to upload
dropArea.addEventListener("click", () => fileInput.click());

// Drag over
dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.style.borderColor = "#22c55e";
});

// Drag leave
dropArea.addEventListener("dragleave", () => {
    dropArea.style.borderColor = "#3b82f6";
});

// Drop file
dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    fileInput.files = e.dataTransfer.files;
    showPreview();
});

/* =========================
   PREVIEW IMAGE
========================= */

fileInput.addEventListener("change", showPreview);

function showPreview() {
    const file = fileInput.files[0];

    if (!file) return;

    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
}

/* =========================
   ANALYZE BUTTON
========================= */

button.addEventListener("click", uploadImage);

async function uploadImage() {

    if (!fileInput.files.length) {
        alert("Please upload an image first!");
        return;
    }

    loader.style.display = "block";
    scanner.style.display = "block";

    result.innerHTML = "";
    confidenceBar.style.width = "0%";

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const res = await fetch("https://truevision-ai.onrender.com/predict", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        console.log("API Response:", data);

        loader.style.display = "none";
        scanner.style.display = "none";

        /* =========================
           FIX RESPONSE HANDLING
        ========================= */

        const label = data.label || "Unknown";
        let confidence = parseFloat(data.confidence) || 0;

        // Fix confidence scaling
        if (confidence <= 1) {
            confidence = confidence * 100;
        }

        const cls = label === "Fake" ? "fake" : "real";

        result.innerHTML = `
            <span class="${cls}">${label}</span><br>
            Confidence: ${confidence.toFixed(2)}%
        `;

        confidenceBar.style.width = confidence + "%";

    } catch (err) {
        console.error(err);

        loader.style.display = "none";
        scanner.style.display = "none";

        result.innerText = "⚠️ Error: Backend not responding";
    }
}