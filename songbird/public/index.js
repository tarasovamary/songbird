import birdsData from "../assets/data/bird.js";

/*================================================*/
//Переменные игры
/*================================================*/
let score = 0;
let optionsIndex = 0;

/*================================================*/
// *Модальное окно
/*================================================*/
const modalWindow = document.querySelector('.modal');
const overlayModal = document.querySelector('.modal__overlay');
const buttonModal = document.getElementById('modal-button');
const modalTitle = document.querySelector('.modal__title');

const handleClick = (event) => {
  modalWindow.classList.toggle('hidden');
}


  overlayModal.addEventListener('click', () => {
    modalWindow.classList.toggle('hidden');
  });

const reloadPage = function() {
    buttonModal.addEventListener('click', () => {
    document.location.reload();
   })
}

/*================================================*/
//*Функционал игры
/*================================================*/

//Заполнение вариантов ответа
const listItem = document.querySelectorAll('.birds__item');
const listContainer = document.querySelector('.birds__list');
const btnAnswer = document.querySelector('.button__answer');
const scoreContainer = document.querySelector('.score');
const nextLevelBtn = document.getElementById('next-level');
const birdsOption = document.querySelector('.birds__options');
const birdsInfo = document.querySelector('.birds__info');


const birdTitle = document.querySelector('.birds__title');
const birdTitleLatin = document.querySelector('.birds__title_latin');
const birdDescription = document.querySelector('.birds__description');

clearList();
showOptions();
btnAnswer.addEventListener('click', () => {
  const isWin = birdsOption.classList.contains('win');
  if(!isWin) {
    checkAnswer();
    loadSongOptions();
    addOptions();
  } else {
    addOptions();
    loadSongOptions();
  }
});

function clearList() {
  listContainer.innerHTML = '';
}

function showOptions() {
  birdsData[optionsIndex];

  //Варианты ответов
  let answerNumber = 1;
  for (let item of (birdsData[optionsIndex])) {
    const birdName = item.name;
    const optionsTemplate = 
    `<li class="birds__item">
      <label>
        <input value="%number%" type="radio" class="answer" name="answer">
        <span class="custom-radio"></span>
        <span>%name%</span>
      </label>
    </li>`;
    const birdsItem = optionsTemplate
                      .replace('%name%', birdName)
                      .replace('%number%', answerNumber);
    listContainer.innerHTML += birdsItem;
    answerNumber++ ;
  }
}




//Проверка ответа

function checkAnswer() {
  const customRadio = document.querySelectorAll('.custom-radio');
  const checkedRadio = document.querySelector('input[type="radio"]:checked');
 
  //Если ответ не выбран - ничего не делаем выходим из функции
    if (!checkedRadio) {
    btnAnswer.blur();
    return
    }
  //Номер ответа пользователя
    const userAnswer = parseInt(checkedRadio.value);

  //Если ответ верный - увеличиваем скор
    if (userAnswer === birdsData[optionsIndex][songIndex].id) {
      score += 5;
      loadBird();
      playWinMelody();
      pauseSong();
      pauseSongOptions();
      birdsOption.classList.add('win');
      birdsOption.classList.remove('lose');
      const scoreTemplate = `<span class="score">${score}</span>`;
      scoreContainer.innerHTML = scoreTemplate;
      nextLevelBtn.style.background = 'rgb(114, 224, 118)';
      // btnAnswer.disabled = true;
      for(let i=0; i<customRadio.length; i++) {
        if (i === userAnswer-1) {
          customRadio[i].classList.add('true');
        } 
       }
       if(optionsIndex == birdsData[optionsIndex].length-1) {
        showResults();
        handleClick();;
      }
    } else {
      score -= 1;
      playLoseMelody();
      birdsOption.classList.remove('win');
      birdsOption.classList.add('lose');
      for(let i=0; i<customRadio.length; i++) {
        if (i === userAnswer-1) {
          customRadio[i].classList.add('falsy');
        } 
       }
    }
    
    //Завершение игры
    
  }
   
  function addOptions() {
    const checkedRadio = document.querySelector('input[type="radio"]:checked');
    const userAnswer = parseInt(checkedRadio.value);
    //Добавляем информацию о выбранной птице в соседний блок
    birdsInfo.style.display = 'flex';
    birdTitle.textContent = birdsData[optionsIndex][userAnswer-1].name;
    birdTitleLatin.textContent = birdsData[optionsIndex][userAnswer-1].species;
    birdDescription.textContent = birdsData[optionsIndex][userAnswer-1].description;
    secretImageOption.src = birdsData[optionsIndex][userAnswer-1].image;
    secretImageOption.width = '200';
    secretImageOption.height = '150';
    currentTrackOptions.src = birdsData[optionsIndex][userAnswer-1].audio;
  }

  //Если ответили верно - переключаем на следующий уровень
  nextLevelBtn.addEventListener('click', function() {
    const isWin = birdsOption.classList.contains('win');
    if(isWin) {
      nextLevel();
      birdsOption.classList.remove('win')
  }});

  //Переключение уровня и песни
  nextLevelBtn.style.background = 'rgb(174, 207, 175)';

