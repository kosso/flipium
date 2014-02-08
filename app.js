// ========================================================================= //
//   EXAMPLE APP                                                             //
// ========================================================================= //

var Flipium = require("flipium");

var view1 = Ti.UI.createView({
  height:460,
  width:320,
  backgroundColor:'red'
});

view1.add(Ti.UI.createLabel({
  text:'VIEW ONE',
  font:{fontSize:40}
}));

view1.add(Ti.UI.createButton({
  title:'button',
  width:100,
  height:40,
  top:30,
  backgroundColor:'white',
  tintColor:'red',
  borderColor:'yellow',
  borderWidth:10
}));


var view2 = Ti.UI.createView({
  height:460,
  width:320,
  backgroundColor:'blue'
});

view2.add(Ti.UI.createLabel({
  text:'VIEW TWO',
  font:{fontSize:40}
}));

var view3 = Ti.UI.createView({
  height:460,
  width:320,
  backgroundColor:'green'
});

view3.add(Ti.UI.createLabel({
  text:'VIEW THREE',
  font:{fontSize:40}
}));


fv = Flipium.createFlipView({
  views: [view1, view2, view3], // define views OR images+path
  
  //images: ["1.png", "2.png", "3.png"], 
  //path: "/example/",

  horizontal: false,
  cacheOnLoad: false,
  duration: 500,
  height: 460  
});

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

dv.addEventListener('tap', function(e){
  Ti.API.info('dragview "tap" event ');
  Ti.API.info(e);

});

win = Ti.UI.createWindow({
  top:20,
  backgroundColor: "#fff",
  backgroundImage: "bg.jpg",
  navBarHidden: true  
});

win.add(fv);
win.add(dv);
//win.add(view1);
win.open();