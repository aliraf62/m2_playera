radio.onReceivedString(function (receivedString) {
    currentStrength = radio.receivedPacket(RadioPacketProperty.SignalStrength)
    // Compute moving average
    total += 0 - readings[readIndex]
    readings[readIndex] = currentStrength
    total += readings[readIndex]
    readIndex += 1
    if (readIndex >= NUM_READINGS) {
        readIndex = 0
    }
    average = total / NUM_READINGS
    movingAverageStrength = average
    if (movingAverageStrength > SOME_THRESHOLD) {
        isCloseEnough = true
    } else {
        isCloseEnough = false
    }
    if (receivedString == "ConfirmM2") {
        confirmed = true
    } else if (receivedString == "Reset") {
        confirmed = false
        isCloseEnough = false
        basic.clearScreen()
    } else if (isCloseEnough) {
        radio.sendString("M2Found")
    } else {
        radio.sendString("M2Searching")
    }
})
let confirmed = false
let isCloseEnough = false
let movingAverageStrength = 0
let average = 0
let readIndex = 0
let total = 0
let currentStrength = 0
let SOME_THRESHOLD = 0
let readings: number[] = []
let NUM_READINGS = 0
// Calibration Phase
let calibrationValue = 0
// for smoothing out readings
// number of readings to average
NUM_READINGS = 10
for (let index = 0; index < NUM_READINGS; index++) {
    readings.push(0)
}
let BUFFER = 10
radio.setGroup(1)
for (let index = 0; index < 5; index++) {
    radio.sendString("Calibrate")
    calibrationValue += radio.receivedPacket(RadioPacketProperty.SignalStrength)
    basic.pause(100)
}
calibrationValue /= 5
SOME_THRESHOLD = calibrationValue + BUFFER
basic.forever(function () {
    if (confirmed) {
        basic.showIcon(IconNames.Happy)
    } else if (isCloseEnough) {
        basic.showIcon(IconNames.Yes)
    } else {
        basic.showIcon(IconNames.No)
    }
    basic.pause(500)
})
