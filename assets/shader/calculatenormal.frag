#version 330 core
layout(location = 0) out vec4 normal;
layout(location = 1) out float height;

uniform float offset;

void main() {
  const float delta = 0.01;

  // TO get fragment position
  vec2 fragment_pos = gl_FragCoord.xy ;
  
  // calculate two triangle normal
  //       vertex pos
  // 
  //         vertex1       
  // vertex2         vertex4
  //         vertex3
  // 

  float h1 = sin(offset - 0.1 * (fragment_pos.y-delta)) ;
  float h2 = sin(offset - 0.1 * (fragment_pos.y)) ;
  float h3 = sin(offset - 0.1 * (fragment_pos.y+delta)) ;
  float h4 = sin(offset - 0.1 * (fragment_pos.y)) ;
  vec3 v1 = vec3(2.0*delta, 0.0, h4-h2) ;
  vec3 v2 = vec3(delta, -delta, h1-h2) ;
  vec3 v3 = vec3(delta, delta, h3-h2) ;
  vec3 v4 = v1 ;

  vec3 average = normalize(cross(v1,v2) + cross(v3,v4)) ;

  // TODO3: Generate the normal map.
  //   1. Get the position of the fragment. (screen space)
  //   2. Sample 4 points from combination of x +- delta, y +- delta
  //   3. Form at least 2 triangles from those points. Calculate their surface normal
  //   4. Average the surface normal, then tranform the normal [-1, 1] to RGB [0, 1]
  //   5. (Bonus) Output the H(x, y)
  // Note:
  //   1. Height at (x, y) = H(x, y) = sin(offset - 0.1 * y)
  //   2. A simple tranform from [-1, 1] to [0, 1] is f(x) = x * 0.5 + 0.5
  //   3. For sample points, z = H(x +- delta, y +- delta)
  average = average*0.5 + 0.5 ;
  normal = vec4(average, 1) ;
  height = sin(offset-0.1*fragment_pos.y);
}
