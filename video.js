const timelineContainer = document.querySelector(".timeline-container")
const playPauseBtn = document.querySelector(".play-pause-btn")
const fullScreenBtn = document.querySelector(".full-screen-btn")
const documentMinimizeBtn = document.querySelector(".document-minimize-btn")
const currentTimeElm = document.querySelector(".current-time")
const totalTimeElm = document.querySelector(".total-time")
const restartBtn = document.querySelector(".restart-button")
const playbackSpeedBtn = document.querySelector(".playback-speed-button")
const backwardBtn = document.querySelector(".backward-button")
const forwardBtn = document.querySelector(".forward-button")
const volumeBtn = document.querySelector(".volume-button")
const volumeSlider = document.querySelector(".volume-slider")
const viewerMainSection = document.querySelector(".viewer-main")
const viewerContainer = document.querySelector(".viewer-container")
const documentHeader = document.querySelector(".document-header")
const media = document.querySelector(".media-element")
const video = document.querySelector(".video-element")

// Timeline
if(timelineContainer){
    timelineContainer.addEventListener("mousemove", handleTimelineUpdate)
    timelineContainer.addEventListener("mousedown", toggleScrubbing)
}

document.addEventListener("mouseup", e => {
    if (isScrubbing) toggleScrubbing(e)
})

if (timelineContainer) {
    document.addEventListener("mousemove", e => {
        if (isScrubbing) handleTimelineUpdate(e)
    })
}


let isScrubbing = false
let wasPaused;

function toggleScrubbing(e) {
    e.preventDefault()
    const rect = timelineContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    isScrubbing = (e.buttons & 1) === 1
    viewerContainer.classList.toggle("scrubbing", isScrubbing)
    if (isScrubbing) {
        wasPaused = media.paused
        media.pause()
    } else {
        media.currentTime = percent * media.duration
        if (!wasPaused) media.play()
    }
    handleTimelineUpdate(e)
}



function handleTimelineUpdate(e) {
    const rect = timelineContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    timelineContainer.style.setProperty("--preview-position", percent)

    if(isScrubbing) {
        timelineContainer.style.setProperty("--progress-position", percent)
    }
}

// Play / Pause

if(playPauseBtn && !isSmallScreen()) playPauseBtn.addEventListener("click", () => togglePlay())

if(media && playPauseBtn && !isSmallScreen()) media.addEventListener("click", () => togglePlay())

document.addEventListener("keydown", e => {
    const activeElement = document.activeElement.tagName.toLowerCase()

    if (activeElement === 'input') return

    switch(e.key.toLowerCase()) {
        case " ":
            if( activeElement === 'button' || !media) return
        case "k":
            if (!media || isSmallScreen()) return
            togglePlay()
            break
        case "f":
            toggleFullScreen()
            break
        case "m":
            if (!media || isSmallScreen()) return
            toggleMute()
            break
        case "arrowleft":
        case "j":
            if (!media || isSmallScreen()) return
            skip(-10)
            break
        case "arrowright":
        case "l":
            if (!media || isSmallScreen()) return
            skip(10)
            break
    }
})


function togglePlay() {
    media.paused ? media.play() : media.pause()
}

if (media && !isSmallScreen()) {

    media.addEventListener("play", () => {
        viewerContainer.classList.remove("paused")
    })

    media.addEventListener("pause", () => {
        viewerContainer.classList.add("paused")
    })
}


// Skip / Rewind


if (backwardBtn && forwardBtn && !isSmallScreen()) {
    backwardBtn.addEventListener("click", () => {
        skip(-10)
    })
    forwardBtn.addEventListener("click", () => {
        skip(10)
    })
}

// Restart

if ( restartBtn && media && !isSmallScreen()) restartBtn.addEventListener("click", restart)

function restart() {
    media.currentTime = 0;
}

// Playback speed 

if (playbackSpeedBtn && media  && !isSmallScreen()) playbackSpeedBtn.addEventListener("click", changePlaybackSpeed)


function changePlaybackSpeed() {
    let newPlaybackRate = media.playbackRate + .25
    if (newPlaybackRate > 2) newPlaybackRate = 0.50
    media.playbackRate = newPlaybackRate
    playbackSpeedBtn.textContent = `${newPlaybackRate}x`
}

// Duration

