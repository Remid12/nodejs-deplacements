    var socket = io.connect("http://localhost:1337");

    // store key codes and currently pressed ones
    var keys = {};
        keys.UP = 38;
        keys.LEFT = 37;
        keys.RIGHT = 39;
        keys.DOWN = 40;

    /// store reference to character's position and element
    var character = {
      x: 20,
      y: 20,
      speedMultiplier: 0.5,
      element: document.getElementById("vaisseau")
    };

    /// key detection (better to use addEventListener, but this will do)
    document.body.onkeyup = document.body.onkeydown = function(e){
      e.preventDefault();
      var kc = e.keyCode;
      keys[kc] = e.type == 'keydown';
    };

    var posX;
    var posY;

    // character movement update
    var moveCharacter = function(dx, dy){
      character.x += (dx||0) * character.speedMultiplier;
      character.y += (dy||0) * character.speedMultiplier;

      posX = character.element.style.left = character.x + '%';
      posY = character.element.style.top = character.y + '%';

      socket.emit("ShipPosition", {
          value : [posX, posY]
      });
    };
    
    var yolo = false;
    if(yolo == false) {
      socket.on("ShipPosition", function(data){
          console.log(data.value[0]);
      });
      var yolo = true;
    }  
    

    /// character control
    var detectCharacterMovement = function(){
      if ( keys[keys.LEFT] ) {
        socket.emit("deplacement", {
          value : [-1,0]
        });
      }
      if ( keys[keys.RIGHT] ) {
        socket.emit("deplacement", {
          value : [1,0]
        });
      }
      if ( keys[keys.UP] ) {
        socket.emit("deplacement", {
          value : [0,-1]
        });
      }
      if ( keys[keys.DOWN] ) {
        socket.emit("deplacement", {
          value : [0,1]
        });
      }
    };

    socket.on("deplacement", function(data){
      moveCharacter(data.value[0], data.value[1]);
    });

    socket.on("playerCount", function(count){
      var counter = document.getElementsByClassName("playerCount")[0];
      console.log(count);
      console.log(counter);
      counter.innerHTML = count;
    });

    // setup the default ship position
    moveCharacter();

    // We check if the ship dont go outside the window
    var DetectShipWindow = function() {
    	var windowHeight = window.innerHeight;
    	var windowWidth = window.innerWidth;

    	if(character.y <= 0){
    		character.y = 0;
    		character.element.style.top = 0 + 'px';
    	}
    	if(character.y > 96){
    		character.y = 96;
    		character.element.style.top = 96 + '%';
    	}
    	if(character.x <= 0){
    		character.x = 0;
    		character.element.style.left = 0 + 'px';
    	}
    	if(character.x > 96){
    		character.x = 96;
    		character.element.style.left = 96 + '%';
    	}
    }

    // game loop
    setInterval(function(){
      detectCharacterMovement();
      DetectShipWindow();
    }, 20);



