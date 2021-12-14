room.onLoad = function()
{
	if (!isJanusWeb) {
		room.run_speed = 5.4;
	}
}
room.update = function(dt)
{
	look_at_player(room.objects["3DCursorImg"])
	viewDistScale(room.objects["3DCursorImg"])
}

function look_at_player(obj) {
	var globalEyePos = translate(player.pos,player.eye_pos)
	scale(globalEyePos,-1)
	obj.fwd = add(globalEyePos,obj.pos);
}

function viewDistScale(obj) {
	var globalEyePos = translate(player.pos,player.eye_pos)
	obj.scale = Vector(distance(globalEyePos,obj.pos)*0.25);
}

/* Native client compatibility functions */
var isJanusWeb = (typeof elation != 'undefined');