// Countdown timer encapsulated to avoid global scope pollution
// and to provide clearer, maintainable logic.

(() => {
   // Cache frequently accessed DOM elements
   const elements = {
      inputsWrapper: document.querySelector(".inputs"),
      hours: document.querySelector("#hours"),
      minutes: document.querySelector("#minutes"),
      seconds: document.querySelector("#seconds"),
      startBtn: document.querySelector("#start-btn"),
      display: document.querySelector("#display"),
      resetBtn: document.querySelector("#reset-btn"),
      cancelBtn: document.querySelector("#cancel-btn"),
      pauseBtn: document.querySelector("#pause-btn"),
   };

   class CountdownTimer {
      constructor(el) {
         this.el = el;
         this.timerId = null;
         this.endTime = 0;
         this.remainingTime = 0;
         this.isPaused = false;
         this.maxValues = { hours: 12, minutes: 59, seconds: 59 };

         this._initInputFormatting();
         this._attachButtonListeners();
      }

      // Format a number to always show at least two digits
      pad(value) {
         return String(value).padStart(2, "0");
      }

      // Enforce numeric input and keep it within allowed bounds

      formatInput(input, max) {
         const numeric = input.value.replace(/\D/g, "");
         const value = Math.min(parseInt(numeric || "0", 10), max);
         input.value = this.pad(value);
      }

      _initInputFormatting() {
         const units = ["hours", "minutes", "seconds"];
         units.forEach((unit) => {
            const input = this.el[unit];
            const max = this.maxValues[unit];
            ["input", "change"].forEach((evt) => {
               input.addEventListener(evt, () => this.formatInput(input, max));
            });
         });
      }

      // Update the visible time left
      updateDisplay() {
         const totalSeconds = Math.max(
            0,
            Math.floor((this.endTime - Date.now()) / 1000)
         );
         const hours = Math.floor(totalSeconds / 3600);
         const minutes = Math.floor((totalSeconds % 3600) / 60);
         const seconds = totalSeconds % 60;

         this.el.display.textContext = `${this.pad(hours)}:${this.pad(
            minutes
         )}:${this.pad(seconds)}`;

         if (totalSeconds <= 0) {
            this.stop();
         }
      }

      // show or hide control elements based on timer running state
      toggleCountdown(isRunning) {
         this.el.startBtn.classList.toggle("close", isRunning);
         this.el.inputWrapper.classList.toggle("close", isRunning);
         this.el.display.classList.toggle("close", !isRunning);
         this.el.resetBtn.classList.toggle("close", !isRunning);
         this.el.cancelBtn.classList.toggle("close", !isRunning);
         this.el.pauseBtn.classList.toggle("close", !isRunning);
      }

      start() {
         const [hours, minutes, seconds] = ["hours", "minutes", "seconds"].map(
            (unit) => parseInt(this.el[unit].value, 10) || 0
         );

         const totalSeconds = hours * 3600 + minutes * 60 + seconds;

         if (totalSeconds <= 0) return;

         this.endTime = Date.now() + totalSeconds * 1000;
         this.updateDisplay();

         clearInterval(this.timerId);
         this.timerId = setInterval(() => this.updateDisplay(), 1000);

         this.isPaused = false;
         this.el.pauseBtn.textContent = "Pause";
         this.el.pauseBtn.classList.remove("active");
         this.toggleCountdown(true);
      }

      stop() {
         clearInterval(this.timerId);
         this.toggleCountdown(false);
         this.isPaused = false;
         this.el.pauseBtn.textContent = "Pause";
         this.el.pauseBtn.classList.remove("active");
         this.remainingTime = 0;
      }

      reset() {
         this.start;
      }

      pause() {
         this.remainingTime = Math.max(
            0,
            Math.floor((this.endTime - Date.now()) / 1000)
         );
         clearInterval(this.timerId);
         this.isPaused = true;
         this.el.pauseBtn.textContent = "Resume";
         this.el.pauseBtn.classList.add("active");
      }

      resume() {
         this.endTime = Date.now() + this.remainingTime * 1000;
         this.updateDisplay();
         this.timerId = setInterval(() => this.updateDisplay(), 1000);
         this.isPaused = false;
         this.el.pauseBtn.textContent = "Pause";
         this.el.pauseBtn.classList.remove("active");
      }

      togglePause() {
         this.isPaused ? this.resume() : this.pause();
      }

      _attachButtonListeners() {
         this.el.startBtn.addEventListener("click", () => this.start());
         this.el.cancelBtn.addEventListener("click", () => this.stop());
         this.el.resetBtn.addEventListener("click", () => this.reset());
         this.el.pauseBtn.addEventListener("click", () => this.togglePause());
      }
   }

   new CountdownTimer(elements);
})();
