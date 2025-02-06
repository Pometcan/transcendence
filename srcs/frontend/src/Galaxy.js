import * as THREE from "https://cdn.skypack.dev/three@0.136.0";

const shaderUtils = `
float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec3 scatter (vec3 seed) {
  float u = random(seed.xy);
  float v = random(seed.yz);
  float theta = u * 6.28318530718;
  float phi = acos(2.0 * v - 1.0);

  float sinTheta = sin(theta);
  float cosTheta = cos(theta);
  float sinPhi = sin(phi);
  float cosPhi = cos(phi);

  float x = sinPhi * cosTheta;
  float y = sinPhi * sinTheta;
  float z = cosPhi;

  return vec3(x, y, z);
}
`;

class BackgroundElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.canvas = document.createElement('canvas');
        this.shadowRoot.appendChild(this.canvas);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 2, 3);
        this.camera.lookAt(0, -0.5, 0);
        this.clock = new THREE.Clock();
    }

    connectedCallback() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // STAR ALPHA TEXTURE
        const ctx = document.createElement("canvas").getContext("2d");
        ctx.canvas.width = ctx.canvas.height = 32;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, 32, 32);
        let grd = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grd.addColorStop(0.0, "#fff");
        grd.addColorStop(1.0, "#000");
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.rect(15, 0, 2, 32); ctx.fill();
        ctx.beginPath(); ctx.rect(0, 15, 32, 2); ctx.fill();
        grd = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grd.addColorStop(0.1, "#ffff");
        grd.addColorStop(0.6, "#0000");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 32, 32);
        const alphaMap = new THREE.CanvasTexture(ctx.canvas);

        // GALAXY
        const count = 128 ** 2;
        const galaxyGeometry = new THREE.BufferGeometry();
        const galaxyPosition = new Float32Array(count * 3);
        const galaxySeed = new Float32Array(count * 3);
        const galaxySize = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            galaxyPosition[i * 3] = i / count;
            galaxySeed[i * 3 + 0] = Math.random();
            galaxySeed[i * 3 + 1] = Math.random();
            galaxySeed[i * 3 + 2] = Math.random();
            galaxySize[i] = Math.random() * 2 + 0.5;
        }
        galaxyGeometry.setAttribute("position", new THREE.BufferAttribute(galaxyPosition, 3));
        galaxyGeometry.setAttribute("size", new THREE.BufferAttribute(galaxySize, 1));
        galaxyGeometry.setAttribute("seed", new THREE.BufferAttribute(galaxySeed, 3));

        const innColor = new THREE.Color("#f40");
        const outColor = new THREE.Color("#a7f");
        const galaxyMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uSize: { value: this.renderer.getPixelRatio() },
                uBranches: { value: 2 },
                uRadius: { value: 0 },
                uSpin: { value: Math.PI * 0.25 },
                uRandomness: { value: 0 },
                uAlphaMap: { value: alphaMap },
                uColorInn: { value: innColor },
                uColorOut: { value: outColor },
            },
            vertexShader: `
                precision highp float;

                attribute vec3 position;
                attribute float size;
                attribute vec3 seed;
                uniform mat4 projectionMatrix;
                uniform mat4 modelViewMatrix;

                uniform float uTime;
                uniform float uSize;
                uniform float uBranches;
                uniform float uRadius;
                uniform float uSpin;
                uniform float uRandomness;

                varying float vDistance;

                #define PI  3.14159265359
                #define PI2 6.28318530718

                #include <random, scatter>

                void main() {
                    vec3 p = position;
                    float st = sqrt(p.x);
                    float qt = p.x * p.x;
                    float mt = mix(st, qt, p.x);

                    // Offset positions by spin (farther wider) and branch num
                    float angle = qt * uSpin * (2.0 - sqrt(1.0 - qt));
                    float branchOffset = (PI2 / uBranches) * floor(seed.x * uBranches);
                    p.x = position.x * cos(angle + branchOffset) * uRadius;
                    p.z = position.x * sin(angle + branchOffset) * uRadius;

                    // Scatter positions & scale down by Y-axis
                    p += scatter(seed) * random(seed.zx) * uRandomness * mt;
                    p.y *= 0.5 + qt * 0.5;

                    // Rotate (center faster)
                    vec3 temp = p;
                    float ac = cos(-uTime * (2.0 - st) * 0.5);
                    float as = sin(-uTime * (2.0 - st) * 0.5);
                    p.x = temp.x * ac - temp.z * as;
                    p.z = temp.x * as + temp.z * ac;

                    vDistance = mt;

                    vec4 mvp = modelViewMatrix * vec4(p, 1.0);
                    gl_Position = projectionMatrix * mvp;
                    gl_PointSize = (10.0 * size * uSize) / -mvp.z;
                }
            `,
            fragmentShader: `
                precision highp float;

                uniform vec3 uColorInn;
                uniform vec3 uColorOut;
                uniform sampler2D uAlphaMap;

                varying float vDistance;

                #define PI  3.14159265359

                void main() {
                    vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
                    float a = texture2D(uAlphaMap, uv).g;
                    if (a < 0.1) discard;

                    vec3 color = mix(uColorInn, uColorOut, vDistance);
                    float c = step(0.99, (sin(gl_PointCoord.x * PI) + sin(gl_PointCoord.y * PI)) * 0.5);
                    color = max(color, vec3(c));

                    gl_FragColor = vec4(color, a);
                }
            `,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        galaxyMaterial.onBeforeCompile = (shader) => {
            shader.vertexShader = shader.vertexShader.replace("#include <random, scatter>", shaderUtils);
        };
        const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
        this.scene.add(galaxy);

        // UNIVERSE
        const universeGeometry = new THREE.BufferGeometry();
        const universePosition = new Float32Array(count * 3 / 2);
        const universeSeed = new Float32Array(count * 3 / 2);
        const universeSize = new Float32Array(count / 2);
        for (let i = 0; i < count / 2; i++) {
            universeSeed[i * 3 + 0] = Math.random();
            universeSeed[i * 3 + 1] = Math.random();
            universeSeed[i * 3 + 2] = Math.random();
            universeSize[i] = Math.random() * 2 + 0.5;
        }
        universeGeometry.setAttribute("position", new THREE.BufferAttribute(universePosition, 3));
        universeGeometry.setAttribute("seed", new THREE.BufferAttribute(universeSeed, 3));
        universeGeometry.setAttribute("size", new THREE.BufferAttribute(universeSize, 1));

        const universeMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uSize: galaxyMaterial.uniforms.uSize,
                uRadius: galaxyMaterial.uniforms.uRadius,
                uAlphaMap: galaxyMaterial.uniforms.uAlphaMap,
            },
            vertexShader: `
                precision highp float;

                attribute vec3 seed;
                attribute float size;
                uniform mat4 projectionMatrix;
                uniform mat4 modelViewMatrix;

                uniform float uTime;
                uniform float uSize;
                uniform float uRadius;

                #define PI  3.14159265359
                #define PI2 6.28318530718

                #include <random, scatter>

                // Universe size factor
                const float r = 3.0;
                // Scale universe sphere
                const vec3 s = vec3(2.1, 1.3, 2.1);

                void main() {
                    vec3 p = scatter(seed) * r * s;

                    // Sweep to center
                    float q = random(seed.zx);
                    for (int i = 0; i < 3; i++) q *= q;
                    p *= q;

                    // Sweep to surface
                    float l = length(p) / (s.x * r);
                    p = l < 0.001 ? (p / l) : p;

                    // Rotate (center faster)
                    vec3 temp = p;
                    float ql = 1.0 - l;
                    for (int i = 0; i < 3; i++) ql *= ql;
                    float ac = cos(-uTime * ql);
                    float as = sin(-uTime * ql);
                    p.x = temp.x * ac - temp.z * as;
                    p.z = temp.x * as + temp.z * ac;

                    vec4 mvp = modelViewMatrix * vec4(p * uRadius, 1.0);
                    gl_Position = projectionMatrix * mvp;

                    // Scale up core stars
                    l = (2.0 - l) * (2.0 - l);

                    gl_PointSize = (r * size * uSize * l) / -mvp.z;
                }
            `,
            fragmentShader: `
                precision highp float;

                uniform sampler2D uAlphaMap;

                #define PI 3.14159265359

                void main() {
                    vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
                    float a = texture2D(uAlphaMap, uv).g;
                    if (a < 0.1) discard;

                    gl_FragColor = vec4(vec3(1.0), a);
                }
            `,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        universeMaterial.onBeforeCompile = (shader) => {
            shader.vertexShader = shader.vertexShader.replace("#include <random, scatter>", shaderUtils);
        };
        const universe = new THREE.Points(universeGeometry, universeMaterial);
        this.scene.add(universe);

        // ANIMATION
        const u = galaxyMaterial.uniforms;
        const cRadius = {setValue: (v) => u.uRadius.value = v, updateDisplay: () => {}}; // Dummy objects for animation
        const cSpin = {setValue: (v) => u.uSpin.value = v, updateDisplay: () => {}};
        const cRandomness = {setValue: (v) => u.uRandomness.value = v, updateDisplay: () => {}};

        const tween = new TWEEN.Tween({
            radius: 0,
            spin: 0,
            randomness: 0,
            rotate: 0,
        }).to({
            radius: 1.618,
            spin: Math.PI * 2,
            randomness: 0.5,
            rotate: Math.PI * 4,
        })
        .duration(5000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(({ radius, spin, randomness, rotate }) => {
            cRadius.setValue(radius);
            cSpin.setValue(spin);
            cRandomness.setValue(randomness);
            galaxy.rotation.y = rotate;
            universe.rotation.y = rotate / 3;
        })
        .start();

        // LOOPER
        const t = 0.001;
        this.renderer.setAnimationLoop(() => {
            galaxyMaterial.uniforms.uTime.value += t / 2;
            universeMaterial.uniforms.uTime.value += t / 3;
            TWEEN.update();
            this.renderer.render(this.scene, this.camera);
        });

        // RESIZE
        window.addEventListener("resize", () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}

customElements.define('galaxy-element', BackgroundElement);

// Tween.js kütüphanesini CDN'den ekleyin (eğer modül olarak import etmek istemiyorsanız)
import { TWEEN } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/libs/tween.module.min.js';
window.TWEEN = TWEEN; // Global erişim için (isteğe bağlı)
