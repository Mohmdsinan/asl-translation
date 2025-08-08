const ASL_ALPHABET = {};
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ '.split('').forEach(char => {
      if (char === ' ') {
        ASL_ALPHABET[char] = {
          image: 'Alphabets/space.png',
          description: 'Space / pause'
        };
      } else {
        ASL_ALPHABET[char] = {
          image: `Alphabets/${char.toLowerCase()}.png`,
          description: `${char} sign`,
          class: 'asl-image'
        };
      }
    });

    class SignLanguageTranslator {
      constructor() {
        this.textInput = document.getElementById('textInput');
        this.translateBtn = document.getElementById('translateBtn');
        this.translationSection = document.getElementById('translationSection');
        this.placeholder = document.getElementById('placeholder');
        this.fingerspellSection = document.getElementById('fingerspellSection');

        this.currentIndex = 0;
        this.currentText = '';
        this.isPlaying = false;

        this.initializeEventListeners();
      }

      initializeEventListeners() {
        this.translateBtn.addEventListener('click', () => this.translateText());
        this.textInput.addEventListener('input', () => {
          this.translateBtn.disabled = this.textInput.value.trim().length === 0;
        });

        document.getElementById('playBtn').addEventListener('click', () => this.playFingerspelling());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseFingerspelling());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartFingerspelling());

        const speedSlider = document.getElementById('speedSlider');
        speedSlider.addEventListener('input', (e) => {
          document.getElementById('speedValue').textContent = e.target.value + 'x';
        });
      }

      translateText() {
        const text = this.textInput.value.trim().toUpperCase();
        if (!text) return;

        this.placeholder.style.display = 'none';
        this.translationSection.classList.add('active');
        this.fingerspellSection.style.display = 'block';
        document.getElementById('currentPhrase').style.display = 'block';
        document.getElementById('phraseDisplay').textContent = text;
        document.getElementById('fingerspellControls').style.display = 'flex';
        document.getElementById('speedControlSection').style.display = 'flex';

        this.currentText = text;
        this.currentIndex = 0;

        this.createSignCards();
        this.playFingerspelling();
      }

      createSignCards() {
        const signDisplay = document.getElementById('signDisplay');
        signDisplay.innerHTML = '';

        for (let i = 0; i < this.currentText.length; i++) {
          const char = this.currentText[i];
          const signData = ASL_ALPHABET[char] || ASL_ALPHABET[' '];

          const card = document.createElement('div');
          card.className = 'sign-card';
          card.id = `sign-${i}`;

          card.innerHTML = `
                        <img src="${signData.image}" alt="${char}" class="asl-image">
                        <div class="sign-letter">${char === ' ' ? 'SPACE' : char}</div>
                        <div class="sign-description">${signData.description}</div>
                    `;

          signDisplay.appendChild(card);
        }
      }

      async playFingerspelling() {
        if (this.isPlaying) return;
        this.isPlaying = true;

        document.getElementById('playBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;

        const speed = parseFloat(document.getElementById('speedSlider').value);
        const delay = 1200 / speed;

        for (let i = this.currentIndex; i < this.currentText.length; i++) {
          if (!this.isPlaying) break;
          this.currentIndex = i;
          this.highlightCurrentSign(i);
          this.updateProgress();
          await this.sleep(delay);
        }

        if (this.isPlaying) this.fingerspellingComplete();
      }

      pauseFingerspelling() {
        this.isPlaying = false;
        document.getElementById('playBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
      }

      restartFingerspelling() {
        this.pauseFingerspelling();
        this.currentIndex = 0;
        this.clearHighlights();
        this.updateProgress();
      }

      fingerspellingComplete() {
        this.pauseFingerspelling();
        setTimeout(() => {
          this.clearHighlights();
          this.currentIndex = 0;
          this.updateProgress();
        }, 1000);
      }

      highlightCurrentSign(index) {
        this.clearHighlights();
        const card = document.getElementById(`sign-${index}`);
        if (card) card.classList.add('current');
      }

      clearHighlights() {
        document.querySelectorAll('.sign-card').forEach(card => card.classList.remove('current'));
      }

      updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const progressBar = document.getElementById('progressBar');
        if (this.currentText.length > 0) {
          progressBar.style.display = 'block';
          const progress = (this.currentIndex / this.currentText.length) * 100;
          progressFill.style.width = progress + '%';
        }
      }

      sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      new SignLanguageTranslator();
    });