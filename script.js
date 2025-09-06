const hoursInput = document.querySelector("#hours");
const minutesInput = document.querySelector("#minutes");
const secondsInput = document.querySelector("#seconds");

const startBtn = document.querySelector("#start");
const display = document.querySelector("#display");

let timerId;

// function formatInput(input, max) {
//    let value = parseInt(input.value || 10);
//    if (value < 0) value = 0;
//    if (value > max) value = max;
//    input.value = string(value).padStart(2, "0");
// }

// // Attach to all three inputs
// [hoursInput, minutesInput, secondsInput].forEach((input, index) => {
//    const maxValues = [12, 59, 59]; // The max from HTML
//    input.addEventListener("blur", () => formatInput(input, maxValues[index]));
//    input.addEventListener("input", () => {
//       if (input.value.length > 2) {
//          input.value = input.value.slice(-2); // keep only two digits
//       }
//    });
// });

function pad(value) {
   return String(value).padStart(2, "0");
}

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
