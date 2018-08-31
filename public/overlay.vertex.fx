#ifdef GL_ES
  precision mediump float;
#endif

attribute vec3 position;
attribute vec4 color;

uniform mat4 worldViewProjection;

varying vec4 vColor;
varying vec2 vScreenUV;

void main(void) {
  gl_Position = worldViewProjection * vec4(position, 1.0);
  vColor = color;
  vScreenUV = vec2(gl_Position.x * 0.5 + 0.5, gl_Position.y * 0.5 + 0.5);
}