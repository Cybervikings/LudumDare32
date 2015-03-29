
render = {}
gl = null

render.t = 0

render.px = 0.0
render.py = 0.0

render.projection_matrix = mat4.create()
render.view_matrix = mat4.create()
render.camera_matrix = mat4.create()

render.Update = function()
{
    if(!gl)return;

    if(core.mouse_move_claimed)
    {
        render.t += core.mouse_move_x
        core.mouse_move_claimed = false
    }

    var zangle = render.t*0.01
    var factor_cos = Math.cos(zangle)
    var factor_sin = Math.sin(zangle)

    var speed = 0.6
    
    if(core.key_state[core.keys.KEYID_W] > 0){ render.px -= speed*factor_sin; render.py -= speed*factor_cos;  }
    if(core.key_state[core.keys.KEYID_S] > 0){ render.px += speed*factor_sin; render.py += speed*factor_cos; }

    //if(core.key_state[core.keys.KEYID_A] > 0){ render.px -= 0.1*factor_sin; render.py -= 0.1*factor_cos;  }
    if(core.key_state[core.keys.KEYID_D] > 0){ render.px -= speed*factor_cos; render.py += speed*factor_sin;   }
    if(core.key_state[core.keys.KEYID_A] > 0){ render.px += speed*factor_cos; render.py -= speed*factor_sin;   }

    // Basics
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.viewport(0, 0, gl.viewport_width, gl.viewport_height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Camera Stuff
    mat4.perspective(45, gl.viewport_width / gl.viewport_height, 0.1, 100.0, render.projection_matrix)
    mat4.identity(render.view_matrix)

    mat4.rotateX(render.view_matrix, -3.141*0.5)
    mat4.rotateZ(render.view_matrix, zangle)
    

    mat4.translate(render.view_matrix, [render.px, render.py, -5.0])
    


    render.camera_matrix = mat4.multiply(render.projection_matrix, render.view_matrix, render.camera_matrix)

    //mat4.identity(render.camera_matrix)

    //gl.useProgram(null)

    render.basic_gpu_program.uniform_camera_matrix = gl.getUniformLocation(render.basic_gpu_program, "camera_matrix")

    gl.uniformMatrix4fv(render.basic_gpu_program.uniform_camera_matrix, false, render.camera_matrix)
    //gl.useProgram(render.basic_gpu_program)

    //alert(mat4.str(render.camera_matrix))

    
    if(render.temp_vb)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, render.temp_vb)
        gl.vertexAttribPointer(render.basic_gpu_program.vertexPositionAttribute, render.temp_vb.element_size, gl.FLOAT, false, 0, 0)
        gl.drawArrays(gl.TRIANGLES, 0, render.temp_vb.nr_elements)
    }
    else
    {
        //alert("No Vertex Buffer Derp")
    }

}

render.Initialize = function()
{
    render.InitializeOpenGL()



    var vertices = [0.0,  25.0,  0.0, -25.0, -25.0,  0.0, 25.0, -25.0,  0.0]

    render.temp_vb = render.CreateVertexBuffer(vertices, 3, 3)
}

render.SetViewportSize = function(width, height)
{
    //var gl = render.gl
    gl.viewport_width = width
    gl.viewport_height = height
}

render.RequestFullscreen = function()
{
    var canvas = render.canvas
    canvas.request_fullscreen = canvas.mozRequestFullScreen || canvas.msRequestFullscreen || mozRequestFullScreen || webkitRequestFullscreen
    canvas.request_pointer_lock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock

    canvas.request_fullscreen()
    canvas.request_pointer_lock()
}

render.InitializeOpenGL = function()
{
    render.canvas = document.getElementById("glwindow")
    gl = render.canvas.getContext("experimental-webgl")
    
    if(!gl)
    {
        alert("Could not create GL Context.")
    }

    render.SetViewportSize(render.canvas.width, render.canvas.height)

    var frag_shader = render.GetShader(gl, "shader-fs")
    var vert_shader = render.GetShader(gl, "shader-vs")

    var gpu_program = gl.createProgram()
    gl.attachShader(gpu_program, vert_shader)
    gl.attachShader(gpu_program, frag_shader)
    gl.linkProgram(gpu_program)

    if(!gl.getProgramParameter(gpu_program, gl.LINK_STATUS))
    {
        alert("Could not initialise GPU Program")
    }

    gl.useProgram(gpu_program)

    gpu_program.vertexPositionAttribute = gl.getAttribLocation(gpu_program, "aVertexPosition")
    gl.enableVertexAttribArray(gpu_program.vertexPositionAttribute)

    gpu_program.uniform_camera_matrix = gl.getUniformLocation(gpu_program, "camera_matrix")

    render.basic_gpu_program = gpu_program
}

render.CreateVertexBuffer = function(data, element_size, nr_elements, storage_type)
{
    var vertex_buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer)

    vertex_buffer.element_size = element_size
    vertex_buffer.nr_elements = nr_elements

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), storage_type || gl.STATIC_DRAW)
    return vertex_buffer
}

render.GetShader = function(gl, id) 
{
    var shader_script = document.getElementById(id)

    if(!shader_script)
    {
        return null
    }

    var str = ""
    var k = shader_script.firstChild
    while(k)
    {
        if(k.nodeType == 3) 
        {
            str += k.textContent
        }
        k = k.nextSibling
    }

    var shader;
    if(shader_script.type == "x-shader/x-fragment")
    {
        shader = gl.createShader(gl.FRAGMENT_SHADER)
    }
    else if(shader_script.type == "x-shader/x-vertex")
    {
        shader = gl.createShader(gl.VERTEX_SHADER)
    }
    else
    {
        return null
    }

    gl.shaderSource(shader, str)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
    {
        var info = gl.getShaderInfoLog(shader)

        var error_string = "Shader Error In: "
        error_string = error_string.concat(id)
        error_string = error_string.concat("\n")
        error_string = error_string.concat(info)
        alert(error_string)

        return null
    }

    return shader
}


