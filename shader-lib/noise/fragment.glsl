precision highp float;

uniform float uTime;
uniform float uSpeed;
uniform float uScale;
uniform float uIntensity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform int uOctaves;
uniform float uContrast;

varying vec2 vUv;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 random2(vec2 st) {
  st = vec2(dot(st, vec2(127.1, 311.7)), dot(st, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(random2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 st, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
    value += amplitude * noise(st * frequency);
    st *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

float warp(vec2 st, float time) {
  vec2 q = vec2(fbm(st + vec2(0.0, 0.0), uOctaves),
                fbm(st + vec2(5.2, 1.3), uOctaves));
  vec2 r = vec2(fbm(st + 4.0 * q + vec2(1.7, 9.2) + 0.15 * time, uOctaves),
                fbm(st + 4.0 * q + vec2(8.3, 2.8) + 0.126 * time, uOctaves));
  return fbm(st + 4.0 * r, uOctaves);
}

void main() {
  vec2 st = vUv * uScale;
  float time = uTime * uSpeed;
  float n = warp(st, time);
  n = pow(n * uContrast, 1.0 / uContrast);
  n = clamp(n * uIntensity, 0.0, 1.0);
  vec3 color = mix(uColor1, uColor2, n);
  gl_FragColor = vec4(color, 1.0);
}
