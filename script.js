const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const captureButton = document.getElementById('capture');

// Access webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error('Error accessing webcam: ', err);
    });

captureButton.addEventListener('click', () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');
    
    // Send imageData to backend for lane detection
    fetch('http://your-backend-api/lane-detection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageData })
    })
    .then(response => response.json())
    .then(data => {
        drawLanes(data.lanes);
    })
    .catch(err => {
        console.error('Error detecting lanes: ', err);
    });
});

function drawLanes(lanes) {
    lanes.forEach(lane => {
        ctx.beginPath();
        ctx.moveTo(lane[0].x, lane[0].y);
        ctx.lineTo(lane[1].x, lane[1].y);
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}
