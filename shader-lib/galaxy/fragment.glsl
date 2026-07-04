precision highp float;

uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uStarDensity;
uniform float uRotationSpeed;

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

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec2 st = vUv * 2.0 - 1.0;
  float time = uTime * uSpeed;

  float angle = atan(st.y, st.x);
  float radius = length(st);

  float spiralAngle = angle + radius * 5.0 - time * uRotationSpeed;
  float spiral = sin(spiralAngle * 2.0) * 0.5 + 0.5;
  spiral *= exp(-radius * 2.0);

  float dust = fbm(vec2(radius * 3.0, spiralAngle * 0.5 + time * 0.05), 4);
  dust *= exp(-radius * 1.5);

  vec3 color = mix(uColor1, uColor2, spiral * 0.5 + 0.3 * dust);
  color = mix(color, uColor3, dust * 0.4);
  color *= 1.0 - radius * 0.3;
  color = clamp(color, 0.0, 1.0);

  float core = exp(-radius * 6.0);
  color += vec3(1.0, 0.9, 0.7) * core * 0.5;

  vec2 starCoord = st * 150.0 / (radius + 0.3) + time * 0.01;
  float star = random(floor(starCoord));
  float starThreshold = 1.0 - uStarDensity * 0.15;
  star = step(starThreshold, star);
  star *= 1.0 - smoothstep(0.0, 0.3, radius);

  float starSize = random(floor(starCoord + 100.0));
  star *= smoothstep(0.0, 0.2 + starSize * 0.5, fract(starCoord.x)) *
         smoothstep(1.0, 0.8 - starSize * 0.3, fract(starCoord.x));

  color += star * vec3(1.0, 0.95, 0.8) * (0.5 + starSize * 0.5);

  gl_FragColor = vec4(color, 1.0);
}
