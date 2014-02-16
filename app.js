// ========================================================================= //
//   EXAMPLE APP                                                             //
// ========================================================================= //

var Flipium = require("flipium");

// Experiments/edits by Kosso in attempts to use views instead of images as the pages of the flipview.

// Kosso:
// Container to hold the original views while the dragview is not being touched. 
// Problem here is: the underlying views cannot receive the click events (or at least I can't see how)
var con = Ti.UI.createView({
  height:460,
  width:320,
  top:0,
  zIndex:2, 
  borderColor:'green',
  backgroundColor:'transparent'
});


var view1 = Ti.UI.createView({
  height:460,
  top:0,
  width:320,
  zIndex:2, 
  //backgroundColor:'red'
  backgroundImage:'/images/1.png'
});

view1.add(Ti.UI.createLabel({
  text:'VIEW ONE',
  color:'red', 
  font:{fontSize:40}
}));

var a_button = Ti.UI.createButton({
  title:'button',
  width:100,
  height:40,
  top:30,
  backgroundColor:'white',
  tintColor:'red',
  borderColor:'yellow',
  borderWidth:10
});

view1.add(a_button);


var view2 = Ti.UI.createView({
  height:460,
  width:320,
  top:0,
  zIndex:2,
  backgroundImage:'/images/2.png'
});

view2.add(Ti.UI.createLabel({
  text:'VIEW TWO',
  color:'white',
  font:{fontSize:40}
}));

var b_button = Ti.UI.createButton({
  title:'add',
  width:130,
  height:40,
  top:90,
  backgroundColor:'white',
  tintColor:'red',
  borderColor:'black',
  borderWidth:5
});

view2.add(b_button);

var view3 = Ti.UI.createView({
  height:460,
  width:320,
  top:0,
  zIndex:2,  
  backgroundImage:'/images/3.png'
});


view3.add(Ti.UI.createLabel({
  text:'VIEW THREE',
  color:'white', 
  font:{fontSize:40}
}));


var c_button = Ti.UI.createButton({
  title:'button',
  width:100,
  height:40,
  bottom:30,
  backgroundColor:'white',
  tintColor:'red',
  borderColor:'yellow',
  borderWidth:10
});

view3.add(c_button);



fv = Flipium.createFlipView({
  views: [view1, view2, view3], // define views OR images+path
  
  //images: ["1.png", "2.png", "3.png"], 
  //path: "/example/",
  zIndex:1,
  horizontal: false,
  cacheOnLoad: false,
  duration: 500,
  height: 460  
});

// wire this up to be able to add/remove the views from flipium.js
fv.con = con;


/*

FlipView Configuration

The following properties can be passed as a single object to the createFlipView() function:

* duration: Time for the a page to turn fully in ms (default = 500)
* images: An array containing your image filenames, e.g. ["1.png", "2.png", "3.png"]
* path: Specify path to the folder containing your images
OR views: An array of Ti.UI.views
* horizontal: Set to true for horizontal flipping (default = false)
* startPage: FlipView will flip to this page on load (default = 1)
* cacheOnLoad: By set to true, Flipium will crop and cache your images into flippable pages and save them in the ApplicationDataDirectory. If set to false, Flipium will expect each page to already be separated into two equally-sized images, with filenames in the format: "img_1_t.png" and "img_1_b.png" for top-bottom flipping, or "img_1_l.png" and "img_1_r.png" for left-right flipping (default = false)
* distance: A number specifying the distance for the 3D animation. No meaningful units (default = 1000)

*/

dv = Flipium.createDragView(fv);

/*

DragView Configuration

The following properties can be passed as a single object to the createDragView() function:

* dragDistance: The distance in pixels/points the user has to drag to manually flip a page (default = 230)
* dragThreshold: After manually flipping a page past this percentage, the page will continue to flip over (default = 0.5)
* initialDrag: The minimum distance in pixels/points the user has to drag before the page starts manually flipping (default = 10)
* tapThreshold: The maximum (accidental) distance in pixels/points the user can drag in order for the gesture to be considered a tap (default = 5)
* topLimit: When the user tries to flip to a previous page but is at the start limit, the page will stop flipping at this percentage (default = 0.7)
* bottomLimit: When the user tries to flip to a next page but is at the end limit, the page will stop flipping at this percentage (default = 0.3)

*/


// Tests : Moving the dragview zone to the side to allow/test underyling interactive views.

dv.zIndex = 100;
dv.borderColor = 'yellow';
dv.left = 0;
dv.top = 0;
dv.width = 160;
dv.bubbleParent = true;

//dv.touchEnabled = false;


dv.addEventListener('tap', function(e){
  Ti.API.info('dragview "tap" event ');
  Ti.API.info(e);

  // try to fire this on to the container view. (didin't work)
  //con.fireEvent('click', e);


});

win = Ti.UI.createWindow({
  top:20,
  backgroundColor: "#fff",
  backgroundImage: "bg.jpg",
  navBarHidden: true  
});

win.add(fv);

win.add(dv);

con.add(view1); // probably should do this within flipium.js when initialising

win.add(con);


//win.add(view1);
win.open();

a_button.addEventListener('click', function(e){
  Ti.API.info('Test click on view one');
});



var view4 = Ti.UI.createView({
  height:460,
  width:320,
  top:0,
  zIndex:2,  
  backgroundImage:'/images/4.png'
});


var view5 = Ti.UI.createView({
  height:460,
  width:320,
  top:0,
  zIndex:2,  
  backgroundImage:'/images/5.png'
});

c_button.addEventListener('click', function(e){
  
  // Test: To dynamically add another view to the flipview. 
  // Still not quite working.. Split images of the view are being generated/cached ok. But flippers themselves not being properly constructed and added.
  fv.addFlipView(view5);
});


b_button.addEventListener('click', function(e){

  // Another test with another view...
  fv.addFlipView(view4);

});



