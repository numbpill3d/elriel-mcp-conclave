export default {
  generateShaderSnippet: {
    description: "Generate a GLSL snippet for Elriel’s alien-glow post-processing or effect pass.",
    run: async ({ type = "aura" }) => {
      if (type === "aura") {
        return {
          fragment: `uniform float time;
varying vec2 vUv;
void main() {
  float glow = 0.5 + 0.5 * sin(time + vUv.x * 10.0);
  gl_FragColor = vec4(0.6, 0.2, 1.0, 1.0) * glow;
}`
        }
      }
      if (type === "mushroom_warp") {
        return {
          fragment: `uniform float time;
varying vec2 vUv;
void main() {
  vec2 p = vUv - 0.5;
  float r = length(p);
  float theta = atan(p.y, p.x) + sin(time + r * 20.0) * 0.2;
  vec2 warped = vec2(cos(theta), sin(theta)) * r + 0.5;
  gl_FragColor = texture2D(tDiffuse, warped);
}`
        }
      }
      return { error: "Unknown type" }
    }
  }
}
