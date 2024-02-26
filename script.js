(function () {
  if (!("mediaDevices" in navigator) || !("getUserMedia" in navigator.mediaDevices)) {
    alert("A API da câmera não está disponível no seu navegador");
    return;
  }

  // get page elements
  const video = document.querySelector("#video");
  const btnPlay = document.querySelector("#btnPlay");
  const btnPause = document.querySelector("#btnPause");
  const btnScreenshot = document.querySelector("#btnScreenshot");
  const btnChangeCamera = document.querySelector("#btnChangeCamera");
  const screenshotsContainer = document.querySelector("#screenshots");
  const canvas = document.querySelector("#canvas");
  const devicesSelect = document.querySelector("#devicesSelect");
  const titleInput = document.querySelector("#titleInput");

  // video constraints
  const constraints = {
    video: {
      width: {
        min: 1280,
        ideal: 1920,
        max: 2560,
      },
      height: {
        min: 720,
        ideal: 1080,
        max: 1440,
      },
    },
  };

  // usar câmera frontal
  let useFrontCamera = true;

  // fluxo de vídeo atual
  let videoStream;

  // lidar com eventos
  // play
  btnPlay.addEventListener("click", function () {
    video.play();
    btnPlay.classList.add("is-hidden");
    btnPause.classList.remove("is-hidden");
  });

  // pause
  btnPause.addEventListener("click", function () {
    video.pause();
    btnPause.classList.add("is-hidden");
    btnPlay.classList.remove("is-hidden");
  });

  // tirar captura de tela
  btnScreenshot.addEventListener("mousedown", async function () {
    const img = document.createElement("img");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    // Obtendo o título da imagem do campo de entrada de texto
    const title = titleInput.value.trim() || "screenshot";

    // Convertendo a imagem para base64 e exibindo
    img.src = canvas.toDataURL("image/jpeg");

    // Ao invés de criar um botão de dowload, crie um botão de enviar
    const sendButton = document.createElement("button");
    sendButton.classList.add("button", "is-primary");
    sendButton.textContent = "Enviar";
    sendButton.onclick = async function () {

      // Converta a imagem para base64
      const img = document.createElement("img");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      img.src = canvas.toDataURL("image/jpeg");

      // Obtendo o título da imagem do campo de entrada de texto
      const title = titleInput.value.trim() || "screenshot";

      // Adicione a lógica para enviar a imagem e o título para outra página
      await sendImageToServer(img.src, title);

      // Adicione um alerta ou outra lógica após o envio bem-sucedido
      alert("Imagem enviada com sucesso!");

      // Limpar a lista de imagens
      screenshotsContainer.innerHTML = "";
    };

    // Adicione o botão de enviar à página
    screenshotsContainer.innerHTML = "";
    screenshotsContainer.appendChild(img);
    screenshotsContainer.appendChild(sendButton);
  });

  // mudar de câmera
  btnChangeCamera.addEventListener("click", function () {
    useFrontCamera = !useFrontCamera;
    initializeCamera();
  });

  // parar a transmissão de vídeo
  function stopVideoStream() {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  // inicializar
  async function initializeCamera() {
    stopVideoStream();
    constraints.video.facingMode = useFrontCamera ? "user" : "environment";

    try {
      videoStream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = videoStream;
    } catch (err) {
      alert("Não foi possível acessar a câmera");
    }
  }

  // Função para enviar imagem para o servidor
  async function sendImageToServer(imageData, title) {
    try {
      ('https://seu-app-backend.glitch.me/api/upload', {
        method: 'POST',
        body: JSON.stringify({ image: imageData, title }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log('Imagem enviada para o servidor:', data.imageUrl);

      // Atualize a lista de imagens na página de desenvolvedores
      displayImages();
    } catch (error) {
      console.error('Erro ao enviar imagem para o servidor:', error);
    }
  }
  
  initializeCamera();
})();


