// Description: main entry point for the application
const canvas = document.getElementById('renderCanvas')
const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
  disableWebGL2Support: false
})
const lights = {}
const env = {}

const createScene = function () {
  const scene = new BABYLON.Scene(engine)
  scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3)
  scene.enablePhysics()

  const camera = new BABYLON.FreeCamera(
    'camera',
    new BABYLON.Vector3(0, 5, -10),
    scene
  )
  camera.setTarget(BABYLON.Vector3.Zero())
  // camera.setTarget(new BABYLON.Vector3(0, 0, 2.5))

  camera.minZ = 0.01 // // 设置相机到目标的最小深度
  camera.wheelDeltaPercentage = 0.01 // 用于控制滚轮缩放的速度
  camera.upperRadiusLimit = 50 // 摄像机能看到的最远距离
  camera.lowerRadiusLimit = 0.25 // 设置相机到目标的最小半径

  // camera.panningAxis = new BABYLON.Vector3(0, 0, 0) // 定义平移轴
  camera.attachControl(canvas, true)

  // 处理键盘输入
  var inputMap = {}
  scene.actionManager = new BABYLON.ActionManager(scene)
  scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnKeyDownTrigger,
      function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === 'keydown'
      }
    )
  )

  scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnKeyUpTrigger,
      function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === 'keydown'
      }
    )
  )

  // 运行渲染循环
  engine.runRenderLoop(function () {
    // 根据键盘输入更新相机位置
    if (inputMap['w'] || inputMap['ArrowUp']) {
      camera.position.addInPlace(
        camera.getDirection(BABYLON.Axis.Z).scale(0.03)
      )
    }
    if (inputMap['s'] || inputMap['ArrowDown']) {
      camera.position.subtractInPlace(
        camera.getDirection(BABYLON.Axis.Z).scale(0.03)
      )
    }
    if (inputMap['a'] || inputMap['ArrowLeft']) {
      camera.position.subtractInPlace(
        camera.getDirection(BABYLON.Axis.X).scale(0.03)
      )
    }
    if (inputMap['d'] || inputMap['ArrowRight']) {
      camera.position.addInPlace(
        camera.getDirection(BABYLON.Axis.X).scale(0.03)
      )
    }
    // 限制相机的高度
    camera.position.y = 2
    scene.render()
  })

  env.lighting = BABYLON.CubeTexture.CreateFromPrefilteredData(
    'https://assets.babylonjs.com/environments/environmentSpecular.env',
    scene
  )
  env.lighting.name = 'hamburg_hbf'
  env.lighting.gammaSpace = false
  env.lighting.rotationY = BABYLON.Tools.ToRadians(0)
  env.lighting.intensity = 1 // You can experiment with different values between 0 and 1
  scene.environmentTexture = env.lighting

  // scene.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
  //   'https://assets.babylonjs.com/environments/environmentSpecular.env',
  //   scene
  // )
  // scene.createDefaultSkybox(scene.environmentTexture)

  // 球体
  // var sphere = BABYLON.MeshBuilder.CreateSphere(
  //   'sphere',
  //   { diameter: 35 },
  //   scene
  // )
  // sphere.material = new BABYLON.PBRMaterial('sphereMaterial', scene)
  // sphere.material.reflectionTexture = env.lighting
  // sphere.material.microSurface = 1.0 // 设置为1.0以确保完全反射

  // 天空盒
  env.skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 1000.0 }, scene)
  env.skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene)
  env.skyboxMaterial.backFaceCulling = false
  env.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    './assets/hamburg',
    scene
  )
  env.skyboxMaterial.reflectionTexture.coordinatesMode =
    BABYLON.Texture.SKYBOX_MODE
  env.skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
  env.skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
  env.skybox.material = env.skyboxMaterial

  // 灯光

  lights.dirLight = new BABYLON.DirectionalLight(
    'dirLight',
    new BABYLON.Vector3(0.6, -0.7, 0.63),
    scene
  )
  lights.dirLight.position = new BABYLON.Vector3(-0.05, 0.35, -0.05)
  lights.dirLight.shadowMaxZ = 0.45
  lights.dirLight.intensity = 10

  lights.dirLight = new BABYLON.DirectionalLight(
    'dirLight',
    new BABYLON.Vector3(0.6, -0.7, 0.63),
    scene
  )

  return scene
}
const scene = createScene() //Call the createScene function

function generateShadows () {
  shadows.shadowGenerator = new BABYLON.ShadowGenerator(1024, lights.dirLight)
  shadows.shadowGenerator.useBlurExponentialShadowMap = true
  shadows.shadowGenerator.blurBoxOffset = 2
  shadows.shadowGenerator.depthScale = 0

  shadows.shadowGenerator.addShadowCaster(bottle.glass)
  shadows.shadowGenerator.addShadowCaster(bottle.liquid)

  shadows.shadowGenerator.enableSoftTransparentShadow = true
  shadows.shadowGenerator.transparencyShadow = true

  table.mesh.receiveShadows = true
  table.mesh.material.environmentIntensity = 0.2
}

const CreateBox = function (scene) {
  var faceColors = [
    new BABYLON.Color4(1, 0, 0, 1), // 前面：红色
    new BABYLON.Color4(0, 1, 0, 1), // 后面：绿色
    new BABYLON.Color4(0, 0, 1, 1), // 左侧：蓝色
    new BABYLON.Color4(1, 1, 0, 1), // 右侧：黄色
    new BABYLON.Color4(0.5, 0, 0.5, 1), //顶部:紫色
    new BABYLON.Color4(0, 1, 1, 1) // 底部：青色
  ]
  const box = BABYLON.MeshBuilder.CreateBox(
    'box',
    { faceColors: faceColors },
    scene
  )
  box.position.y = 1
  box.position.x = 1
  box.position.z = 1
  return box
}

const createModel = async function () {
  const pirateFortImport = await BABYLON.SceneLoader.ImportMeshAsync(
    '',
    '/assets/',
    'jingchenghuayuan.glb',
    scene
  )
  console.log(pirateFortImport)
  pirateFortImport.meshes[0].name = 'pirateFort'
  const pirateFort = pirateFortImport.meshes[0]

  pirateFort.physicsImpostor = new BABYLON.PhysicsImpostor(
    pirateFort,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, restitution: 0.9 },
    scene
  )

  pirateFort.position.y = 0
  // scene.getMeshByName('sea').material.needDepthPrePass = true
  // scene.getLightByName('Sun').intensity = 12
}
// CreateBox()
createModel()
// generateShadows()
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render()
})
// Watch for browser/canvas resize events
window.addEventListener('resize', function () {
  engine.resize()
})
