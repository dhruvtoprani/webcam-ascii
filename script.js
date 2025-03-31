const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const asciiOutput = document.getElementById("ascii-output");

// ASCII characters by brightness (dark → light)
const asciiChars = "@#S%?*+;:,. ";

async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    video.addEventListener("loadeddata", () => {
      canvas.width = 80;  // Low-res = faster & more aesthetic
      canvas.height = 60;
      renderLoop();
    });
  } catch (err) {
    asciiOutput.textContent = "Webcam access denied.";
    console.error(err);
  }
}

function renderLoop() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = frame;

  let ascii = "";
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
      ascii += asciiChars.charAt(asciiChars.length - 1 - charIndex);
    }
    ascii += "\n";
  }

  asciiOutput.textContent = ascii;
  requestAnimationFrame(renderLoop); // Real-time loop
}

startWebcam();
