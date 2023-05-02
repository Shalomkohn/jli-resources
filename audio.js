const timelineContainer = document.querySelector(".timeline-container")
const playPauseBtn = document.querySelector(".play-pause-btn")
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
const audio = document.querySelector(".audio-element")


// Timeline
timelineContainer.addEventListener("mousemove", handleTimelineUpdate)
timelineContainer.addEventListener("mousedown", toggleScrubbing)

document.addEventListener("mouseup", e => {
    if (isScrubbing) toggleScrubbing(e)
})

document.addEventListener("mousemove", e => {
    if (isScrubbing) handleTimelineUpdate(e)
})


let isScrubbing = false
let wasPaused;

function toggleScrubbing(e) {
    e.preventDefault()
    const rect = timelineContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    isScrubbing = (e.buttons & 1) === 1
    viewerContainer.classList.toggle("scrubbing", isScrubbing)
    if (isScrubbing) {
        wasPaused = audio.paused
        audio.pause()
    } else {
        audio.currentTime = percent * audio.duration
        if (!wasPaused) audio.play()
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

//did till here

playPauseBtn.addEventListener("click", () => togglePlay())

audio.addEventListener("click", () => togglePlay())

document.addEventListener("keydown", e => {
    const activeElement = document.activeElement.tagName.toLowerCase()

    if (activeElement === 'input') return

    switch(e.key.toLowerCase()) {
        case " ":
            if( activeElement === 'button') return
        case "k":
            togglePlay()
            break
        case "m":
            toggleMute()
            break
        case "arrowleft":
        case "j":
            skip(-10)
            break
        case "arrowright":
        case "l":
            skip(10)
            break
    }
})


function togglePlay() {
    audio.paused ? audio.play() : audio.pause()
}


audio.addEventListener("play", () => {
    viewerContainer.classList.remove("paused")
})

audio.addEventListener("pause", () => {
    viewerContainer.classList.add("paused")
})


// Skip / Rewind


backwardBtn.addEventListener("click", () => {
    skip(-10)
})

forwardBtn.addEventListener("click", () => {
    skip(10)
})

// Restart

restartBtn.addEventListener("click", restart)

function restart() {
    audio.currentTime = 0;
}

// Playback speed 

playbackSpeedBtn.addEventListener("click", changePlaybackSpeed)


function changePlaybackSpeed() {
    let newPlaybackRate = audio.playbackRate + .25
    if (newPlaybackRate > 2) newPlaybackRate = 0.50
    audio.playbackRate = newPlaybackRate
    playbackSpeedBtn.textContent = `${newPlaybackRate}x`
}

// Duration

audio.addEventListener("loadeddata", () => {
    totalTimeElm.textContent = formatDuration(audio.duration)
})

audio.addEventListener("timeupdate", () => {
    currentTimeElm.textContent = formatDuration(audio.currentTime)
    const percent = audio.currentTime / audio.duration
    timelineContainer.style.setProperty("--progress-position", percent)
})

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
    audio.currentTime += duration;
}

// Volume 

volumeSlider.addEventListener("input", e => {
    audio.volume = e.target.value
    audio.muted = e.target.value === 0
})


audio.addEventListener("volumechange", () => {
    volumeSlider.value = audio.volume;
    let sound;
    if(audio.muted || audio.volume === 0) {
        volumeSlider.value = 0
        sound = 'mute'
    } else {
        sound = 'on'
    }

    viewerContainer.dataset.sound = sound
})

volumeBtn.addEventListener("click", toggleMute)

function toggleMute() {
    audio.muted = !audio.muted
}

