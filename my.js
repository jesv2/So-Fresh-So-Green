
function setupTabs () {
    document.querySelectorAll(".tabs__button").forEach(button => {
        button.addEventListener("click", () => {
            const sideBar = button.parentElement;
            const tabsContainer = sideBar.parentElement;
            const tabNumber = button.dataset.forTab;
            const tabToActivate = tabsContainer.querySelector(`.tabs__content[data-tab="${tabNumber}"]`)

            sideBar.querySelectorAll(".tabs__button").forEach(button => {
                button.classList.remove("tabs__button--active");
            });

            tabsContainer.querySelectorAll(".tabs__content").forEach(tab => {
                tab.classList.remove("tabs__content--active");
            });

            button.classList.add("tabs__button--active");
            tabToActivate.classList.add("tabs__content--active");
        });
    });
}



document.addEventListener("DOMContentLoaded", () => {
    setupTabs(); 
    MakePinDivs();
    //Displays the first tabs content by default
    document.querySelectorAll(".tabs").forEach(tabsContainer => {
        tabsContainer.querySelector(".tabs__sidebar .tabs__button").click();
    });
    
    /*const iterator = GetPinNums( BOX_NAME ).values();
    for (const value of iterator) {
        console.log(value);
    }*/
    console.log( JSON.parse( JSON.stringify( GetPinNums( BOX_NAME ) ) ) ); 
});

/* 
    Code for submit button of the pin setup window
    This section of the code just gets the layouts of the pins
    Getting the data collection frequency from the user will come from another portion of the code
    I haven't actually gotten the pin layout for the Arduino board so I just made some assumptions,
    but this layout will most likely need to change as the code matures. 

    I need to work on encapsulating this code
*/

let pinConfig = {}; //this variable is essentially going to be a global

let pinSetup = document.getElementById( 'pinSetup' );
pinSetup.addEventListener( 'click', GetPinSetup, false );

function GetPinSetup() {

  pinConfig = {}; 
  let tempPins = GetPinNums( 'tempPins' );
  //let notUsedPins = GetPinNums( 'notUsedPins' );
  let lightPins = GetPinNums( 'lightPins' );
  let humidityPins = GetPinNums( 'humidityPins' );

  console.log( JSON.parse( JSON.stringify( tempPins ) ) );
  console.log( JSON.parse( JSON.stringify( lightPins ) ) );
  console.log( JSON.parse( JSON.stringify( humidityPins ) ) );

  pinConfig['sensorType'] = [];
  insertSensorSetup( tempPins, 'temperature'  );
  insertSensorSetup( lightPins, 'light'  );
  insertSensorSetup( humidityPins, 'humidity'  );

  console.log( JSON.parse( JSON.stringify( pinConfig ) ) ); 

  /*let size = tempPins.length;
  if ( size != 0 ) {
    pinConfig['sensorType'].push('temperature');
    pinConfig['temperature'] = tempPins;    
  }
  size = lightPins.length;
  if ( size != 0 ) {
    pinConfig['sensorType'].push('light');
    pinConfig['light'] = lightPins;    
  } 
  size = humidityPins.length;
  if ( size != 0 ) {
    pinConfig['sensorType'].push('humidity');
    pinConfig['humidity'] = humidityPins;    
  } */
}

function insertSensorSetup( pinNums, sensorType ) {
  let size = pinNums.length;
  if ( size != 0 ) {
    pinConfig['sensorType'].push(sensorType);
    pinConfig[sensorType] = pinNums;    
  }
}

/* This block is code is for making the divs that we can drag around to indicate what the state of each pin is */
const PIN_COUNT = 10;
const BOX_NAME = 'notUsedPins'; 

//called in the DOMContentLoaded event handler
function MakePinDivs() {
  let boxForPins = document.getElementById( BOX_NAME ); 
  for( let counter = 2; counter <= PIN_COUNT; counter++ ) {
    let newDiv = document.createElement('div');
    newDiv.className = 'draggable';
    newDiv.draggable = 'true';
    newDiv.ondragstart = "event.dataTransfer.setData('text/plain',null)";
    newDiv.innerHTML = 'pin' + counter.toString();
    newDiv.id = 'pin' + counter.toString();
    boxForPins.append( newDiv ); 
  }
}

/*
  This function is meant to access the div correspond to the boxName and see which pins are 
  being used for each possible setup.
  Input: boxName, a string that correspond to the id of the element that holds the pin buttons
  Returns: An array of integers that says which pins are the box
    - Try to get this ascending order
*/

function GetPinNums( boxName ) {
  let pinMap = Array( PIN_COUNT );
  let pinNums = Array(); 
 //const box = document.getElementById( boxName );
  const pins = document.getElementById( boxName ).children; 
  
  let size = pins.length;
  for ( let i = 1; i <= size; i++ ) {
    console.log('id: ' + pins[i - 1].id);
    console.log('size:' + size); 
    switch ( pins[i - 1].id ) {
      case 'pin1':
        pinMap[ 0 ] = true; 
        break;
      case 'pin2':
        pinMap[ 1 ] = true;
        break;
      case 'pin3':
        pinMap[ 2 ] = true;
        break;
      case 'pin4':
        pinMap[ 3 ] = true;
        break;
      case 'pin5':
        pinMap[ 4 ] = true;
        break;
      case 'pin6':
        pinMap[ 5 ] = true;
        break;
      case 'pin7':
        pinMap[ 6 ] = true;
        break;
      case 'pin8':
        pinMap[ 7 ] = true;
        break;
      case 'pin9':
        pinMap[ 8 ] = true;
        break;
      case 'pin10':
        pinMap[ 9 ] = true;
        break;
      default:
        console.log('Unexpected value for pin id');
    }
  }

  console.log( JSON.parse( JSON.stringify( pinMap ) ) );

  for ( i = 0; i < PIN_COUNT; i++ ) {
    if ( pinMap[i] === true ) {
      pinNums.push( i + 1 ); 
    }
  }

  return pinNums; 
}

//Source: https://developer.mozilla.org/en-US/docs/Web/API/Document/dragstart_event

let dragged;

  /* events fired on the draggable target */
  document.addEventListener("drag", function( event ) {

  }, false);

  document.addEventListener("dragstart", function( event ) {
      // store a ref. on the dragged elem
      dragged = event.target;
      // make it half transparent
      event.target.style.opacity = .5;
  }, false);

  document.addEventListener("dragend", function( event ) {
      // reset the transparency
      event.target.style.opacity = "";
  }, false);

  /* events fired on the drop targets */
  document.addEventListener("dragover", function( event ) {
      // prevent default to allow drop
      event.preventDefault();
  }, false);

  document.addEventListener("dragenter", function( event ) {
      // highlight potential drop target when the draggable element enters it
      if ( event.target.className == "dropzone" ) {
          event.target.style.background = "purple";
      }

  }, false);

  document.addEventListener("dragleave", function( event ) {
      // reset background of potential drop target when the draggable element leaves it
      if ( event.target.className == "dropzone" ) {
          event.target.style.background = "";
      }

  }, false);

  document.addEventListener("drop", function( event ) {
      // prevent default action (open as link for some elements)
      event.preventDefault();
      // move dragged elem to the selected drop target
      if ( event.target.className == "dropzone" ) {
          event.target.style.background = "";
          dragged.parentNode.removeChild( dragged );
          event.target.appendChild( dragged );
      }
    
  }, false);
