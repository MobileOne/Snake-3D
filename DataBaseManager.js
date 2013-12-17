var DataBaseManager = Class({
	
    initialize : function() {
    },

    addUser : function( key, user) {
        var oldListUser = localStorage.getItem( key);
		var listUserArray = JSON.parse( oldListUser) || new Array();
		if ( listUserArray.indexOf( user) == -1) listUserArray.push( user);
		localStorage.setItem( key, JSON.stringify( listUserArray) )
    },

    stockScore : function(){
        var userOldScore = localStorage.getItem(config.user);
        if ( !userOldScore || parseInt(userOldScore) < config.points) localStorage.setItem( config.user, config.points);
    },
});