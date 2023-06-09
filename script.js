const container = document.querySelector(".container"),
mainVideo = container.querySelector("video"),
playPauseBtn = container.querySelector(".play-pause i"),
volumeBtn = container.querySelector(".volume i"),
volumeSlider = container.querySelector(".left input"),
currentVidTime = container.querySelector(".video-timer .current-time"),
videoDuration = container.querySelector(".video-duration"),
progressBar = container.querySelector(".progress-bar"),
videoTimeline = container.querySelector(".video-timeline"),
skipForward = container.querySelector(".skip-forward i"),
skipBackward = container.querySelector(".skip-backward i"),
skipIntervat = 5,
speedBtn = container.querySelector(".playback-speed span"),
speedOptions = container.querySelector(".speed-options"),
pipBtn = container.querySelector(".pic-in-pic span"),
fullScreenBtn = container.querySelector(".fullscreen i")
let timer

const hideControls = () => {
    if(mainVideo.paused) return
    timer = setTimeout(() => {
        container.classList.remove("show-controls")
    }, 3000)
}
hideControls()

container.addEventListener("mousemove", () => {
    container.classList.add("show-controls")
    clearTimeout(timer)
    hideControls()   
})

const formatTime = (time) => {
    let sec = Math.floor(time % 60),
    min = Math.floor(time / 60) % 60,
    hr = Math.floor(time / 3600) % 60

    sec = sec < 10 ? `0${sec}` : sec
    min = min < 10 ? `0${min}` : min
    hr = hr < 10 ? `0${hr}` : hr

    if(hr == 0) {
        return `${min}:${sec}`
    }
    return `${hr}:${min}:${sec}`
}

const draggableProgressBar = e => {
    let timelineWidth = videoTimeline.clientWidth
    progressBar.style.width = `${e.offsetX}px`
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration
    currentVidTime.innerText = formatTime(mainVideo.currentTime)
}

volumeBtn.addEventListener("click", () => {
    if(volumeBtn.classList.contains("fa-volume-high")) {
        mainVideo.volume = 0.0
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark")
    } else {
        mainVideo.volume = 0.5
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high")
    }
    volumeSlider.value = mainVideo.volume
})

volumeSlider.addEventListener("input", () => {
    if(volumeSlider.value > 0) {
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high")
    } else {        
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark")
    }
    mainVideo.volume = volumeSlider.value
})

videoTimeline.addEventListener("mousemove", e => {
    let timelineWidth = videoTimeline.clientWidth
    let offsetX = e.offsetX
    let percent = Math.floor((offsetX / timelineWidth) * mainVideo.duration)
    const progressTime = videoTimeline.querySelector("span")
    offsetX = offsetX < 20 ? 20 : (offsetX > timelineWidth - 20) ? timelineWidth - 20 : offsetX
    progressTime.style.left = `${offsetX}px`
    progressTime.innerText = formatTime(percent)
})

videoTimeline.addEventListener("click", e => {
    let timelineWidth = videoTimeline.clientWidth
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration
})

mainVideo.addEventListener("timeupdate", e => {
    let {currentTime, duration} = e.target,
    percent = (currentTime/duration) * 100

    progressBar.style.width = `${percent}%`
    currentVidTime.innerText = formatTime(currentTime)

})

document.addEventListener("click", e => {
    if(e.target.tagName != "SPAN" || e.target.className != "material-symbols-rounded") {
        speedOptions.classList.remove("show")
    }
})

speedOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () => {
        mainVideo.playbackRate = option.dataset.speed
        speedOptions.querySelector(".active").classList.remove("active")
        option.classList.add("active")
    })
})

fullScreenBtn.addEventListener("click", () => {
    container.classList.toggle("fullscreen")
    if(document.fullscreenElement) {
        fullScreenBtn.classList.replace("fa-compress", "fa-expand")
        return document.exitFullscreen()
    }
    
    fullScreenBtn.classList.replace("fa-expand", "fa-compress")
    container.requestFullscreen()
})

pipBtn.addEventListener("click", () => mainVideo.requestPictureInPicture())
speedBtn.addEventListener("click", () => speedOptions.classList.toggle("show"))
skipForward.addEventListener("click", () => mainVideo.currentTime += skipIntervat)
skipBackward.addEventListener("click", () => mainVideo.currentTime -= skipIntervat)
mainVideo.addEventListener("loadeddata", () => videoDuration.innerText = formatTime(mainVideo.duration))
mainVideo.addEventListener("play", () => playPauseBtn.classList.replace("fa-play", "fa-pause"))
mainVideo.addEventListener("pause", () => playPauseBtn.classList.replace("fa-pause", "fa-play"))
playPauseBtn.addEventListener("click", () => (mainVideo.paused) ? mainVideo.play() : mainVideo.pause())
videoTimeline.addEventListener("mousedown", () => videoTimeline.addEventListener("mousemove", draggableProgressBar))
document.addEventListener("mouseup", () => videoTimeline.removeEventListener("mousemove", draggableProgressBar))