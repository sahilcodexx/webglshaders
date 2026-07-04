precision highp float;

uniform float uTime;
uniform float uSpeed;
uniform float uIntensity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

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
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    value += amplitude * noise(st * frequency);
    st *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

float auroraLayer(vec2 st, float time, float offset, float scale) {
  vec2 q = vec2(0.0, 0.0);
  q.x = fbm(st + vec2(0.1 * time + offset, 0.0), 3);
  q.y = fbm(st + vec2(0.2 * time + offset, 1.0), 3);
  return fbm(st + q * scale + vec2(offset, 0.3 * time), 3);
}

void main() {
  vec2 st = vUv * 3.0;
  float time = uTime * uSpeed;

  float layer1 = auroraLayer(st, time, 0.0, 0.7);
  float layer2 = auroraLayer(st * 1.5, time * 0.7, 2.0, 0.5);
  float layer3 = auroraLayer(st * 2.0, time * 0.5, 4.0, 0.3);

  float mask = smoothstep(0.0, 1.5, vUv.y);
  float horizon = smoothstep(0.0, 0.4, vUv.y) * (1.0 - smoothstep(0.6, 1.0, vUv.y));

  vec3 col1 = uColor1 * (layer1 * 0.7 + 0.3);
  vec3 col2 = uColor2 * (layer2 * 0.7 + 0.3);
  vec3 col3 = uColor3 * (layer3 * 0.7 + 0.3);

  vec3 color = mix(col1, col2, smoothstep(0.2, 0.6, layer1 * 0.5 + layer2 * 0.5));
  color = mix(color, col3, smoothstep(0.4, 0.8, layer2 * 0.5 + layer3 * 0.5));

  float intensity = (layer1 * 0.5 + layer2 * 0.3 + layer3 * 0.2) * uIntensity;

  color *= intensity * mask * 1.5;
  color = clamp(color, 0.0, 1.0);

  float glow = exp(-abs(vUv.y - 0.3) * 8.0) * 0.3 * uIntensity;
  color += mix(uColor1, uColor2, 0.5) * glow;

  gl_FragColor = vec4(color, 1.0);
}
