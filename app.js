// ========================================================================= //
//   EXAMPLE APP                                                             //
// ========================================================================= //

// Kosso : Added ability to use views.

// To do: Swap back to the original (potentially interactive) view after the flips.

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
  
  images: ["1.png", "2.png", "3.png"], 
  path: "/example/",

  horizontal: false,
  cacheOnLoad: false,
  duration: 500,
  height: 460  
});

dv = Flipium.createDragView(fv);


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