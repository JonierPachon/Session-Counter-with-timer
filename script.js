const containerInputs = document.querySelector(".inputs");

const hoursInput = document.querySelector("#hours");
const minutesInput = document.querySelector("#minutes");
const secondsInput = document.querySelector("#seconds");

const startBtn = document.querySelector("#start");
const display = document.querySelector("#display");

const resetBtn = document.querySelector("#reset-btn");
const cancelBtn = document.querySelector("#cancel-btn");
const pauseBtn = document.querySelector("#pause-btn");

let timerId;
let endTime;
let remainingTime = 0;
let isPaused = false;

function pad(value) {
   return String(value).padStart(2, "0");
}

function formatInput(input, max) {
   input.value = input.value.replace(/\D/g, "");
   let value = parseInt(input.value, 10);
   if (isNaN(value)) value = 0;
   if (value > max) value = max;
   input.value = pad(value);
}

const inputs = [hoursInput, minutesInput, secondsInput];
const maxValues = [12, 59, 59];

inputs.forEach((input, index) => {
   input.addEventListener("input", () => formatInput(input, maxValues[index]));
   input.addEventListener("change", () => formatInput(input, maxValues[index]));
});

function updateDisplay(endTime) {
   const totalSeconds = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

   const hours = Math.floor(totalSeconds / 3600);
   const minutes = Math.floor((totalSeconds % 3600) / 60);
   const seconds = totalSeconds % 60;

   display.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

   if (totalSeconds <= 0) {
      clearInterval(timerId);
      toggleTimer(false);
      isPaused = false;
      pauseBtn.textContent = "Pause";
      remainingTime = 0;
   }
}

function toggleTimer(show) {
   startBtn.classList.toggle("close", show);

   containerInputs.classList.toggle("close", show);
   display.classList.toggle("close", !show);
   resetBtn.classList.toggle("close", !show);
   cancelBtn.classList.toggle("close", !show);
   pauseBtn.classList.toggle("close", !show);
}

function startTimer() {
   toggleTimer(true);

   const hours = parseInt(hoursInput.value, 10) || 0;
   const minutes = parseInt(minutesInput.value, 10) || 0;
   const seconds = parseInt(secondsInput.value, 10) || 0;

   const totalSeconds = hours * 3600 + minutes * 60 + seconds;
   if (totalSeconds <= 0) return;

   endTime = Date.now() + totalSeconds * 1000;

   updateDisplay(endTime - 1000);

   clearInterval(timerId);
   timerId = setInterval(() => updateDisplay(endTime), 1000);
   isPaused = false;
   pauseBtn.textContent = "Pause";
}
startBtn.addEventListener("click", () => {
   startTimer();
});

cancelBtn.addEventListener("click", () => {
   clearInterval(timerId);
   toggleTimer(false);
   isPaused = false;
   pauseBtn.textContent = "Pause";
   remainingTime = 0;
});

resetBtn.addEventListener("click", () => {
   startTimer();
   pauseBtn.classList.remove("active");
});

function pauseTimer() {
   remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
   clearInterval(timerId);
   isPaused = true;
   pauseBtn.textContent = "Resume";
   pauseBtn.classList.add("active");
}

function resumeTimer() {
   endTime = Date.now() + remainingTime * 1000;
   updateDisplay(endTime - 1000);
   timerId = setInterval(() => updateDisplay(endTime), 1000);
   isPaused = false;
   pauseBtn.textContent = "Pause";
   pauseBtn.classList.remove("active");
}

pauseBtn.addEventListener("click", () => {
   if (!isPaused) {
      pauseTimer();
   } else {
      resumeTimer();
   }
});
