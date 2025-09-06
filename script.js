const hoursInput = document.querySelector("#hours");
const minutesInput = document.querySelector("#minutes");
const secondsInput = document.querySelector("#seconds");

const startBtn = document.querySelector("#start");
const display = document.querySelector("#display");

let timerId;

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
   input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "").slice(0, 2);
   });

   // input.addEventListener("blur", () => formatInput(input, maxValues[index]));
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
   }
}

startBtn.addEventListener("click", () => {
   inputs.forEach((input, index) => formatInput(input, maxValues[index]));
   const hours = parseInt(hoursInput.value, 10) || 0;
   const minutes = parseInt(minutesInput.value, 10) || 0;
   const seconds = parseInt(secondsInput.value, 10) || 0;

   const totalSeconds = hours * 3600 + minutes * 60 + seconds;
   if (totalSeconds <= 0) return;

   const endTime = Date.now() + totalSeconds * 1000;

   updateDisplay(endTime - 1000);

   clearInterval(timerId);
   timerId = setInterval(() => updateDisplay(endTime), 1000);
});
