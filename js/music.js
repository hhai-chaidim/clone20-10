// Select all required tags
const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  mainAudio = wrapper.querySelector("#main-audio"),
  playPauseBtn = wrapper.querySelector(".controls .play-pause"),
  prevBtn = wrapper.querySelector(".controls #prev"),
  nextBtn = wrapper.querySelector(".controls #next"),
  progressBar = wrapper.querySelector(".progress-bar"),
  progressArea = wrapper.querySelector(".progress-area"),
  repeatBtn = wrapper.querySelector("#repeat-plist"),
  musicList = wrapper.querySelector(".music-list"),
  showMoreMusicBtn = wrapper.querySelector("#more-music"),
  closeMoreMusicBtn = musicList.querySelector("#close-more-music"),
  ulMusicsTag = musicList.querySelector(".musics");

let musicIndex = 1;

window.addEventListener("load", () => {
  // Load data from local storage
  loadMusic(musicIndex);

  // Load songs into DOM
  for (let i = 0; i < allMusics.length; i++) {
    let liTag = `
      <li li-index="${i + 1}">
          <div class="row">
              <span>${allMusics[i].name}</span>
              <p>${allMusics[i].artist}</p>
          </div>
          <audio class="${allMusics[i].src}" src="songs/${allMusics[i].src}.mp3"></audio>
          <span id="${allMusics[i].src}" class="audio-duration"></span>
      </li>
    `;
    ulMusicsTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulMusicsTag.querySelector(`#${allMusics[i].src}`);
    let liAudioTag = ulMusicsTag.querySelector(`.${allMusics[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {
      let audioDuration = liAudioTag.duration;
      let totalMin = Math.floor(audioDuration / 60);
      let totalSec = Math.floor(audioDuration % 60);

      if (totalSec < 10) {
        totalSec = `0${totalSec}`;
      }

      liAudioDuration.innerText = `${totalMin}:${totalSec}`;
      liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
  }

  playingNow();
});

playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  isMusicPaused ? pauseMusic() : playMusic();
});

nextBtn.addEventListener("click", () => {
  nextMusic();
});

prevBtn.addEventListener("click", () => {
  prevMusic();
});

mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime; // Get playing song current time
  const duration = e.target.duration; // Get playing song total duration
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicDuration = wrapper.querySelector(".duration"),
    musicCurrentTime = wrapper.querySelector(".current");

  mainAudio.addEventListener("loadeddata", () => {
    // Update total song duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);

    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }

    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  // Update playing song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);

  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }

  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click", (e) => {
  let progressWidthVal = progressArea.clientWidth;
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration;

  mainAudio.currentTime = (clickedOffsetX / progressWidthVal) * songDuration;
  playMusic();
});

repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText;

  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffle");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle":
      let randIndex = Math.floor(Math.random() * allMusics.length + 1);

      do {
        randIndex = Math.floor(Math.random() * allMusics.length + 1);
      } while (musicIndex == randIndex);

      musicIndex = randIndex;
      loadMusic(musicIndex);
      playMusic();
      break;
  }
});

showMoreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

closeMoreMusicBtn.addEventListener("click", () => {
  showMoreMusicBtn.click();
});

function loadMusic(indexNumb) {
  musicName.innerText = allMusics[indexNumb - 1].name;
  musicArtist.innerText = allMusics[indexNumb - 1].artist;
  musicImg.src = `images/music/${allMusics[indexNumb - 1].img}.jpg`;
  musicImg.alt = allMusics[indexNumb - 1].name;
  mainAudio.src = `songs/${allMusics[indexNumb - 1].src}.mp3`;
}

export function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
  playingNow();
}

function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

function nextMusic() {
  musicIndex++;
  musicIndex > allMusics.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
}

function prevMusic() {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusics.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
}

export function playingNow() {
  const allLiTags = ulMusicsTag.getElementsByTagName("li");
  for (let i = 0; i < allLiTags.length; i++) {
    let audioTag = allLiTags[i].querySelector(".audio-duration");
    if (allLiTags[i].getAttribute("li-index") == musicIndex) {
      allLiTags[i].classList.add("playing");
      audioTag.innerText = "Playing";
    } else {
      allLiTags[i].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    allLiTags[i].setAttribute("onclick", "clicked(this)");
  }
}

function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");

  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}