function nextLevel() {
  optionsIndex++;
  clearList();
  showOptions();
  nextSong();
  resetBird();
  colorLink();
  btnAnswer.disabled = false;
}

//Рандом птиц 
function random() {
  return Math.floor(Math.random() * 6);
}

function loadBird() {
  secretName.textContent = birdsData[optionsIndex][songIndex].name;
  secretImage.src = birdsData[optionsIndex][songIndex].image;
  secretImage.width = 250;
}

function resetBird() {
  secretName.textContent = '??????';
  secretImage.src = '../assets/img/question.png';
  secretImage.width = 170;

  birdTitle.textContent = 'Послушай плеер и выбери из списка птицу, которая соответствует пению.';
  birdTitleLatin.textContent = '';
  birdDescription.textContent = '';
  secretImageOption.src = "../assets/img/question.png";
  secretImageOption.width = '120';
  secretImageOption.height = '120';
  currentTrackOptions.src = "#";
  birdsInfo.style.display = 'none';

  nextLevelBtn.style.background = 'rgb(174, 207, 175)';
}


/*================================================*/
// *Аудиоплеер 
/*================================================*/

const audioPlayer = document.querySelector('.audio-player');
const currentTrack = document.querySelector('.audio');
const playBtn = document.querySelector('.play-button');
const playSrc = document.querySelector('.play-src');
const currTime = document.querySelector('.current-time');
const durTime = document.querySelector('.time-duration');
const progressBar = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress__container');
const volumeSlider = document.getElementById('volume_slider');

const secretName = document.querySelector('.secret-name');
const secretImage = document.querySelector('.secret-bird');
const secretImageOption = document.querySelector('.secret-bird_option');


//Перемешиваем песни и загружаем их рандомно на каждый уровень
let songIndex = random();

loadSong(songIndex);

function loadSong(songIndex) {
  reset();
  currentTrack.src = birdsData[optionsIndex][songIndex].audio;
  currentTrack.load();
  console.log(birdsData[optionsIndex][songIndex].name);
}

function playSong() {
  currentTrack.play();
  audioPlayer.classList.add('play');
  playSrc.src = '../assets/img/pause.png';
}

playBtn.addEventListener('click', () => {
  const isPlaying = audioPlayer.classList.contains('play');
  if(isPlaying) {
    pauseSong();
  } else {
    playSong();
    pauseSongOptions();
  }
});


function pauseSong() {
  currentTrack.pause();
  audioPlayer.classList.remove('play');
  playSrc.src = '../assets/img/play.png';
}

function nextSong() {
  songIndex = random();
  if (songIndex > birdsData[optionsIndex].length-1) {
    songIndex = 0;
  }
  loadSong(songIndex);
  playSrc.src = '../assets/img/play.png';
}

