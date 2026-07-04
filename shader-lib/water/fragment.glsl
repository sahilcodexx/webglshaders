precision highp float;

uniform float uTime;
uniform float uSpeed;
uniform vec3 uDeepColor;
uniform vec3 uShallowColor;
uniform vec3 uFoamColor;
uniform float uWaveHeight;
uniform float uWaveFrequency;

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

float wave(vec2 st, float time, float freq, float amp) {
  return sin(st.x * freq + time) * cos(st.y * freq * 0.8 + time * 0.7) * amp;
}

void main() {
  vec2 st = vUv * 4.0;
  float time = uTime * uSpeed;

  float w1 = wave(st, time * 0.8, uWaveFrequency * 8.0, uWaveHeight * 0.4);
  float w2 = wave(st * 1.3, time * 1.2, uWaveFrequency * 12.0, uWaveHeight * 0.3);
  float w3 = wave(st * 0.7, time * 0.5, uWaveFrequency * 5.0, uWaveHeight * 0.3);

  float combinedWave = w1 + w2 + w3;

  vec2 distorted = st + combinedWave * 0.15;
  float noiseVal = fbm(distorted + time * 0.1, 4);

  float depth = smoothstep(-0.8, 0.8, combinedWave);
  vec3 color = mix(uDeepColor, uShallowColor, depth);

  color += noiseVal * 0.08;

  vec2 foamSt = st + time * 0.05;
  float foamNoise = fbm(foamSt, 3);
  float foam = smoothstep(0.35, 0.6, foamNoise) * (1.0 - depth) * 0.5;
  foam *= smoothstep(0.3, 0.0, abs(combinedWave));
  color = mix(color, uFoamColor, foam * 0.6);

  float highlight = pow(abs(combinedWave), 4.0) * 2.0;
  color += vec3(highlight * 0.5);

  float fresnel = pow(1.0 - vUv.y, 3.0) * 0.3;
  color += vec3(fresnel);

  color = clamp(color, 0.0, 1.0);

  gl_FragColor = vec4(color, 1.0);
}
