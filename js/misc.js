

next_unique_id = 0

GetUniqueId = function()
{
    return next_unique_id++
}


GetWindowHeight = function() 
{
	var windowHeight = 0

	if(typeof(window.innerHeight) == 'number')
	{
		windowHeight = window.innerHeight
	}
	else 
	{
		if(document.documentElement && document.documentElement.clientHeight)
		{
			windowHeight = document.documentElement.clientHeight
		}
		else 
		{
			if(document.body && document.body.clientHeight)
			{
				windowHeight = document.body.clientHeight
			}
		}
	}

	return windowHeight;
}

GetWindowWidth = function() 
{
    var windowWidth = 0

    if(typeof(window.innerWidth) == 'number')
    {
        windowWidth = window.innerWidth
    }
    else 
    {
        if(document.documentElement && document.documentElement.clientWidth)
        {
            windowWidth = document.documentElement.clientWidth
        }
        else 
        {
            if(document.body && document.body.clientWidth)
            {
                windowWidth = document.body.clientWidth
            }
        }
    }

    return windowWidth
}