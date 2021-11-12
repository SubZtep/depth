uniform float uSize1;
uniform float uSize2;
uniform vec3 uColor;
uniform float uDistance;
in vec3 worldPosition;
out vec4 myOutputColor;

float getGrid(float size) {
  vec2 r = worldPosition.xz / size;
  vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
  float line = min(grid.x, grid.y);
  return 1.0 - min(line, 1.0);
}

void main() {
  float d = 1.0 - min(distance(cameraPosition.xz, worldPosition.xz) / uDistance, 1.0);
  float g1 = getGrid(uSize1);
  float g2 = getGrid(uSize2);

  myOutputColor = vec4(uColor.rgb, mix(g2, g1, g1) * pow(d, 3.0));
}
