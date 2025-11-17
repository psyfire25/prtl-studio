export const vertexShaderSource = `#version 300 es
layout(location = 0) in vec2 a_position;

void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const defaultFragmentShader = `#version 300 es
precision highp float;

out vec4 outColor;

uniform float time;
uniform vec2 resolution;
uniform float brightness;
uniform float audioLevel;

void main() {
    vec2 uv = (gl_FragCoord.xy / resolution) * 2.6 - 1.0;

    float d = length(uv);
    float ring = 0.5 + 0.5 * sin(10.0 * d - time * 2.0);

    vec3 base = vec3(0.1, 0.3, 0.9);
    vec3 col = mix(base, vec3(1.0, 0.5, 0.2), ring);
    float boost= 0.5 + audioLevel * 2.0;
    outColor = vec4(col, 1.0);
}
`;

export const altFragmentShader = `#version 300 es
precision highp float;

out vec4 outColor;

uniform float time;
uniform vec2 resolution;
uniform float audioLevel;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 p = uv * 4.0;

    float t = time * 0.2;
    float n = noise(p + vec2(t, -t));

    float bands = smoothstep(0.3, 0.7, n + 0.2 * sin(time * 3.0 + p.x * 4.0));

    vec3 col = vec3(
        0.3 + 0.7 * bands,
        0.2 + 0.6 * (1.0 - audioLevel * 2.0),
        0.5 + 0.5 * sin(time + n * 6.2831)
    );

    col *= 0.7 + audioLevel * 2.0;

    outColor = vec4(col, 1.0);
}
`;
