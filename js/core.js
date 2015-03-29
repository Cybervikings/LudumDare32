


core = { mouse_move_x:0, mouse_move_y:0, }

core.keys = {KEYID_A:65, KEYID_D:68, KEYID_W:87, KEYID_S:83}
core.key_down = []
core.key_state = []

core.Update = function()
{
	core.UpdateKeyboardInput()
}

core.UpdateKeyboardInput = function()
{
	for(var key in core.key_state)
	{
		var index = parseInt(key)
		var key_state = core.key_state[index]
		var key_down = core.key_down[index] || 0

		if(key_down)
		{
			if(key_state == 0)core.key_state[index] = 2
			else core.key_state[index] = 1
		}
		else
		{
			if(key_state == 1)core.key_state[index] = -1
			else core.key_state[index] = 0
		}
	}
}

core.MainLoopProxy = function()
{
	var date_object = new Date()
	var current_time = date_object.getTime()
	var time_diff = current_time-core.last_time

	while(core.update_frequency < time_diff)
	{
		render.Update()
		core.Update()

		time_diff -= core.update_frequency
		core.last_time += core.update_frequency
	}
}

core.MouseMoveCallback = function(event)
{
	var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0
	var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0

	core.mouse_move_x = movementX
	core.mouse_move_y = movementY
	core.mouse_move_claimed = true
}

core.KeyDownCallback = function(event)
{
	core.key_down[event.keyCode] = true
}

core.KeyUpCallback = function(event)
{
	core.key_down[event.keyCode] = false
}

core.Initialize = function()
{
	var date_object = new Date()
	core.last_time = date_object.getTime()
	core.update_frequency = 1000/60

	document.addEventListener("mousemove", core.MouseMoveCallback, false)
	document.addEventListener('keydown', core.KeyDownCallback)
	document.addEventListener('keyup', core.KeyUpCallback)

	for(var key in core.keys)
	{
		core.key_state[core.keys[key]] = 0
	}


	render.Initialize()
	setInterval(core.MainLoopProxy, 10)
}