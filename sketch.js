let furnitureObjects = []; 
let modelSofa, modelChair;
let currentModelType = 'sofa'; 

let currentColor;
let currentRotation = 0;
let currentScale = 1; 

let humSound;

function preload() {
  modelSofa = loadModel('loungeDesignSofaCorner.obj', true);
  modelChair = loadModel('chair.obj', true);
  
  humSound = loadSound('engine.mp3');
}

function setup() {
  createARCanvas(windowWidth, windowHeight); 
  currentColor = color(255, 255, 255); 
  setupUI();

}

function draw() {
  ambientLight(150);
  directionalLight(255, 255, 255, 0.5, 1, -0.5);

  for (let i = 0; i < furnitureObjects.length; i++) {
    let item = furnitureObjects[i];
    push();
    translate(item.x, item.y, item.z);
    let floatAnim = sin(frameCount * 0.05) * 5;
    translate(0, floatAnim, 0);
    rotateX(PI);
    rotateY(item.rot);
    scale(item.scl * 2); 
    noStroke();
    fill(item.col); 
    specularMaterial(250); 
    
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
  if (humSound && typeof humSound.play === 'function') {
    humSound.play();
  }
  
  if (mouseY > height - 100) return;


  let x = mouseX - width / 2;
  let y = mouseY - height / 2;

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
        e.stopPropagation(); 
        callback();
    });
    btn.style('padding', '12px');
    btn.style('border-radius', '10px');
    btn.style('border', 'none');
    btn.style('background', 'rgba(255, 255, 255, 0.8)');
    btn.style('font-weight', 'bold');
  }

  makeBtn('Sofa', () => currentModelType = 'sofa');
  makeBtn('Kursi', () => currentModelType = 'chair');
  
  makeBtn('Warna', () => {
    currentColor = color(random(255), random(255), random(255));
    if (furnitureObjects.length > 0) {
      furnitureObjects[furnitureObjects.length - 1].col = currentColor;
    }
  });

  makeBtn('Putar', () => {
    currentRotation += PI/4;
    if (furnitureObjects.length > 0) {
      furnitureObjects[furnitureObjects.length - 1].rot += PI/4;
    }
  });

  makeBtn('Hapus', () => {
    furnitureObjects = [];
    currentRotation = 0; 
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}