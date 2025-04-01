const generateForm = document.querySelector(".generate-form");
const ImageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "ENTER YOUR API KEY HERE FROM OPENAI API SITE";

async function generateAiImages(userPrompt, userImageQuantity) {
    function updateImageCard(imgDataArray) {
        imgDataArray.forEach((imgObject, index) => {
            const imgCard = ImageGallery.querySelectorAll(".img-card")[index];
            const imgElement = imgCard.querySelector("img");
            const downloadBtn = imgCard.querySelector(".download-btn");

            const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
            imgElement.src = aiGeneratedImg;

            imgElement.onload = () => {
                imgCard.classList.remove("loading");
                downloadBtn.setAttribute("href", aiGeneratedImg);
                downloadBtn.setAttribute("download", `${userPrompt}.jpg`);
            }
        });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImageQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if (!response.ok) throw new Error("Failed to generate Images");
        const { data } = await response.json();
        console.log(data);
        updateImageCard([...data]);

    } catch (error) {
        alert(error.message);
    }
}

generateForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const userPrompt = event.target.querySelector(".prompt-input").value;
    const userImageQuantity = event.target.querySelector(".img-quantity").value;

    const imgCardMarkup = Array.from({ length: userImageQuantity }, function () {
        return (
            `<div class="img-card loading">
                <img decoding="async" src="images/loader.svg" alt="img">
                <a href="#" class="download-btn">
                    <img decoding="async" src="images/download.svg" alt="download-icon">
                </a>
            </div>`
        );
    }).join("");

    ImageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImageQuantity);
});

// Review Slideshow Functionality
const reviews = document.querySelectorAll('.review');
let currentReviewIndex = 0;

function showReview(index) {
    reviews.forEach((review, i) => {
        review.classList.toggle('active', i === index);
    });
}

function nextReview() {
    currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
    showReview(currentReviewIndex);
}

setInterval(nextReview, 3000); // Change review every 3 seconds
