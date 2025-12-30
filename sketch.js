let furnitureObjects = []; 
let modelSofa, modelChair;
let currentModelType = 'sofa'; 

let currentColor;
let currentRotation = 0;
let currentScale = 1; 

// Variabel Sound Effect
let humSound;

function preload() {
  // Load Model 3D
  modelSofa = loadModel('loungeDesignSofaCorner.obj', true);
  modelChair = loadModel('chair.obj', true);
  
  // Load Sound Effect
  humSound = loadSound('engine.mp3');
}

function setup() {
  // Menggunakan p5.AR / p5.xr
  createARCanvas(windowWidth, windowHeight); 
  
  // Inisialisasi Warna awal
  currentColor = color(255, 255, 255); 
  setupUI();

  // Loop suara agar terus berbunyi sejak awal (jika browser mengizinkan)
  // Catatan: Kebanyakan browser butuh interaksi user (klik) sebelum suara bunyi
  humSound.loop();
  humSound.setVolume(0.5);
}

function draw() {
  // Pencahayaan agar model terlihat 3D
  ambientLight(150);
  directionalLight(255, 255, 255, 0.5, 1, -0.5);

  for (let i = 0; i < furnitureObjects.length; i++) {
    let item = furnitureObjects[i];
    
    push();
    // Posisikan sesuai titik tap (WEBGL Coords)
    translate(item.x, item.y, item.z);

    // Animasi Melayang tipis
    let floatAnim = sin(frameCount * 0.05) * 5;
    translate(0, floatAnim, 0);

    // Transformasi
    rotateX(PI); // Memperbaiki posisi model yang biasanya terbalik
    rotateY(item.rot);
    scale(item.scl * 2); 
    
    // Material & Warna
    noStroke();
    fill(item.col); 
    specularMaterial(250); // Menambah efek kilau
    
    if (item.type === 'sofa') {
      if (modelSofa) model(modelSofa);
      else box(100, 50, 50);
    } else {
      if (modelChair) model(modelChair);
      else sphere(40);
    }
    pop();
  }
}

function mousePressed() {
  // 1. Logika Audio: Klik untuk play/pause 
  if (humSound.isPlaying()) {
    humSound.pause();
  } else {
    humSound.play();
  }

  // 2. Deteksi jika menekan tombol UI agar tidak menaruh objek di belakang tombol
  if (mouseY > height - 100) return;

  let x = mouseX - width / 2;
  let y = mouseY - height / 2;

  // 3. Menaruh objek baru
  furnitureObjects.push({
    x: x, y: y, z: 0, 
    type: currentModelType,
    col: currentColor,
    rot: currentRotation, 
    scl: currentScale
  });
}

function setupUI() {
  let uiDiv = createDiv('');
  uiDiv.position(0, height - 80);
  uiDiv.style('width', '100%');
  uiDiv.style('display', 'flex');
  uiDiv.style('justify-content', 'center');
  uiDiv.style('gap', '10px');
  uiDiv.style('z-index', '1000'); 
  
  function makeBtn(label, callback) {
    let btn = createButton(label);
    btn.parent(uiDiv);
    btn.mousePressed((e) => {
        e.stopPropagation(); // Mencegah klik tombol memicu penempatan objek/suara
        callback();
    });
    btn.style('padding', '12px');
    btn.style('border-radius', '10px');
    btn.style('border', 'none');
    btn.style('background', 'rgba(255, 255, 255, 0.8)');
    btn.style('font-weight', 'bold');
  }

  makeBtn('🛋️ Sofa', () => currentModelType = 'sofa');
  makeBtn('🪑 Kursi', () => currentModelType = 'chair');
  
  makeBtn('🎨 Warna', () => {
    currentColor = color(random(255), random(255), random(255));
    if (furnitureObjects.length > 0) {
      furnitureObjects[furnitureObjects.length - 1].col = currentColor;
    }
  });

  makeBtn('🔄 Putar', () => {
    currentRotation += PI/4;
    if (furnitureObjects.length > 0) {
      furnitureObjects[furnitureObjects.length - 1].rot += PI/4;
    }
  });

  makeBtn('🗑️ Hapus', () => {
    furnitureObjects = [];
    currentRotation = 0; 
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}