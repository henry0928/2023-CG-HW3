#version 330 core
layout(location = 0) out vec4 FragColor;

in VS_OUT {
  vec3 position;
  vec3 lightDirection;
  vec2 textureCoordinate;
  flat vec3 viewPosition;
} fs_in;

uniform bool useParallaxMapping;
// RGB contains the color
uniform sampler2D diffuseTexture;
// RGB contains the normal
uniform sampler2D normalTexture;
// R contains the height
// TODO (Bonus-Parallax): You may need these if you want to implement parallax mapping.
uniform sampler2D heightTexture;
float depthScale = 0.01;

vec2 parallaxMapping(vec2 textureCoordinate, vec3 viewDirection)
{
  // number of depth layers
  const float minLayers = 8;
  const float maxLayers = 32;
  // TODO (Bonus-Parallax): Implement parallax occlusion mapping.
  // Hint: You need to return a new texture coordinate.
  // Note: The texture is 'height' texture, you may need a 'depth' texture, which is 1 - height.
  //       The return value should be modified.
  return textureCoordinate;
}

void main() {
  vec3 viewDirectionection = normalize(fs_in.viewPosition - fs_in.position);
  vec2 textureCoordinate = useParallaxMapping ? parallaxMapping(fs_in.textureCoordinate, viewDirectionection) : fs_in.textureCoordinate;
  if(useParallaxMapping && (textureCoordinate.x > 1.0 || textureCoordinate.y > 1.0 || textureCoordinate.x < 0.0 || textureCoordinate.y < 0.0))
    discard;
  // Query diffuse texture
  vec3 diffuseColor = texture(diffuseTexture, textureCoordinate).rgb;
  // Ambient intensity
  float ambient = 0.1;
  float diffuse;
  float specular;

  // Get fragment's normal 
  vec3 normal = texture(normalTexture, fs_in.textureCoordinate).rgb;
  // [0, 1] change to [-1, 1] and normallize
  normal = normalize(normal * 2.0 - 1.0); 

  // TODO4: Blinn-Phong shading
  //   1. Query normalTexture using to find this fragment's normal
  //   2. Convert the value from RGB [0, 1] to normal [-1, 1], this will be inverse of what you do in calculatenormal.frag's output.
  //   3. Remember to NORMALIZE it again.
  //   4. Use Blinn-Phong shading here with parameters ks = kd = 0.75, shinness = 8.0
  //   5. specular = ks * pow(max(normal vector dot halfway direction), 0.0), shininess);
  //   6. diffuse = kd * max(normal vector dot light direction, 0.0)

  // diffuse
  diffuse = 0.75 * max(dot(fs_in.lightDirection, normal), 0.0);

  // specular
  vec3 halfwayDir = normalize(fs_in.lightDirection + viewDirectionection);    
  specular = 0.75 * pow(max(dot(normal, halfwayDir), 0.0), 8.0);
  
  float lighting = ambient + diffuse + specular;
  FragColor = vec4(lighting * diffuseColor, 1.0);
}
