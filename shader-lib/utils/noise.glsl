float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float random2D(vec3 p) {
  return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453123);
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

float noise3D(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);

  float a = random2D(i);
  float b = random2D(i + vec3(1.0, 0.0, 0.0));
  float c = random2D(i + vec3(0.0, 1.0, 0.0));
  float d = random2D(i + vec3(1.0, 1.0, 0.0));
  float e = random2D(i + vec3(0.0, 0.0, 1.0));
  float f_ = random2D(i + vec3(1.0, 0.0, 1.0));
  float g = random2D(i + vec3(0.0, 1.0, 1.0));
  float h = random2D(i + vec3(1.0, 1.0, 1.0));

  float mix1 = mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  float mix2 = mix(mix(e, f_, u.x), mix(g, h, u.x), u.y);
  return mix(mix1, mix2, u.z);
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

float fbm3D(vec3 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    value += amplitude * noise3D(p * frequency);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

float smoothNoise(vec2 st) {
  return noise(st) * 0.5 + 0.5;
}