if (video && totalTimeElm  && !isSmallScreen()) {
    video.addEventListener("loadeddata", () => {
        totalTimeElm.textContent = formatDuration(media.duration)
    })
}
if (!video && media && totalTimeElm) {
    media.addEventListener("loadeddata", () => {
        totalTimeElm.textContent = formatDuration(media.duration)
    })
}

if (media && currentTimeElm && timelineContainer  && !isSmallScreen()) {

    media.addEventListener("timeupdate", () => {
        currentTimeElm.textContent = formatDuration(media.currentTime)
        const percent = media.currentTime / media.duration
        timelineContainer.style.setProperty("--progress-position", percent)
    })
}

function formatDuration(time) {
    var seconds = Math.floor(time % 60)
    var minutes = Math.floor(time / 60) % 60
    var hours = Math.floor(time / 3600)

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if (hours == 0) {
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`;
}

function skip(duration) {
    media.currentTime += duration;
}

// Volume 

if ( volumeSlider && media && !isSmallScreen()) {
    volumeSlider.addEventListener("input", e => {
        media.volume = e.target.value
        media.muted = e.target.value === 0
    })
}

if (media && volumeSlider && !isSmallScreen()) {

    media.addEventListener("volumechange", () => {
        volumeSlider.value = media.volume;
        let sound;
        if(media.muted || media.volume === 0) {
            volumeSlider.value = 0
            sound = 'mute'
        } else {
            sound = 'on'
        }

        viewerContainer.dataset.sound = sound
    })
}

if (volumeBtn && media && !isSmallScreen()) volumeBtn.addEventListener("click", toggleMute)

function toggleMute() {
    media.muted = !media.muted
}



// Full Screen Mode

if(documentMinimizeBtn) documentMinimizeBtn.addEventListener("click", () => toggleFullScreen());


if(fullScreenBtn) {
    fullScreenBtn.addEventListener("click", () => toggleFullScreen());
    // fullScreenBtn.addEventListener("touchstart", () => toggleFullScreen());
    // fullScreenBtn.addEventListener("touchend", () => toggleFullScreen());
}

function toggleFullScreen() {
    const fullscreenElement = document.webkitFullscreenElement || document.fullscreenElement;

    if (fullscreenElement == null) {
        viewerMainSection.requestFullscreen ?
        viewerMainSection.requestFullscreen() :
        viewerMainSection.webkitRequestFullscreen()
    } else {
        document.exitFullscreen ?
        document.exitFullscreen() : 
        document.webkitExitFullscreen()
    }
}

document.addEventListener("fullscreenchange", () => {
    viewerContainer.classList.toggle('full-screen', document.fullscreenElement)
    documentHeader.classList.toggle('full-screen', document.fullscreenElement)
})

document.addEventListener("webkitfullscreenchange", () => {
    viewerContainer.classList.toggle('full-screen', document.fullscreenElement)
    documentHeader.classList.toggle('full-screen', document.fullscreenElement)
})

// Reveal / Hide controls on full screen
if(viewerContainer && !isSmallScreen()) {
    viewerContainer.addEventListener("mousemove", revealControls)
    viewerContainer.addEventListener("mouseleave", hideControls)
}

let timeoutId
function revealControls() {
    const fullscreenElement = document.webkitFullscreenElement || document.fullscreenElement;
    if(!fullscreenElement) return
    viewerContainer.classList.add("mouse-over")
    clearTimeout(timeoutId);
    timeoutId = setTimeout(hideControls, 3500);

}

function hideControls() {
    viewerContainer.classList.remove("mouse-over")
}

// Reveal controls attribute on video on small screens 
function getClientWidth() {
    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    var clientWidth = $(window).width() - scrollbarWidth;
    return clientWidth
}

function addControlsIfSmallScreen() {
    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (getClientWidth() < 1001) {
      video?.setAttribute("controls", "");
      viewerContainer.classList.add('small-screen')
    } else {
      video?.removeAttribute("controls");
      viewerContainer.classList.remove('small-screen')
    }
}

function isSmallScreen() {
    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    let smallScreen;
    if (getClientWidth() < 1001) {
        smallScreen = true
      } else {
        smallScreen = false
      }
    return smallScreen
}

  
window.addEventListener("load", addControlsIfSmallScreen);
window.addEventListener("resize", addControlsIfSmallScreen);