//Прогресс бар
function updateProgress(event) {
  const {duration, currentTime} = event.srcElement;
  const progressPrecent = (currentTime/duration) * 100;
  progressBar.style.width = `${progressPrecent}%`;

  if (progressPrecent === 100) {
    playSrc.src = '../assets/img/play.png';
  }
  if (!isNaN (currentTrack.duration)) {
    let currentMinutes = Math.floor(currentTrack.currentTime/60);
    let currentSeconds = Math.floor(currentTrack.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(currentTrack.duration/60);
    let durationSeconds = Math.floor(currentTrack.duration - durationMinutes * 60);
  
    if(currentSeconds < 10) {currentSeconds = "0" + currentSeconds;}
    if(durationSeconds < 10) {durationSeconds = "0" + durationSeconds;}
    if(currentMinutes < 10) {currentMinutes = "0" + currentMinutes;}
    if(durationMinutes < 10) {durationMinutes = "0" + durationMinutes;}
  
    currTime.textContent = currentMinutes + ":" + currentSeconds;
    durTime.textContent = durationMinutes + ":" + durationSeconds;
  }
 }

 function reset() {
  currTime.textContent = '00:00';
  durTime.textContent = '00:00';
  progressBar.style.width = '0%';
 }

 currentTrack.addEventListener('timeupdate', updateProgress);

 function setProgress(event) {
  const width = this.clientWidth;
  const clickX = event.offsetX;
  const duration = currentTrack.duration;
  currentTrack.currentTime = (clickX/width) * duration;
 }

 progressContainer.addEventListener('click', setProgress);


//Регулировка звука
function setVolume() {
  currentTrack.volume = volumeSlider.value/100;
}

volumeSlider.addEventListener('change', setVolume);

//Мелодия правильного ответа и неправильного

function playWinMelody() {
  const createMelody = document.createElement('audio');
  createMelody.src = '../assets/audio/audio-win.mp3';
  createMelody.setAttribute = ('preload', 'auto');
  createMelody.setAttribute = ('controls', 'none');
  createMelody.style.display = 'none';
  birdsOption.appendChild(createMelody);
  createMelody.play();
}

function playLoseMelody() {
  const createMelody = document.createElement('audio');
  createMelody.src = '../assets/audio/audio-lose.mp3';
  createMelody.setAttribute = ('preload', 'auto');
  createMelody.setAttribute = ('controls', 'none');
  createMelody.style.display = 'none';
  birdsOption.appendChild(createMelody);
  createMelody.play();
}


//Красим активную линку

const navLink = document.querySelectorAll('.nav-link');

function colorLink() {
  for (let i=0; i<navLink.length; i++) {
    if(i===optionsIndex) {
      navLink[i].classList.add('active');
    }
    if(i===optionsIndex-1) {
      navLink[i].classList.remove('active');
    }
  }
}

function showResults() {
  reloadPage();
  buttonModal.textContent = 'Начать игру заново';
  if (score === 30) {
    modalTitle.textContent = `Поздравляю, ты угадал всех птиц! Ты точно знаешь, как поют птички! Хочешь начать игру заново?`;
  } else if (score >= 15) {
    modalTitle.textContent = `Неплохой результат, ты угадал более половины всех птиц! Твой счёт: ${score} из 30. Хочешь начать игру заново?`;
  } else {
    modalTitle.textContent = `Стоит постараться, пока у тебя менее половины правильных ответов! Твой счёт: ${score} из 30. Хочешь начать игру заново?`
  }
}



// *Аудиоплеер 2
/*================================================*/

const audioPlayerOptions = document.querySelector('.audio-player-options');
const currentTrackOptions = document.querySelector('.audio-options');
const playBtnOptions = document.querySelector('.play-button-options');
const playSrcOptions = document.querySelector('.play-src-options');
const currTimeOptions = document.querySelector('.current-time-options');
const durTimeOptions = document.querySelector('.time-duration-options');
const progressBarOptions = document.querySelector('.progress-options');
const progressContainerOptions = document.querySelector('.progress__container-options');


//Перемешиваем песни и загружаем их рандомно на каждый уровень

function loadSongOptions() {
  const checkedRadio = document.querySelector('input[type="radio"]:checked');
  const userAnswer = parseInt(checkedRadio.value);
  resetOptions();
  currentTrackOptions.src = birdsData[optionsIndex][userAnswer-1].audio;
  currentTrackOptions.load();
}

function playSongOptions() {
  currentTrackOptions.play();
  audioPlayerOptions.classList.add('play');
  playSrcOptions.src = '../assets/img/pause.png';
}


playBtnOptions.addEventListener('click', () => {
  const isPlaying = audioPlayerOptions.classList.contains('play');
  if(isPlaying) {
    pauseSongOptions();
  } else {
    playSongOptions();
    pauseSong();
  }
});

function pauseSongOptions() {
  currentTrackOptions.pause();
  audioPlayerOptions.classList.remove('play');
  playSrcOptions.src = '../assets/img/play.png';
}

//Прогресс бар
function updateProgressOptions(event) {
  const {duration, currentTime} = event.srcElement;
  const progressPrecentOptions = (currentTime/duration) * 100;
  progressBarOptions.style.width = `${progressPrecentOptions}%`;

  if (progressPrecentOptions === 100) {
    playSrcOptions.src = '../assets/img/play.png';
  }
  if (!isNaN (currentTrackOptions.duration)) {
    let currentMinutes = Math.floor(currentTrackOptions.currentTime/60);
    let currentSeconds = Math.floor(currentTrackOptions.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(currentTrackOptions.duration/60);
    let durationSeconds = Math.floor(currentTrackOptions.duration - durationMinutes * 60);
  
    if(currentSeconds < 10) {currentSeconds = "0" + currentSeconds;}
    if(durationSeconds < 10) {durationSeconds = "0" + durationSeconds;}
    if(currentMinutes < 10) {currentMinutes = "0" + currentMinutes;}
    if(durationMinutes < 10) {durationMinutes = "0" + durationMinutes;}
  
    currTimeOptions.textContent = currentMinutes + ":" + currentSeconds;
    durTimeOptions.textContent = durationMinutes + ":" + durationSeconds;
  }
 }

 function resetOptions() {
  currTimeOptions.textContent = '00:00';
  durTimeOptions.textContent = '00:00';
  progressBarOptions.style.width = '0%';
 }

 currentTrackOptions.addEventListener('timeupdate', updateProgressOptions);

 function setProgressOptions(event) {
  const width = this.clientWidth;
  const clickX = event.offsetX;
  const duration = currentTrackOptions.duration;
  const durationOptions = currentTrackOptions.duration;
  currentTrackOptions.currentTime = (clickX/width) * durationOptions;
 }
 progressContainerOptions.addEventListener('click', setProgressOptions);