precision highp float;

uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform float uAngle;
uniform float uBlend;
uniform float uScale;

varying vec2 vUv;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

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

mat2 rotate2D(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 st = vUv;
  float time = uTime * uSpeed;

  vec2 stRot = rotate2D(uAngle) * (st * 2.0 - 1.0);
  stRot = stRot * 0.5 + 0.5;

  float grad = stRot.x;
  float grad2 = stRot.y;
  float radial = length(st - 0.5) * 2.0 * uScale;

  float animOffset = sin(time * 0.5 + grad * 3.0) * (1.0 - uBlend * 0.5) + time * 0.1;
  float pos = grad + animOffset * 0.1;
  float pos2 = grad2 - animOffset * 0.05;

  float noiseVal = noise(st * 3.0 + time * 0.1) * uBlend * 0.3;

  vec3 c1 = mix(uColor1, uColor2, smoothstep(0.0, 0.33, pos + noiseVal));
  vec3 c2 = mix(uColor2, uColor3, smoothstep(0.33, 0.66, pos + noiseVal));
  vec3 c3 = mix(uColor3, uColor4, smoothstep(0.66, 1.0, pos + noiseVal));

  vec3 linear = mix(mix(c1, c2, smoothstep(0.33, 0.66, pos + noiseVal)), c3, smoothstep(0.66, 1.0, pos + noiseVal));

  float radialPos = radial * 0.5 + noiseVal * 0.5;
  vec3 r1 = mix(uColor1, uColor3, smoothstep(0.0, 0.5, radialPos));
  vec3 r2 = mix(uColor3, uColor4, smoothstep(0.5, 1.0, radialPos));
  vec3 radialGrad = mix(r1, r2, smoothstep(0.5, 1.0, radialPos));

  vec3 color = mix(linear, radialGrad, uBlend * 0.5);
  color = clamp(color, 0.0, 1.0);

  gl_FragColor = vec4(color, 1.0);
}
