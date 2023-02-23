#define DIST 900.0
 
precision highp float;
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
const float PI = 3.1415926535897932384626433832795;
 
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
 
float map( vec3 p )
{
    float d = 0.0;
    p = abs(p);
    p = mod(p,3.)-1.5;
    d = length(p)- .5;
    return d;
}
 
 
 
float raymarch( in vec3 ro, in vec3 rd )
{
    float d = 0.0;
    float t = 0.0;
    for( int i=0; i<10000000; i++ )
    {
        d = map( ro + rd*t );
        t += d;
        if( d<0.0001 || t>DIST ) break;
    }
    return t;
}
 
vec3 calcNormal( in vec3 p )
{
    vec2 e = vec2(1.0,-1.0)*0.5773*0.0005;
    return normalize( e.xyy*map(p+e.xyy) + e.yyx*map(p+e.yyx) + e.yxy*map(p+e.yxy) + e.xxx*map(p+e.xxx) );
}
 
void main()
{
    
    vec2 uv = gl_FragCoord.xy/resolution.xy;
    uv = uv*2.0-1.0;
    uv.x *= resolution.x/resolution.y;
    
    vec3 ro = vec3( 0.0, 0.0, -3.0 );
    vec2 g = vec2(0.,time*0.03);
    ro.xz += g*10.5;
    ro.y += mouse.y*0.1;
    vec3 rd = normalize( vec3(uv.xy,2.0) );
    
    float t = raymarch( ro, rd );
    
    vec3 col = vec3(0.0);
    if( t<DIST )
    {
        vec3 pos = ro + rd*t;
        vec3 nor = calcNormal( pos );
        col = 0.5 + 0.5*nor;
    }
	#define rm_UseFog 1
	#if ( rm_UseFog == 1 )
		float fog = 0.005;
		fog *= 1.;
       	        col = mix(col, vec3(0.2, 0.0, 0.2), 1.0 - (1.0) / (1.0 + t*t*fog));;
	#endif

  col = vec3(0.03*col.r + 0.03*col.g + 0.03*col.b);
  col = vec3(col.r + col.g + col.b) / 3.0;

      
  gl_FragColor = vec4( col, 1.0 );
}


