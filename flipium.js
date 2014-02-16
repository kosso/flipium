        //alert(txt);
(function() {
  var Flipium;

  Flipium = {};

  Flipium.createFlipView = function(opt) {
    var flipView;
    if (opt == null) opt = {};
    flipView = Ti.UI.createView({
      width: 320,
      height: 460,
      top: 0,
      flipping: 0,
      currentPage: 1,
      iphone: Ti.Platform.osname === "iphone",
      android: Ti.Platform.osname === "android",
      duration: 500,
      wholeDuration: true,
      horizontal: false,
      images: [],
      views:[],
      startPage: 1,
      path: "",
      cacheOnLoad: false,
      distance: 1000,
      offsetTop: 0,
      offsetLeft: 0,
      construct: function() {
        var flipToStartPage, flippers, i, image, view, key, value, _len, _ref, _ref2,
          _this = this;
        for (key in opt) {
          value = opt[key];
          this[key] = value;
        }
        this.hh = this.horizontal ? 1 : 0;
        this.vv = this.horizontal ? 0 : 1;
        if (this.android) {
          this.reset = Ti.UI.create2DMatrix();
          this.flipUp = this.reset.scale(this.vv, this.hh);
          this.flipDown = this.reset.scale(this.vv, this.hh, Math.pow(-1, this.hh), Math.pow(-1, this.vv));
          this.flipBackUp = this.reset.scale(Math.pow(-1, this.hh), Math.pow(-1, this.vv), this.vv, this.hh);
          this.flipBackDown = this.reset.scale(this.vv, this.hh, 1, 1);
          this.flipAround = this.reset.scale(Math.pow(-1, this.hh), Math.pow(-1, this.vv));
        } else {
          this.reset = Ti.UI.create3DMatrix();
          this.reset.setM34(-1 / this.distance);
          this.flipUp = this.reset.rotate(Math.pow(-1, this.hh) * 89.9, this.vv, this.hh, 0);
          this.flipBackUp = this.reset.rotate(-Math.pow(-1, this.hh) * 89.9, this.vv, this.hh, 0);
          this.flipDown = this.reset;
        }
        
      // if (Ti.App.Properties.getBool("FlipCached", false)) {
      //  Ti.API.info("Reading flipcache");
      //   this.path = Ti.Filesystem.applicationDataDirectory + "/flipcache/";
      // } else if (this.cacheOnLoad) {
      
      // Commented out for testing

        if(this.views.length > 0){
          
          Ti.API.info("Using newly cached VIEWS");
          Ti.API.info(this.views);

          this.cacheViews();
          this.path = Ti.Filesystem.applicationDataDirectory + "/flipcache/";

          _ref = this.views;

        } else {
         
          Ti.API.info("Using newly cached IMAGES");
          Ti.API.info(this.images);
          this.cacheImages();
          this.path = Ti.Filesystem.applicationDataDirectory + "/flipcache/";

          _ref = this.images;

        }
      // } else {
      //  Ti.API.info("Loading from " + this.path);
      // }

        flippers = [Flipium.createFlipper(0, this)];
        
        for (i = 0, _len = _ref.length; i < _len; i++) {
          image = _ref[i];
          flippers.push(Flipium.createFlipper(i + 1, this));
        }
        this.flippers = flippers;
        for (i = _ref2 = flippers.length - 1; _ref2 <= 0 ? i <= 0 : i >= 0; _ref2 <= 0 ? i++ : i--) {
          this.add(flippers[i]);
        }
        this.flippers[0].swapImg();
        this.flippers[0].wrap.transform = this.flipDown;
        this.flippers[0].shadow.opacity = 0;
        if(this.views){
          this.totalPages = this.views.length;
        } else {
          this.totalPages = this.images.length;
        }
        flipToStartPage = function() {
          if (_this.currentPage < _this.startPage) {
            _this.flippers[_this.currentPage].flip(0);
            return _this.currentPage += 1;
          } else {
            return clearInterval(_this.startTimer);
          }
        };
        if (this.currentPage < this.startPage) {
          this.startTimer = setInterval(flipToStartPage, this.duration / 3);
        }
        this.width = this.width + this.offsetLeft;
        this.height = this.height + this.offsetTop;
        return this;
      },
      cacheViews: function() {
        var i, view, _len, _ref, _results;
        Ti.API.info("Caching views to flipcache");
        // Commented out for testing
        //Ti.App.Properties.setBool("FlipCached", true);
        _ref = this.views;
        _results = [];
        for (i = 0, _len = _ref.length; i < _len; i++) {
          Ti.API.info(_ref[i]);
          view = _ref[i];
          _results.push(this.cacheImageOfView(view, i + 1));
        }
        return _results;
      },

      cacheImages: function() {
        var i, image, _len, _ref, _results;
        Ti.API.info("Caching images to flipcache");
        // Commented out for testing
        //Ti.App.Properties.setBool("FlipCached", true);
        _ref = this.images;
        _results = [];
        for (i = 0, _len = _ref.length; i < _len; i++) {
          image = _ref[i];
          _results.push(this.cacheImg(image, i + 1));
        }
        return _results;
      },
      cacheImageOfView: function(view, index) {
        var appDir, dir, f;
        appDir = Ti.Filesystem.applicationDataDirectory;
        dir = Ti.Filesystem.getFile(appDir, "flipcache");
        dir.createDirectory();
        f = Ti.Filesystem.getFile(appDir + "/flipcache/", "img_" + index + "_" + (this.hh ? "l" : "t") + ".png");
        f.write(this.makeImg(view, "top"));
        f = Ti.Filesystem.getFile(appDir + "/flipcache/", "img_" + index + "_" + (this.hh ? "r" : "b") + ".png");
        f.write(this.makeImg(view, "bottom"));
        return f = null;
      },
      makeImg: function(view, position) {
        var crop, cont, postImg;
        crop = Ti.UI.createView({
          width: this.width / (1 + this.hh),
          height: this.height / (1 + this.vv),
          top: 0,
          left: 0
        });
 
        cont = Ti.UI.createView({
          width: this.width ,
          height: this.height,
          top: 0,
          left: 0
        });

        cont.add(view);
        crop.add(cont);
        if (position === "bottom" && this.hh) {
          cont.left = -this.width /  (2 - this.android);
        } else if (position === "bottom" && !this.hh) {
          cont.top = -this.height /  (2 - this.android);
        }
        if (!this.android) {
          return crop.toImage();
        } else {
          postImg = Ti.UI.createImageView({
            image: crop.toImage()
          });
          return postImg.toBlob();
        }
      },
      cacheImg: function(image, index) {
        var appDir, dir, f;
        appDir = Ti.Filesystem.applicationDataDirectory;
        dir = Ti.Filesystem.getFile(appDir, "flipcache");
        dir.createDirectory();
        f = Ti.Filesystem.getFile(appDir + "/flipcache/", "img_" + index + "_" + (this.hh ? "l" : "t") + ".png");
        f.write(this.cropImg(image, "top"));
        f = Ti.Filesystem.getFile(appDir + "/flipcache/", "img_" + index + "_" + (this.hh ? "r" : "b") + ".png");
        f.write(this.cropImg(image, "bottom"));
        return f = null;
      },
      cropImg: function(image, position) {
        var crop, img, postImg;
        crop = Ti.UI.createView({
          width: this.width * (2 - this.android) / (1 + this.hh),
          height: this.height * (2 - this.android) / (1 + this.vv),
          top: 0,
          left: 0
        });
        img = Ti.UI.createImageView({
          image: this.path + image,
          width: this.width * (2 - this.android),
          height: this.height * (2 - this.android),
          top: 0,
          left: 0
        });
        crop.add(img);
        if (position === "bottom" && this.hh) {
          img.left = -this.width / 2 * (2 - this.android);
        } else if (position === "bottom" && !this.hh) {
          img.top = -this.height / 2 * (2 - this.android);
        }
        if (!this.android) {
          return crop.toImage();
        } else {
          postImg = Ti.UI.createImageView({
            image: crop.toImage()
          });
          return postImg.toBlob();
        }
      },
      current: function() {
        return this.flippers[this.currentPage];
      },
      prev: function() {
        if (this.currentPage >= 0) {
          return this.flippers[this.currentPage - 1];
        } else {
          return false;
        }
      }
    });
    return flipView.construct();
  };

  Flipium.createFlipper = function(index, ff) {
    var flipper;
    flipper = Ti.UI.createView({
      width: ff.width,
      height: ff.height,
      top: ff.offsetTop,
      left: ff.offsetLeft,
      zIndex: -index,
      flipping: 0,
      img_b: Ti.UI.createImageView({
        image: ff.path + ("img_" + index + "_" + (ff.hh ? "r" : "b") + ".png"),
        width: ff.width / (1 + ff.hh),
        height: ff.height / (1 + ff.vv),
        top: 0,
        left: 0
      }),
      img_t: Ti.UI.createImageView({
        image: ff.path + ("img_" + (index + 1) + "_" + (ff.hh ? "l" : "t") + ".png"),
        width: ff.width / (1 + ff.hh),
        height: ff.height / (1 + ff.vv),
        top: 0,
        left: 0
      }),
      wrap: Ti.UI.createView({
        //borderWidth:2,
        //borderColor:'red',
        width: ff.width / (1 + ff.hh),
        height: ff.height / (1 + ff.vv),
        top: ff.hh ? 0 : ff.height / 2,
        left: ff.hh ? ff.width / 2 : 0,
        anchorPoint: ff.hh ? {
          x: 0,
          y: 0.5
        } : {
          x: 0.5,
          y: 0
        }
      }),
      darken: Ti.UI.createView({
        backgroundColor: "#000",
        width: ff.width / (1 + ff.hh),
        height: ff.height / (1 + ff.vv),
        top: 0,
        left: 0,
        opacity: 0
      }),
      shadow: Ti.UI.createView({
        backgroundColor: "#000",
        width: ff.width / (1 + ff.hh),
        height: ff.height / (1 + ff.vv),
        top: ff.hh ? 0 : ff.height / 2,
        left: ff.hh ? ff.width / 2 : 0,
        opacity: 1,
        zIndex: -1
      }),
      duration: ff.duration,
      index: index,
      prev: function() {
        if (this.index > 0) return ff.flippers[this.index - 1];
      },
      construct: function() {
        var _this = this;
        this.flipUpAnim = Ti.UI.createAnimation({
          transform: ff.flipUp,
          curve: !ff.android ? Ti.UI.ANIMATION_CURVE_EASE_OUT : void 0
        });
        this.flipDownAnim = Ti.UI.createAnimation({
          transform: ff.flipDown,
          curve: !ff.android ? Ti.UI.ANIMATION_CURVE_EASE_OUT : void 0
        });
        this.flipBackUpAnim = Ti.UI.createAnimation({
          transform: ff.flipBackUp,
          curve: !ff.android ? Ti.UI.ANIMATION_CURVE_EASE_OUT : void 0
        });
        this.flipBackDownAnim = Ti.UI.createAnimation({
          transform: ff.android ? ff.flipBackDown : ff.flipDown,
          curve: !ff.android ? Ti.UI.ANIMATION_CURVE_EASE_OUT : void 0
        });
        this.shadowOutAnim = Ti.UI.createAnimation({
          opacity: 0,
          curve: !ff.android ? Ti.UI.ANIMATION_CURVE_EASE_OUT : void 0
        });
        this.shadowInAnim = Ti.UI.createAnimation({
          opacity: 0.75,
          curve: !ff.android ? Ti.UI.ANIMATION_CURVE_EASE_IN : void 0
        });
        this.darkenOutAnim = Ti.UI.createAnimation({
          opacity: 0,
          curve: !ff.android ? Ti.UI.ANIMATION_CURVE_EASE_OUT : void 0
        });
        this.darkenInAnim = Ti.UI.createAnimation({
          opacity: 0.08,
          curve: !ff.android ? Ti.UI.ANIMATION_CURVE_EASE_IN : void 0
        });
        this.flipUpAnim.addEventListener("complete", function() {
          ff.flipping -= 1;
          _this.flipping -= 1;
          Ti.API.info('flipUpAnim complete');
          if (_this.flipping === 0) {
            if (!_this.flipped) _this.swapImg();
            return _this.flip(0.5);
          }
        });
        this.flipBackUpAnim.addEventListener("complete", function() {
          ff.flipping -= 1;
          _this.flipping -= 1;
          Ti.API.info('flipBackUpAnim complete');
          if (_this.flipping === 0) {
            if (_this.flipped) _this.swapImg(true);
            return _this.flip(0.5, true);
          }
        });
        this.flipDownAnim.addEventListener("complete", function() {
          ff.flipping -= 1;
          _this.flipping -= 1;
          _this.darken.opacity = 0;
          Ti.API.info('flipDownAnim complete');
          return _this.shadow.opacity = 0;
        });
        this.flipBackDownAnim.addEventListener("complete", function() {
          ff.flipping -= 1;
          _this.flipping -= 1;
          _this.darken.opacity = 0;
          Ti.API.info('flipBackDownAnim complete');
          if (_this.prev()) return _this.prev().darken.opacity = 0;
        });
        //this.img_t.add(Ti.UI.createLabel({top:10, text:'img_t '+index, color:'white'}));
        //this.img_b.add(Ti.UI.createLabel({bottom:10,text:'img_b '+index, color:'white'}));

        this.wrap.add(this.img_t);
        this.img_t.visible = false;
        this.wrap.add(this.img_b);
        this.wrap.add(this.darken);
        this.add(this.shadow);
        this.add(this.wrap);
        return this;
      },
      flip: function(y, reverse) {
        var dur;
        if (ff.android) {
          this.shadow.opacity = y <= 0.5 ? 0.6 - 3 * Math.pow(y, 2) : 0;
          this.darken.opacity = 0.08 - 0.32 * Math.pow(y - 0.5, 2);
          if (this.prev()) {
            this.prev().darken.opacity = y >= 0.5 ? 3 * Math.pow(y - 0.5, 2) : 0;
          }
        }
        if (y < 0.5 && !reverse) {
          dur = this.duration / 2;
          dur = dur * (1 - Math.pow(2 * y, 0.625));
          if (ff.android) {
            this.flipUpAnim.transform = ff.reset.scale(1 - 2 * y * ff.hh, 1 - 2 * y * ff.vv, ff.vv, ff.hh);
          }
          this.flipUpAnim.duration = dur;
          this.shadowOutAnim.duration = dur;
          this.darkenInAnim.duration = dur;
          this.wrap.animate(this.flipUpAnim);
          this.shadow.animate(this.shadowOutAnim);
          this.darken.animate(this.darkenInAnim);
        } else if (y >= 0.5 && !reverse) {
          dur = this.duration / 2;
          if (!ff.wholeDuration) {
            dur = dur * (1 - Math.pow(2 * y - 1, 0.625));
            if (this.index === 0) dur = dur * 2;
          }
          if (ff.android) {
            this.flipDownAnim.transform = ff.reset.scale(1 - 2 * y * ff.hh, 1 - 2 * y * ff.vv, Math.pow(-1, ff.hh), Math.pow(-1, ff.vv));
          }
          this.flipDownAnim.duration = dur;
          this.darkenOutAnim.duration = dur;
          this.wrap.animate(this.flipDownAnim);
          this.darken.animate(this.darkenOutAnim);
          if (this.prev()) {
            this.prev().shadowInAnim.duration = dur;
            this.prev().darken.animate(this.prev().shadowInAnim);
            if (ff.android) {
              this.prev().shadow.animate({
                opacity: 0
              });
              this.prev().animate({
                left: 0,
                duration: dur
              });
            }
          }
        } else if (y > 0.5 && reverse) {
          dur = this.duration / 2 * Math.pow(2 * y - 1, 0.625);
          if (ff.android) {
            this.flipBackUpAnim.transform = ff.reset.scale(1 - 2 * y * ff.hh, 1 - 2 * y * ff.vv, ff.vv, ff.hh);
          }
          this.flipBackUpAnim.duration = dur;
          this.darkenInAnim.duration = dur;
          this.wrap.animate(this.flipBackUpAnim);
          this.darken.animate(this.darkenInAnim);
          if (this.prev()) {
            this.prev().shadowOutAnim.duration = dur;
            this.prev().darken.animate(this.prev().shadowOutAnim);
            if (ff.android) {
              this.prev().shadow.animate({
                opacity: 0
              });
              this.prev().animate({
                left: 0,
                duration: dur
              });
            }
          }
        } else if (y <= 0.5 && reverse) {
          dur = this.duration / 2;
          if (!ff.wholeDuration) {
            dur = dur * Math.pow(2 * y, 0.625);
            if (this.index === ff.totalPages){
             Ti.API.info('end of array');
             dur = dur * 2;
            }
          }
          if (ff.android) {
            this.flipBackDownAnim.transform = ff.reset.scale(1 - 2 * y * ff.hh, 1 - 2 * y * ff.vv, 1, 1);
          }
          this.flipBackDownAnim.duration = dur;
          this.shadowInAnim.duration = dur;
          this.darkenOutAnim.duration = dur;
          this.wrap.animate(this.flipBackDownAnim);
          this.shadow.animate(this.shadowInAnim);
          this.darken.animate(this.darkenOutAnim);
        }
        ff.flipping += 1;
        return this.flipping += 1;
      },
      swapImg: function(reverse) {
        Ti.API.info('swapImg: '+reverse);
        if (reverse) {
          this.img_t.visible = false;
          this.img_b.visible = true;
          if (ff.android) {
            this.img_t.transform = ff.reset;
            this.img_t.top = 0;
            this.img_t.left = 0;
          } else {
            this.wrap.anchorPoint = ff.hh ? {
              x: 0,
              y: 0.5
            } : {
              x: 0.5,
              y: 0
            };
            this.wrap.transform = ff.flipUp;
            if (ff.hh) {
              this.wrap.left = ff.width / 2;
            } else {
              this.wrap.top = ff.height / 2;
            }
          }
          this.zIndex = -this.index;
        } else {
          this.img_t.visible = true;
          this.img_b.visible = false;
          if (ff.android) {
            this.img_t.transform = ff.flipAround;
            if (ff.hh) {
              this.img_t.left = ff.width / 2;
            } else {
              this.img_t.top = ff.height / 2;
            }
          } else {
            this.wrap.anchorPoint = ff.hh ? {
              x: 1,
              y: 0.5
            } : {
              x: 0.5,
              y: 1
            };
            this.wrap.transform = ff.flipBackUp;
            if (ff.hh) {
              this.wrap.left = 0;
            } else {
              this.wrap.top = 0;
            }
          }
          this.zIndex = this.index;
        }
        return this.flipped = !reverse;
      },
      stopFlipping: function() {
        var darken_to, dragMatrix, prev_to, shadow_to, y;
        if (this.flipped) {
          y = ff.android ? 0.8 : 0.7;
        } else {
          y = ff.android ? 0.2 : 0.3;
        }
        darken_to = 0.08 - 0.32 * Math.pow(y - 0.5, 2);
        shadow_to = y <= 0.5 ? 2.27 * Math.pow(0.5 - y, 1.6) : 0;
        prev_to = y >= 0.5 ? 2.27 * Math.pow(y - 0.5, 1.6) : 0;
        this.darken.animate({
          opacity: darken_to,
          duration: 1
        });
        this.shadow.animate({
          opacity: shadow_to,
          duration: 1
        });
        if (this.prev()) {
          this.prev().darken.animate({
            opacity: prev_to,
            duration: 1
          });
        }
        if (ff.android) {
          this.wrap.animate({
            opacity: 1,
            duration: 1
          });
        } else {
          if (y < 0.5) {
            dragMatrix = ff.reset.rotate(Math.pow(-1, ff.hh) * y * 180, ff.vv, ff.hh, 0);
          } else {
            dragMatrix = ff.reset.rotate(-Math.pow(-1, ff.hh) * (1 - y) * 180, ff.vv, ff.hh, 0);
          }
          this.wrap.animate({
            transform: dragMatrix,
            duration: 1
          });
        }
        return y;
      }
    });
    return flipper.construct();
  };

  Flipium.createDragView = function(ff, opt) {
    var dragView;
    if (opt == null) opt = {};
    dragView = Ti.UI.createView({
      width: ff.width,
      height: ff.height,
      top: 0,
      dragDistance: 230,
      dragThreshold: 0.5,
      initialDrag: 10,
      tapThreshold: 5,
      topLimit: 0.7,
      bottomLimit: 0.3,
      construct: function() {
        var key, value;
        for (key in opt) {
          value = opt[key];
          this[key] = value;
        }
        if (ff.android) {
          this.topLimit = Math.pow(this.topLimit, 0.625);
          this.bottomLimit = Math.pow(this.bottomLimit, 1.6);
        }
        this.addEventListener("touchstart", function(e) {
          this.startY = ff.hh ? e.x : e.y;
          this.startX = ff.hh ? e.y : e.x;
          return ff.dragging = true;
        });
        this.addEventListener("touchmove", function(e) {
          var darken_to, dragMatrix, ex, ey, prev_to, shadow_to, storeY, y,
            _this = this;
          ey = ff.hh ? e.x : e.y;
          ex = ff.hh ? e.y : e.x;
          if (Math.abs(this.startY - ey) > this.initialDrag && !this.dir) {
            if (Math.abs(this.startX - ex) < 1.2 * Math.abs(this.startY - ey)) {
              if (ey > this.startY) {
                this.dir = "down";
                this.flipper = ff.prev();
              } else {
                this.dir = "up";
                this.flipper = ff.current();
              }
              if (this.flipper.flipping > 0) {
                y = this.flipper.stopFlipping();
                this.startY = (y - (this.dir === "down")) * this.dragDistance + ey;
              }
              this.flipper.flipping += 1;
              this._y = ey;
            }
          }
          if (this.dir) {
            this.y = (this.dir === "down") + (this.startY - ey) / this.dragDistance;
            if (this.y < 0) this.y = 0;
            if (this.y > 1) this.y = 1;
            if (this.flipper.index === 0 && this.y < this.topLimit) {
              this.y = this.topLimit;
            }
            if (this.flipper.index === ff.totalPages && this.y > this.bottomLimit) {
              this.y = this.bottomLimit;
            }
            storeY = function() {
              return _this._y = ey;
            };
            this.timer = setTimeout(storeY, 200);
            darken_to = 0.08 - 0.32 * Math.pow(this.y - 0.5, 2);
            shadow_to = this.y <= 0.5 ? 2.27 * Math.pow(0.5 - this.y, 1.6) : 0;
            prev_to = this.y >= 0.5 ? 2.27 * Math.pow(this.y - 0.5, 1.6) : 0;
            if (ff.android) {
              if (ff.hh) {
                dragMatrix = ff.reset.scale(1 - 2 * this.y, 1);
              } else {
                dragMatrix = ff.reset.scale(1, 1 - 2 * this.y);
              }
              this.flipper.darken.animate({
                opacity: darken_to
              });
              this.flipper.shadow.animate({
                opacity: shadow_to
              });
              if (this.flipper.prev()) {
                this.flipper.prev().darken.animate({
                  opacity: prev_to
                });
              }
            } else {
              this.flipper.darken.opacity = darken_to;
              this.flipper.shadow.opacity = shadow_to;
              if (this.flipper.prev()) {
                this.flipper.prev().darken.opacity = prev_to;
              }
              if (this.y < 0.5) {
                dragMatrix = ff.reset.rotate(Math.pow(-1, ff.hh) * this.y * 180, ff.vv, ff.hh, 0);
              } else {
                dragMatrix = ff.reset.rotate(-Math.pow(-1, ff.hh) * (1 - this.y) * 180, ff.vv, ff.hh, 0);
              }
            }
            this.flipper.wrap.transform = dragMatrix;
            if (this.y > 0.5 && !this.flipper.flipped) {
              return this.flipper.swapImg();
            } else if (this.y < 0.5 && this.flipper.flipped) {
              return this.flipper.swapImg(true);
            }
          }
        });
        this.addEventListener("touchend", function(e) {
          var ex, ey, x2, y2;
          if (this.timer) clearInterval(this.timer);
          ey = ff.hh ? e.x : e.y;
          ex = ff.hh ? e.y : e.x;
          y2 = Math.pow(this.startY - ey, 2);
          x2 = Math.pow(this.startX - ex, 2);
          if (Math.pow(y2 + x2, 0.5) < 5) {
            return this.fireEvent("tap", e);
          } else if (this.dir) {
            if (this._y - ey > this.initialDrag && this.flipper.index < ff.totalPages) {
              this.flipper.flip(this.y);
              ff.currentPage += this.dir === "up";
            } else if (ey - this._y > this.initialDrag && this.flipper.index > 0) {
              this.flipper.flip(this.y, true);
              ff.currentPage -= this.dir === "down";
            } else if (this.y > this.dragThreshold) {
              this.flipper.flip(this.y);
              ff.currentPage += this.dir === "up";
            } else {
              this.flipper.flip(this.y, true);
              ff.currentPage -= this.dir === "down";
            }
            this.flipper.flipping -= 1;
            this.inertia = ff.dragging = false;
            this.y = 0;
            return this.dir = null;
          }
        });
        return this;
      }
    });
    return dragView.construct();
  };

  module.exports = Flipium;

}).call(this);
