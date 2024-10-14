varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec2 pixelOffset;

void main() {
    // Based on https://shaderbits.com/blog/uv-dilation
    float minDist = 10000000.0;
    int maxSteps = 1;

    vec2 offsets[8];
    offsets[0] = vec2(-1,0);
    offsets[1] = vec2(1,0);
    offsets[2] = vec2(0,1);
    offsets[3] = vec2(0,-1);
    offsets[4] = vec2(-1,1);
    offsets[5] = vec2(1,1);
    offsets[6] = vec2(1,-1);
    offsets[7] = vec2(-1,-1);
    
    vec4 smpl = texture2D(uTexture, vUv);
    vec4 curMinSmpl = smpl;
    
    if(smpl.x == 0.0 && smpl.y == 0.0 && smpl.z == 0.0 && smpl.w == 0.0)
    {
        int i = 0;

        while(i < maxSteps)
        { 
            i++;
            int j = 0;
            while (j < 8)
            {
                vec2 curUV = vUv + offsets[j] * pixelOffset.x * float(i);
                vec4 offsetSmpl = texture2D(uTexture, curUV);
    
                if(offsetSmpl.x != 0.0 || offsetSmpl.y != 0.0 || offsetSmpl.z != 0.0 || offsetSmpl.w != 0.0)
                {
                    float currDist = length(vUv - curUV);
    
                    if (currDist < minDist)
                    {
                        vec2 projectUV = curUV + offsets[j] * pixelOffset.x * float(i) * 0.25;
                        vec4 direction = texture2D(uTexture, projectUV);
                        minDist = currDist;
    
                        if(direction.x != 0.0 || direction.y != 0.0 || direction.z != 0.0 || direction.w != 0.0)
                        {
                            vec4 delta = offsetSmpl - direction;
                            curMinSmpl = offsetSmpl + delta * 4.0;
                        }
                        else
                        {
                            curMinSmpl = offsetSmpl;
                        }
                    }
                }
                j++;
            }
        }
    }

    gl_FragColor = curMinSmpl;
}
