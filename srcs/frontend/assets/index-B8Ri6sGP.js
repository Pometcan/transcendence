var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var _nextProcedureId, _Engine_instances, update_fn;
import { T as TextureLoader, O as ObjectLoader, G as GLTFLoader, A as AudioLoader, B as BufferGeometryLoader, M as MathUtils, H as HemisphereLight, S as SpotLight, a as Object3D, P as PointLight, D as DirectionalLight, b as AmbientLight, c as Scene, F as FlyControls, V as Vector3, Q as Quaternion, d as PerspectiveCamera, C as Clock, W as WebGLRenderer, e as CSS3DRenderer } from "./vendor-DcSP8lG2.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const gameConfig = {
  ships: [
    {
      "geometries": [
        {
          "uuid": "b13285b0-d448-422e-a695-752d52ebd4aa",
          "type": "BoxGeometry",
          "width": 1,
          "height": 1,
          "depth": 1,
          "widthSegments": 1,
          "heightSegments": 1,
          "depthSegments": 1
        }
      ],
      "materials": [
        {
          "uuid": "1f047288-5e7f-458d-8114-e34513e27fc1",
          "type": "MeshPhysicalMaterial",
          "color": 16777215,
          "roughness": 1,
          "metalness": 0,
          "emissive": 2,
          "envMapRotation": [
            0,
            0,
            0,
            "XYZ"
          ],
          "envMapIntensity": 1,
          "blendColor": 0
        }
      ],
      "object": {
        "uuid": "5eb31a2b-19c5-4066-b900-3c717f9daad7",
        "type": "Mesh",
        "name": "Box",
        "layers": 1,
        "matrix": [
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1
        ],
        "up": [
          0,
          1,
          0
        ],
        "geometry": "b13285b0-d448-422e-a695-752d52ebd4aa",
        "material": "1f047288-5e7f-458d-8114-e34513e27fc1"
      }
    }
  ],
  scenes: [
    {
      name: "Test Scene",
      lights: [
        {
          type: "PointLight",
          color: "yellow",
          intensity: 1,
          position: [0, -5, 0]
        },
        {
          type: "PointLight",
          color: "yellow",
          intensity: 1,
          position: [0, 7, -5]
        },
        {
          type: "PointLight",
          color: "red",
          intensity: 1,
          position: [4, 7, -10]
        },
        {
          type: "PointLight",
          color: "blue",
          intensity: 1,
          position: [-4, -5, 10]
        }
      ],
      assets: [],
      children: [
        {
          "geometries": [
            {
              "uuid": "b13285b0-d448-422e-a695-752d52ebd4aa",
              "type": "BoxGeometry",
              "width": 1,
              "height": 1,
              "depth": 1,
              "widthSegments": 1,
              "heightSegments": 1,
              "depthSegments": 1
            }
          ],
          "materials": [
            {
              "uuid": "1f047288-5e7f-458d-8114-e34513e27fc1",
              "type": "MeshPhysicalMaterial",
              "color": 16777215,
              "roughness": 1,
              "metalness": 0,
              "emissive": 0,
              "envMapRotation": [
                0,
                0,
                0,
                "XYZ"
              ],
              "envMapIntensity": 1,
              "blendColor": 0
            }
          ],
          "object": {
            "uuid": "5eb31a2b-19c5-4066-b900-3c717f9daad7",
            "type": "Mesh",
            "name": "Box",
            "layers": 1,
            "matrix": [
              1,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              1
            ],
            "up": [
              0,
              1,
              0
            ],
            "geometry": "b13285b0-d448-422e-a695-752d52ebd4aa",
            "material": "1f047288-5e7f-458d-8114-e34513e27fc1"
          }
        },
        {
          "geometries": [
            {
              "uuid": "b13285b0-d448-422e-a695-752d52ebd4aa",
              "type": "BoxGeometry",
              "width": 1,
              "height": 1,
              "depth": 1,
              "widthSegments": 1,
              "heightSegments": 1,
              "depthSegments": 1
            }
          ],
          "materials": [
            {
              "uuid": "1f047288-5e7f-458d-8114-e34513e27fc1",
              "type": "MeshPhysicalMaterial",
              "color": 16777215,
              "roughness": 1,
              "metalness": 0,
              "emissive": 0,
              "envMapRotation": [
                0,
                0,
                0,
                "XYZ"
              ],
              "envMapIntensity": 1,
              "blendColor": 0
            }
          ],
          "object": {
            "uuid": "5eb31a2b-19c5-4066-b900-3c717f9daad7",
            "type": "Mesh",
            "name": "Box",
            "layers": 1,
            "matrix": [
              1,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              1.32774326222044,
              1
            ],
            "up": [0, 1, 0],
            "geometry": "b13285b0-d448-422e-a695-752d52ebd4aa",
            "material": "1f047288-5e7f-458d-8114-e34513e27fc1"
          }
        },
        {
          "geometries": [
            {
              "uuid": "4d24eccc-c9ec-4392-9240-2677239a5ef7",
              "type": "TetrahedronGeometry",
              "radius": 1,
              "detail": 0
            }
          ],
          "materials": [
            {
              "uuid": "38b7591c-0061-4e6b-a099-a9e7a99c2fd8",
              "type": "MeshPhysicalMaterial",
              "color": 16777215,
              "roughness": 1,
              "metalness": 0,
              "emissive": 0,
              "envMapRotation": [
                0,
                0,
                0,
                "XYZ"
              ],
              "envMapIntensity": 1,
              "blendColor": 0
            }
          ],
          "object": {
            "uuid": "d8a0f553-d8b7-4f67-8f18-5933948fe59e",
            "type": "Mesh",
            "name": "Tetrahedron",
            "layers": 1,
            "matrix": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1.4074349995822328, 0, 0, 1],
            "up": [0, 1, 0],
            "geometry": "4d24eccc-c9ec-4392-9240-2677239a5ef7",
            "material": "38b7591c-0061-4e6b-a099-a9e7a99c2fd8"
          }
        }
      ]
    }
  ]
};
const SystemConfig = {
  SynchronizationSystem: {
    order: 0,
    interval: 1e3 / 120
  },
  MovementSystem: {
    order: 1,
    interval: 1e3 / 120,
    components: ["PositionComponent", "VelocityComponent"]
  },
  InputSystem: {
    order: 2,
    interval: 1e3 / 120
  },
  UISystem: {
    order: 3,
    interval: 1e3 / 60
  },
  RenderingSystem: {
    order: 10,
    interval: 1e3 / 200
  }
};
class AssetManager {
  /**
   * @property {Map<string, Map<string, any>>} cache
   * @property {{texture: TextureLoader, object: ObjectLoader, model: GLTFLoader, audio: AudioLoader}} loaders
   */
  constructor() {
    this.cache = /* @__PURE__ */ new Map();
    this.loaders = {
      texture: new TextureLoader(),
      object: new ObjectLoader(),
      model: new GLTFLoader(),
      audio: new AudioLoader(),
      geometry: new BufferGeometryLoader()
    };
    for (const type in this.loaders) {
      this.cache.set(type, /* @__PURE__ */ new Map());
    }
  }
  /**
   * 
   * @param {string} key id of the asset to load
   * @param {"texture" | "object" | "model" | "audio"} type
   * @param {string} url location of the asset
   * @returns 
   */
  async load(key, type, url) {
    const typeCache = this.getTypeCache(type);
    if (typeCache.has(key)) return;
    const loader = this.getLoader(type);
    return new Promise(
      (resolve, reject) => loader.load(
        url,
        resolve(typeCache.set(key, data).get(key))(data),
        this.logProgress(e, type, key)(e),
        reject
      )
    );
  }
  async parse(data2) {
    const typeCache = this.getTypeCache("object");
    if (data2.uuid && typeCache.has(data2.uuid)) return typeCache.get(data2.uuid);
    else if (data2.uuid === void 0) data2.uuid = MathUtils.generateUUID();
    return new Promise(
      (resolve, reject) => {
        this.loaders.object.parse(data2, (object) => {
          typeCache.set(object.uuid, object).get(object.uuid);
          resolve(object);
        });
      }
    );
  }
  get(key, type) {
    const typeCache = this.cache.get(type);
    return typeCache ? typeCache.get(key) : void 0;
  }
  getOrThrow(key, type) {
    const asset = this.get(key, type);
    if (!asset) {
      throw new Error(`Asset "${key}" of type "${type}" is not loaded`);
    }
    return asset;
  }
  /**
   * 
   * @param {string} type of asset
   * @returns {Map<string, any>} cache of assets
   */
  getTypeCache(type) {
    const typeCache = this.cache.get(type);
    if (!typeCache) {
      throw new Error(`Unsupported asset type: ${type}`);
    }
    return typeCache;
  }
  /**
   * 
   * @param {string} type 
   * @returns {TextureLoader | ObjectLoader | GLTFLoader | AudioLoader}
   */
  getLoader(type) {
    const loader = this.loaders[type];
    if (!loader) {
      throw new Error(`Unsupported asset type: ${type}`);
    }
    return loader;
  }
  createLight(config) {
    let light;
    switch (config.type) {
      case "AmbientLight":
        light = new AmbientLight(config.color || 16777215, config.intensity || 1);
        break;
      case "DirectionalLight":
        light = new DirectionalLight(config.color || 16777215, config.intensity || 1);
        if (config.position) light.position.set(...config.position);
        break;
      case "PointLight":
        light = new PointLight(config.color || 16777215, config.intensity || 1, config.distance || 0, config.decay || 1);
        if (config.position) light.position.set(...config.position);
        break;
      case "SpotLight":
        light = new SpotLight(config.color || 16777215, config.intensity || 1, config.distance || 0, config.angle || Math.PI / 3, config.penumbra || 0, config.decay || 1);
        if (config.position) light.position.set(...config.position);
        if (config.target) {
          const target = new Object3D();
          target.position.set(...config.target);
          light.target = target;
        }
        break;
      case "HemisphereLight":
        light = new HemisphereLight(config.skyColor || 16777215, config.groundColor || 0, config.intensity || 1);
        break;
      default:
        console.warn(`Unknown light type: ${config.type}`);
        return null;
    }
    return light;
  }
  logProgress(e2, type, key) {
    console.log(`Loading ${type} ${key}: ${e2.loaded / e2.total * 100}%`);
  }
}
class ComponentManager {
  constructor(componentType) {
    this.components = /* @__PURE__ */ new Map();
    this.componentType = componentType;
  }
  addComponent(entityId, component) {
    if (this.componentType !== component.type) {
      throw new Error(`Component type mismatch. Expected ${this.componentType}, got ${component.type}`);
    }
    this.components.set(entityId, component);
  }
  getComponent(entityId) {
    return this.components.get(entityId);
  }
  removeComponent(entityId) {
    this.components.delete(entityId);
  }
  get entries() {
    return this.components.entries();
  }
  get size() {
    return this.components.size;
  }
  clear() {
    this.components.clear();
  }
  forEach(callback) {
    this.components.forEach(callback);
  }
}
class Entity {
  constructor(id) {
    this.id = id;
    this.components = /* @__PURE__ */ new Map();
  }
}
class EntityManager {
  constructor() {
    this.nextId = 0;
    this.entities = /* @__PURE__ */ new Map();
  }
  createEntity() {
    const entity = new Entity(this.nextId++);
    this.entities.set(entity.id, entity);
    return entity;
  }
  removeEntity(entity) {
    this.entities.delete(entity.id);
  }
  getEntity(id) {
    return this.entities.get(id);
  }
}
class WrapperScene extends Scene {
  constructor() {
    super();
  }
}
class EnvironmentManager {
  /**
   * 
   * @param {Engine} engine
   * @param {AssetManager} assetManager 
   * 
   * @property {Map<string, WrapperScene>} scenes
   * @property {WrapperScene} activeScene
   */
  constructor(engine) {
    this.scenes = /* @__PURE__ */ new Map();
    this.engine = engine;
    this.activeScene = null;
    this.assetManager = this.engine.getManager(AssetManager);
  }
  loadScenes(scenes) {
    scenes.forEach((sceneConfig) => {
      const scene = this.createSceneFromConfig(sceneConfig);
      this.addScene(scene);
    });
  }
  createSceneFromConfig(config) {
    const scene = new WrapperScene();
    if (config.lights) {
      config.lights.forEach((lightConfig) => {
        const light = this.assetManager.createLight(lightConfig);
        scene.add(light);
      });
    } else {
      const defaultLight = new AmbientLight(16777215, 1);
      scene.add(defaultLight);
    }
    if (config.assets) {
      config.assets.forEach((assetConfig) => {
        const asset = this.assetManager.get(assetConfig.key, assetConfig.type);
        if (asset) {
          scene.add(asset);
        } else {
          this.assetManager.load(assetConfig.key, assetConfig.type, assetConfig.url);
        }
      });
    }
    if (config.children) {
      config.children.forEach((childConfig) => {
        this.assetManager.parse(childConfig).then((child) => scene.add(child));
      });
    }
    scene.name = config.name;
    return scene;
  }
  addScene(scene) {
    this.scenes.set(scene.name, scene);
  }
  removeScene(name) {
    this.scenes.delete(name);
  }
  getScene(name) {
    return this.scenes.get(name);
  }
  setActiveScene(name) {
    if (this.activeScene) {
      this.cleanupScene(this.activeScene);
    }
    this.activeScene = this.scenes.get(name);
    if (!this.activeScene) {
      throw new Error(`Scene "${name}" does not exist.`);
    }
    this.setupScene(this.activeScene);
  }
  setupScene(scene) {
    this.engine.three.Scene = scene;
    scene.add(this.engine.three.CameraPivot);
  }
  cleanupScene(scene) {
    scene.children.forEach((child) => scene.remove(child));
  }
}
class InputManager {
  constructor() {
    this.inputs = [];
  }
  getInputs() {
    const result = [...this.inputs];
    this.inputs = [];
    return result;
  }
  addInput(input) {
    this.inputs.push({ timestamp: performance.now(), input });
  }
  flush() {
    this.inputs = [];
  }
}
class MenuManager {
  constructor(camera) {
    this.menus = /* @__PURE__ */ new Map();
    this.previousMenu = null;
    this.activeMenu = null;
    this.camera = camera;
  }
  addMenu(menu) {
    this.menus.set(menu.id, menu);
  }
  getActiveMenu() {
    return this.menus.get(this.activeMenu);
  }
  setActiveMenu(menuId) {
    this.activeMenu = menuId;
    this.menus.forEach((menu, id) => {
      if (id === menuId) {
        menu.active = true;
        this.camera.add(menu.object);
        menu.object.position.set(0, 0, -500);
      } else {
        menu.active = false;
        this.camera.remove(menu.object);
      }
    });
  }
  previous() {
    if (this.previousMenu) {
      this.switchMenu(this.previousMenu);
    }
  }
  switchMenu(menuId) {
    if (this.activeMenu) {
      const currentMenu = this.menus.get(this.activeMenu);
      if (currentMenu.transitionOut) {
        currentMenu.transitionOut();
      }
      currentMenu.active = false;
      this.camera.remove(currentMenu.object);
      this.previousMenu = this.activeMenu;
    }
    const newMenu = this.menus.get(menuId);
    if (newMenu) {
      this.activeMenu = menuId;
      newMenu.active = true;
      if (newMenu.transitionIn) {
        newMenu.transitionIn();
      }
      this.camera.add(newMenu.object);
    }
  }
  removeMenu(menuId) {
    const menu = this.menus.get(menuId);
    if (menu) {
      this.menus.delete(menuId);
      this.camera.remove(menu.object);
    }
  }
  clearMenus() {
    this.menus.forEach((menu) => {
      this.camera.remove(menu.object);
    });
    this.menus.clear();
  }
}
class ProcedureManager {
  /**
   * @param {Engine} engine
   * @param {Map<number, {procedure: Procedure, collectedRequirements: any}>} procedures
   */
  constructor(engine, procedures = /* @__PURE__ */ new Map()) {
    __privateAdd(this, _nextProcedureId, 0);
    __publicField(this, "procedures");
    this.engine = engine;
    this.procedures = procedures;
  }
  /**
   * @param {Procedure} procedure to add
   * @param {boolean} startOnAdd should the procedure start immediately
   */
  addProcedure(procedure, startOnAdd = false) {
    const { requirements, start, update } = procedure;
    let collectedRequirements;
    try {
      console.log(`Collecting requirements for procedure: ${procedure.name}`);
      collectedRequirements = this.collectRequirements(requirements);
    } catch (error) {
      procedure.state = "error";
      console.error(`Error collecting requirements for procedure: ${procedure.name}`);
      console.error(error);
      return null;
    }
    try {
      procedure.id = __privateWrapper(this, _nextProcedureId)._++;
    } catch (error) {
      procedure.state = "error";
      console.error(`Error setting id for procedure: ${procedure.name}`);
      console.error(error);
      return null;
    }
    console.log(`Adding procedure: ${procedure.name}`);
    this.procedures.set(procedure.id, { procedure, collectedRequirements });
    if (startOnAdd) {
      try {
        console.log(`Starting procedure: ${procedure.name}`);
        start(collectedRequirements);
      } catch (error) {
        procedure.state = "error";
        console.error(`Error starting procedure: ${procedure.name}`);
        console.error(error);
      }
    }
    if (update) {
      this.engine.updateTasks.set("Procedure_" + procedure.name, () => {
        try {
          console.log(`Updating procedure: ${procedure.name}`);
          update(collectedRequirements);
        } catch (error) {
          procedure.state = "error";
          console.error(`Error updating procedure: ${procedure.name}`);
          console.error(error);
        }
      });
    }
  }
  startProcedure(procedureId) {
    const entry = this.procedures.get(procedureId);
    if (entry) {
      console.log(`Starting procedure: ${procedureId} with name ${entry.procedure.name}`);
      try {
        entry.procedure.start(entry.collectedRequirements);
      } catch (error) {
        entry.procedure.state = "error";
        console.error(`Error starting procedure: ${procedureId} with name ${entry.procedure.name}`);
        console.error(error);
      }
    }
  }
  endProcedure(procedureId) {
    const entry = this.procedures.get(procedureId);
    if (entry) {
      console.log(`Ending procedure: ${procedureId} with name ${entry.procedure.name}`);
      try {
        entry.procedure.end(entry.collectedRequirements);
      } catch (error) {
        entry.procedure.state = "error";
        console.error(`Error ending procedure: ${procedureId} with name ${entry.procedure.name}`);
        console.error(error);
      }
      this.procedures.delete(entry);
    }
  }
  collectRequirements(requirements) {
    if (!requirements) return {};
    return {
      managers: this.getRequiredItems(this.engine.managers, requirements.managers),
      three: this.getRequiredItems(this.engine.three, requirements.three),
      systems: this.getRequiredItems(this.engine.systems, requirements.systems),
      engine: this.getRequiredItems(this.engine, requirements.engine)
    };
  }
  getRequiredItems(collection, keys) {
    if (!keys) return {};
    return keys.reduce((acc, key) => {
      if (collection[key]) {
        acc[key] = collection[key];
        if (acc[key] instanceof Function) {
          acc[key] = acc[key].bind(collection);
        }
      }
      return acc;
    }, {});
  }
}
_nextProcedureId = new WeakMap();
const EventSystem = {
  listeners: {},
  on(event, listener) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(listener);
  },
  emit(event, data2) {
    (this.listeners[event] || []).forEach((listener) => listener(data2));
  }
};
const Events = {
  SERVER_UPDATE: 1,
  GAME_START: 2,
  LOGIN: 3,
  LOGOUT: 4
};
class WebSocketManager {
  /**
   * 
   * @param {object} props 
   * @param {string} props.url
   * @param {EventSystem} props.eventSystem
   * 
   */
  constructor(props) {
    const { url, eventSystem } = props;
    this.url = url;
    this.eventSystem = eventSystem;
    this.websocket = new WebSocket(url);
    this.websocket.onopen = () => console.log("Connected to server via WSS");
    this.websocket.onmessage = this.onMessage;
    this.websocket.onerror = (event) => console.error("WebSocket error:", event);
    this.websocket.onclose = () => console.log("Disconnected from server");
  }
  onMessage(event) {
    try {
      const data2 = JSON.parse(event.data);
      EventSystem.emit(Events.SERVER_UPDATE, data2);
      this.messageHandlers[data2.type](data2);
    } catch (err) {
      console.error("Error parsing server message:", err);
    }
  }
  send(data2) {
    if (this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(data2));
    } else {
      console.warn("WebSocket is not open. Unable to send data.");
    }
  }
  reconnect() {
    console.log("Attempting to reconnect...");
    this.websocket = new WebSocket(this.url);
    this.websocket.onopen = () => console.log("Reconnected to server via WSS");
    this.websocket.onmessage = (event) => this.onMessage(event);
    this.websocket.onerror = (event) => console.error("WebSocket error:", event);
    this.websocket.onclose = () => setTimeout(() => this.reconnect(), 500);
  }
}
const ManagersMixin = {
  initManagers() {
    this.managers = {};
  },
  addManager(manager) {
    const key = manager.componentType || manager.constructor.name;
    this.managers[key] = manager;
  },
  removeManager(manager) {
    delete this.managers[manager.constructor.name];
  },
  getManager(name) {
    return this.managers[name instanceof Function ? name.name : name];
  },
  setupManagers() {
    this.addManager(new EntityManager());
    this.addManager(new MenuManager(this.three.Camera));
    this.addManager(new ProcedureManager(this));
    this.addManager(new InputManager());
    this.addManager(new AssetManager());
    this.addManager(new EnvironmentManager(this));
    this.addManager(new WebSocketManager("/asd"));
    this.addManager(new ComponentManager("AssetComponent"));
    this.addManager(new ComponentManager("PositionComponent"));
    this.addManager(new ComponentManager("VelocityComponent"));
  }
};
class System {
  /**
   * 
   * @param {{order: number, interval: number}} config
   * 
   * @property {"passive" | "active" | "crashed"} state
   * 
   */
  constructor(config) {
    this.order = config.order;
    this.interval = config.interval;
    this.lastUpdate = 0;
    this.state = "passive";
  }
  set update(fn) {
    this._update = fn;
  }
  get update() {
    return this.performUpdate.bind(this);
  }
  activate() {
    this.state = "active";
  }
  performUpdate() {
    if (this.state != "active") return;
    const now = performance.now();
    if (now - this.lastUpdate >= this.interval) {
      this._update(this.interval);
      this.lastUpdate = now;
    }
  }
}
class InputSystem extends System {
  /**
   * 
   * @param {object} config 
   * @param {Engine} engine
   * 
   */
  constructor(config, engine) {
    super(config);
    this.state = "passive";
    this.engine = engine;
    this.inputManager = this.engine.getManager(InputManager);
    this.websocketManager = this.engine.getManager(WebSocketManager);
    this.update = () => {
      this.inputManager.getInputs();
    };
  }
  activate() {
    this.inputManager.flush();
  }
}
class MovementSystem extends System {
  constructor(config, positions, velocities) {
    super(config);
    this.positions = positions;
    this.velocities = velocities;
    this.update = (deltaTime) => {
      for (const [entityId, position] of this.positions.entries) {
        const velocity = this.velocities.getComponent(entityId);
        if (velocity) {
          position.x += velocity.vx * deltaTime;
          position.y += velocity.vy * deltaTime;
        }
      }
    };
  }
}
class RenderingSystem extends System {
  /**
   * 
   * @param {Engine} engine 
   */
  constructor(config, engine) {
    super(config);
    this.engine = engine;
    this.update = () => {
      const camera = this.engine.getThree("Camera");
      const scene = this.engine.getThree("Scene");
      this.engine.getThree("CustomFlyControls").update(this.engine.getThree("Clock").getDelta());
      this.engine.getThree("WebGLRenderer").render(scene, camera);
      this.engine.getThree("CSS3DRenderer").render(scene, camera);
    };
  }
}
class SynchronizationSystem extends System {
  /**
   * 
   * @param {Engine} engine
   */
  constructor(config, engine) {
    super(config);
    this.engine = engine;
    this.positionManager = engine.getManager("PositionComponent");
    this.velocityManager = engine.getManager("VelocityComponent");
    EventSystem.on(Events.SERVER_UPDATE, this.update.bind(this));
  }
  update(serverState) {
    if (!serverState) {
      return;
    }
    for (const entity of Object.keys(serverState)) {
      const state = serverState[entity];
      const position = this.positionManager.getComponent(parseInt(entity));
      const velocity = this.velocityManager.getComponent(parseInt(entity));
      if (position) {
        position.x = state.position.x;
        position.y = state.position.y;
        position.z = state.position.z;
      }
      if (velocity) {
        velocity.vx = state.velocity.vx;
        velocity.vy = state.velocity.vy;
        velocity.vz = state.velocity.vz;
      }
    }
  }
}
class UISystem extends System {
  constructor(config, menuManager) {
    super(config);
    this.menuManager = menuManager;
    this.update = () => {
      const activeMenu = this.menuManager.getActiveMenu();
      if (activeMenu) {
        activeMenu.render();
      }
    };
  }
}
const SystemsMixin = {
  initSystems() {
    this.systems = {};
  },
  activateAllSystems() {
    Object.values(this.systems).forEach((system) => system.activate());
  },
  addSystem(system) {
    this.systems[system.constructor.name] = system;
  },
  removeSystem(system) {
    delete this.systems[system.constructor.name];
  },
  getSystem(name) {
    return this.systems[name instanceof Function ? name.name : name];
  },
  setupSystems(configs) {
    this.addSystem(new UISystem(configs[UISystem.name], this.getManager(MenuManager)));
    this.addSystem(new MovementSystem(configs[MovementSystem.name], this.getManager("AssetComponent"), this.getManager("VelocityComponent")));
    this.addSystem(new RenderingSystem(configs[RenderingSystem.name], this));
    this.addSystem(new SynchronizationSystem(configs[SynchronizationSystem.name], this));
    this.addSystem(new InputSystem(configs[InputSystem.name], this));
  }
};
const _EPS = 1e-5;
const _tmpQuaternion = new Quaternion();
class CustomFlyControls extends FlyControls {
  constructor(object, domElement = null) {
    super(object, domElement);
    this.movementSpeed = 1;
    this.rollSpeed = Math.PI / 6;
    this.dragToLook = false;
    this.autoForward = false;
    this._forwardVelocity = 0;
    this._forwardAcceleration = 2;
    this._forwardDeceleration = 0.6;
    this._maxForwardSpeed = 10;
    this._backwardAcceleration = 1;
    this._backwardDeceleration = 0.8;
    this._maxBackwardSpeed = 5;
    this._rightVelocity = 0;
    this._rightAcceleration = 1.1;
    this._rightDeceleration = 0.8;
    this._maxRightSpeed = 3;
    this._pitchVelocity = 0;
    this._yawVelocity = 0;
    this._rollVelocity = 0;
    this._pitchAcceleration = 0.4;
    this._pitchDeceleration = 0.5;
    this._maxPitchSpeed = 1.5;
    this._yawAcceleration = 0.6;
    this._yawDeceleration = 0.4;
    this._maxYawSpeed = 2;
    this._rollAcceleration = 0.4;
    this._rollDeceleration = 0.4;
    this._maxRollSpeed = 4;
    this._moveState = {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
      forward: 0,
      back: 0,
      pitchUp: 0,
      pitchDown: 0,
      yawLeft: 0,
      yawRight: 0,
      rollLeft: 0,
      rollRight: 0
    };
    this._moveVector = new Vector3(0, 0, 0);
    this._rotationVector = new Vector3(0, 0, 0);
    this._lastQuaternion = new Quaternion();
    this._lastPosition = new Vector3();
    this._status = 0;
    if (domElement !== null) {
      this.connect();
    }
  }
  control(object) {
    this.object = object;
  }
  getCurrentSpeed() {
    return {
      forwardSpeed: Math.abs(this._forwardVelocity),
      rightSpeed: Math.abs(this._rightVelocity),
      pitchSpeed: Math.abs(this._pitchVelocity),
      yawSpeed: Math.abs(this._yawVelocity),
      rollSpeed: Math.abs(this._rollVelocity)
    };
  }
  update(delta) {
    if (this.enabled === false) return;
    const object = this.object;
    const moveMult = delta * this.movementSpeed;
    const rotMult = delta * this.rollSpeed;
    if (this._moveState.forward === 1) {
      this._forwardVelocity -= this._forwardAcceleration * delta;
      if (this._forwardVelocity < -this._maxForwardSpeed) {
        this._forwardVelocity = -this._maxForwardSpeed;
      }
    } else if (this._moveState.back === 1) {
      this._forwardVelocity += this._backwardAcceleration * delta;
      if (this._forwardVelocity > this._maxBackwardSpeed) {
        this._forwardVelocity = this._maxBackwardSpeed;
      }
    } else {
      if (this._forwardVelocity < 0) {
        this._forwardVelocity = Math.min(
          0,
          this._forwardVelocity + this._backwardDeceleration * delta
        );
      } else if (this._forwardVelocity > 0) {
        this._forwardVelocity = Math.max(
          0,
          this._forwardVelocity - this._forwardDeceleration * delta
        );
      }
    }
    if (this._moveState.left === 1) {
      this._rightVelocity -= this._rightAcceleration * delta;
      if (this._rightVelocity < -this._maxRightSpeed) {
        this._rightVelocity = -this._maxRightSpeed;
      }
    } else if (this._moveState.right === 1) {
      this._rightVelocity += this._rightAcceleration * delta;
      if (this._rightVelocity > this._maxRightSpeed) {
        this._rightVelocity = this._maxRightSpeed;
      }
    } else {
      if (this._rightVelocity < 0) {
        this._rightVelocity = Math.min(
          0,
          this._rightVelocity + this._rightDeceleration * delta
        );
      } else if (this._rightVelocity > 0) {
        this._rightVelocity = Math.max(
          0,
          this._rightVelocity - this._rightDeceleration * delta
        );
      }
    }
    if (this._moveState.pitchUp === 1) {
      this._pitchVelocity -= this._pitchAcceleration * delta;
      if (this._pitchVelocity < -this._maxPitchSpeed) {
        this._pitchVelocity = -this._maxPitchSpeed;
      }
    } else if (this._moveState.pitchDown === 1) {
      this._pitchVelocity += this._pitchAcceleration * delta;
      if (this._pitchVelocity > this._maxPitchSpeed) {
        this._pitchVelocity = this._maxPitchSpeed;
      }
    } else {
      if (this._pitchVelocity < 0) {
        this._pitchVelocity = Math.min(
          0,
          this._pitchVelocity + this._pitchDeceleration * delta
        );
      } else if (this._pitchVelocity > 0) {
        this._pitchVelocity = Math.max(
          0,
          this._pitchVelocity - this._pitchDeceleration * delta
        );
      }
    }
    if (this._moveState.yawLeft === 1) {
      this._yawVelocity += this._yawAcceleration * delta;
      if (this._yawVelocity > this._maxYawSpeed) {
        this._yawVelocity = this._maxYawSpeed;
      }
    } else if (this._moveState.yawRight === 1) {
      this._yawVelocity -= this._yawAcceleration * delta;
      if (this._yawVelocity < -this._maxYawSpeed) {
        this._yawVelocity = -this._maxYawSpeed;
      }
    } else {
      if (this._yawVelocity < 0) {
        this._yawVelocity = Math.min(
          0,
          this._yawVelocity + this._yawDeceleration * delta
        );
      } else if (this._yawVelocity > 0) {
        this._yawVelocity = Math.max(
          0,
          this._yawVelocity - this._yawDeceleration * delta
        );
      }
    }
    if (this._moveState.rollLeft === 1) {
      this._rollVelocity -= this._rollAcceleration * delta;
      if (this._rollVelocity < -this._maxRollSpeed) {
        this._rollVelocity = -this._maxRollSpeed;
      }
    } else if (this._moveState.rollRight === 1) {
      this._rollVelocity += this._rollAcceleration * delta;
      if (this._rollVelocity > this._maxRollSpeed) {
        this._rollVelocity = this._maxRollSpeed;
      }
    } else {
      if (this._rollVelocity < 0) {
        this._rollVelocity = Math.min(
          0,
          this._rollVelocity + this._rollDeceleration * delta
        );
      } else if (this._rollVelocity > 0) {
        this._rollVelocity = Math.max(
          0,
          this._rollVelocity - this._rollDeceleration * delta
        );
      }
    }
    const tempX = this._moveVector.x;
    const tempZ = this._moveVector.z;
    this._moveVector.x = 0;
    this._moveVector.z = 0;
    object.translateX(0);
    object.translateY(this._moveVector.y * moveMult);
    object.translateZ(0);
    object.translateX(this._rightVelocity * delta);
    object.translateZ(this._forwardVelocity * delta);
    this._moveVector.x = tempX;
    this._moveVector.z = tempZ;
    this._rotationVector.x = this._pitchVelocity;
    this._rotationVector.y = this._yawVelocity;
    this._rotationVector.z = this._rollVelocity;
    _tmpQuaternion.set(
      this._rotationVector.x * rotMult,
      this._rotationVector.y * rotMult,
      this._rotationVector.z * rotMult,
      1
    ).normalize();
    object.quaternion.multiply(_tmpQuaternion);
    if (this._lastPosition.distanceToSquared(object.position) > _EPS || 8 * (1 - this._lastQuaternion.dot(object.quaternion)) > _EPS) {
      this.dispatchEvent({ type: "change" });
      this._lastQuaternion.copy(object.quaternion);
      this._lastPosition.copy(object.position);
    }
  }
}
class WrapperCamera extends PerspectiveCamera {
  constructor(fov = 75, aspect = window.innerWidth / window.innerHeight, near = 0.1, far = 2e3) {
    super(fov, aspect, near, far);
    this.position.set(0, 0, 5);
    this.lookAt(0, 0, 0);
  }
}
const ThreeMixin = {
  initThree() {
    this.three = {
      Clock: new Clock(true),
      WebGLRenderer: null,
      CSS3DRenderer: null,
      Scene: null,
      Camera: null,
      CustomFlyControls: null,
      CameraPivot: null
    };
  },
  /**
   * 
   * @param {"Clock" | "WebGLRenderer" | "CSS3DRenderer" | "Scene" | "Camera" | "CustomFlyControls"} key 
   * 
   * @return {Clock | WebGLRenderer | CSS3DRenderer | WrapperScene | WrapperCamera | CustomFlyControls}
   */
  getThree(key) {
    return this.three[key];
  },
  setupThree() {
    this.setupRenderer();
    this.setupScene();
    this.setupCamera(this.three.Scene);
    this.setupControls(this.three.Camera, this.three.WebGLRenderer.domElement);
    window.addEventListener("resize", this.updateSizes.bind(this));
    window.addEventListener("DOMContentLoaded", this.updateSizes.bind(this), { once: true });
  },
  updateSizes() {
    const { width, height } = this.element.getBoundingClientRect();
    const { WebGLRenderer: WebGLRenderer2, CSS3DRenderer: CSS3DRenderer2, Camera } = this.three;
    Camera.aspect = width / height;
    Camera.updateProjectionMatrix();
    WebGLRenderer2.setSize(width, height);
    CSS3DRenderer2.setSize(width, height);
    WebGLRenderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  },
  setupRenderer() {
    const webglRenderer = new WebGLRenderer({ powerPreference: "high-performance" });
    const cssRenderer = new CSS3DRenderer();
    this.three.WebGLRenderer = webglRenderer;
    this.three.CSS3DRenderer = cssRenderer;
    cssRenderer.domElement.style.position = "absolute";
    cssRenderer.domElement.style.zIndex = 1;
    cssRenderer.domElement.style.pointerEvents = "none";
    webglRenderer.setClearColor(0);
    this.element.appendChild(webglRenderer.domElement);
    this.element.appendChild(cssRenderer.domElement);
  },
  setupCamera(scene) {
    const camera = new WrapperCamera();
    const cameraPivot = new Object3D();
    this.three.Camera = camera;
    this.three.CameraPivot = cameraPivot;
    cameraPivot.add(camera);
    camera.position.set(0, 2, 4);
    camera.lookAt(0, 0, 0);
    scene.add(cameraPivot);
  },
  setupControls(camera, domElement) {
    const cameraControls = new CustomFlyControls(camera, domElement);
    this.three.CustomFlyControls = cameraControls;
    cameraControls.enabled = true;
    cameraControls.domElement = domElement;
  },
  setupScene() {
    const scene = new WrapperScene();
    this.three.Scene = scene;
    const ambientLight = new AmbientLight(16777215, 1);
    scene.add(ambientLight);
  },
  /**
   * @method setInteractionCanvas
   * 
   * @param {"webgl" | "css3d"} renderer
   */
  setInteractionCanvas(renderer) {
    const { CSS3DRenderer: CSS3DRenderer2, WebGLRenderer: WebGLRenderer2 } = this.three;
    const element = CSS3DRenderer2.domElement;
    const transformerElement = element.children[0];
    const webglState = renderer == "webgl" ? "all" : "none";
    const css3dState = renderer == "css3d" ? "all" : "none";
    WebGLRenderer2.domElement.style.pointerEvents = webglState;
    element.style.pointerEvents = css3dState;
    transformerElement.style.pointerEvents = css3dState;
  }
};
class Engine {
  /**
   * 
   * @param {object} engineConfig - The configuration for the engine.
   * @param {string} engineConfig.socket - WebSocket connection string.
   * @param {object} engineConfig.systems - The HTML element to render the engine.
   * @param {HTMLElement} engineConfig.element - The HTML element to render the engine.
   * 
   * @property {HTMLElement} element
   * @property {Map<string, Function>} updateTasks
   * 
   */
  constructor(engineConfig) {
    __privateAdd(this, _Engine_instances);
    this.config = engineConfig;
    this.element = engineConfig.element;
    this.updateTasks = /* @__PURE__ */ new Map();
    this.initThree();
    this.initManagers();
    this.initSystems();
    window.engine = this;
  }
  march() {
    const animate = () => {
      requestAnimationFrame(animate);
      __privateMethod(this, _Engine_instances, update_fn).call(this);
    };
    this.activateAllSystems();
    animate();
  }
  setup() {
    this.setupThree();
    this.setupManagers();
    this.setupSystems(this.config.systems);
  }
  loadConfig(config) {
    if (!config) {
      throw Error(`Engine: The config is ${config}. You joking?`);
    }
    const envmgr = this.getManager(EnvironmentManager);
    envmgr.loadScenes(config.scenes);
    const assetmgr = this.getManager(AssetManager);
    assetmgr.parse(config.ships[0]).then((ship) => {
      const scene = this.getThree("Scene");
      const cameraPivot = this.getThree("CameraPivot");
      scene.add(ship);
      this._ship = ship;
      this.getThree("CustomFlyControls").control(this._ship);
      this.updateTasks.set("lerpCamera", () => {
        const interpFactor = 0.1;
        cameraPivot.position.lerp(this._ship.position, interpFactor);
        const desiredQuat = this._ship.quaternion.clone();
        cameraPivot.quaternion.slerp(desiredQuat, interpFactor);
      });
    });
  }
}
_Engine_instances = new WeakSet();
/**
 * Updates active systems in order of priority.
 * @private
 */
update_fn = function() {
  Object.values(this.systems).filter((s) => s.state === "active").sort((a, b) => a.order - b.order).forEach((system) => system.update());
  this.updateTasks.forEach((task) => task());
};
Object.assign(Engine.prototype, ThreeMixin, ManagersMixin, SystemsMixin);
class Game {
  /**
   * @param {HtmlElement} element
   * 
  * @property {HTMLElement} element
  * @property {Engine} engine
  * @property {ProcedureManager} procedureManager
  */
  constructor(element) {
    this.engine = new Engine({ element, systems: SystemConfig });
    document.addEventListener("DOMContentLoaded", this.start.bind(this));
  }
  start() {
    this.engine.setup();
    this.engine.march();
    this.engine.loadConfig(gameConfig);
    this.engine.getManager(EnvironmentManager).setActiveScene("Test Scene");
    this.procedureManager = this.engine.getManager(ProcedureManager);
  }
}
class App extends HTMLElement {
  constructor() {
    super();
    this._game = new Game(this);
  }
}
customElements.define("ft-transcendence", App);
