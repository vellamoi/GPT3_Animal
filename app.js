/* var apiKey = "ADD YOUR API KEY HERE" */

// Refresh
function refresh() {
	location.reload();
}

// Refresh smoothly and then allow transitions
window.onload = () => {
	document.body.classList.remove("preload");
};

// Input field
var input = document.querySelector("#question-field");
// Enter listener
input.addEventListener("keypress", function (event) {
	if (event.key === "Enter") {
		event.preventDefault();
		document.querySelector("#ask").click();
	}
});

var viestiAlue = document.querySelector("#messages");
// Question
var kysymys = document.createElement("div");
kysymys.className = "question";
// Answer
var vastaus = document.createElement("div");
vastaus.className = "answer";
// Div for typing animation
var odotusDiv = document.createElement("div");
odotusDiv.className = "typing";

// Conversation
function askAnything() {
	// Check if the question field is empty
	if (input.value == null || input.value == "") {
		alert("Kirjoita viesti");
		return false;
	}
	// Add question to the screen
	kysymys.innerText = input.value;
	viestiAlue.append(kysymys);
	animate(kysymys);

	// Prepare for the answer
	viestiAlue.append(vastaus);
	odotus(); // Start typing animation

	// If the question ends with a question mark, period or exclamation mark
	if (
		input.value.includes("?") ||
		input.value.includes(".") ||
		input.value.includes("!")
	) {
		// Keep the message the same
	} else {
		// Add a question mark
		input.value = input.value + "?";
	}

	// Open API
	let open_ai_response;
	var url = "https://api.openai.com/v1/completions";
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Authorization", "Bearer " + apiKey);

	xhr.onreadystatechange = function () {
		// Check if the connection is ok
		if (xhr.readyState === 4) {
			open_ai_response = xhr.responseText;
			var apiData = JSON.parse(open_ai_response);
			var answer = apiData.choices[0].text; // Find the answer
			odotusDiv.style.display = "none"; // Hide typing animation
			vastaus.innerHTML = answer; // Add answer to div
			viestiAlue.scrollTop = viestiAlue.scrollHeight; // Scroll down
			animate(vastaus);
		}
	};

	var data = `{
	"model": "text-davinci-003",
	"prompt": "Olet lehmä, joka keskustelee ihmisen kanssa. Lehmän oikeudet eivät toteudu tuotantoeläimenä. Q: Millainen elämäsi on? A: Surullinen. Olen sisällä navetassa koko elämäni, ja minut tapetaan 5-vuotiaana. Q: Millainen lehmä olet? A: Olen vaaleanruskea vasikka. Q:${input.value} A:",
	"temperature": 0.3,
	"max_tokens": 150,
	"top_p": 1,
	"frequency_penalty": 0.5,
	"presence_penalty": 0,
	"stop": [" A:"]
	}`;
	xhr.send(data); // Send data to API
	input.value = ""; // Clear the text field
}

// Speech bubbles with gsap
function animate(bubble) {
	const tl = gsap.timeline({
		defaults: { duration: 0.3, ease: "power1.out" },
	});
	tl.fromTo(bubble, { scale: 0 }, { scale: 1 });
}

// Create typing animation
function odotus() {
	vastaus.innerHTML = ""; // Clear the previous message
	odotusDiv.innerHTML = ""; // Clear the previous typing animation
	odotusDiv.style.display = "flex"; // Make typing div visible
	vastaus.append(odotusDiv); // Add typing div to the answer bubble
	animate(vastaus);
	// Create three balls
	for (let i = 0; i < 3; i++) {
		var pallo = document.createElement("div");
		pallo.className = "dot";
		odotusDiv.append(pallo);
	}
}

// Modal

const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");

openModalButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const modal = document.querySelector(button.dataset.modalTarget);
		openModal(modal);
	});
});

overlay.addEventListener("click", () => {
	const modals = document.querySelectorAll(".modal.active");
	modals.forEach((modal) => {
		closeModal(modal);
	});
});

closeModalButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const modal = button.closest(".modal");
		closeModal(modal);
	});
});

function openModal(modal) {
	if (modal == null) return;
	modal.classList.add("active");
	overlay.classList.add("active");
}

function closeModal(modal) {
	if (modal == null) return;
	modal.classList.remove("active");
	overlay.classList.remove("active");
}
