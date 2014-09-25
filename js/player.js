/**
 * Created by yanbo.ai on 2014/9/25.
 * Player scripts
 */
function Player(options) {
    // check jquery APIs
    if (typeof $ === "undefined") {
        console.error("Jquery can't found.")
    }

    // check file APIs support.
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
        console.error("The File APIs are not fully supported in this browser.");
    }

    // check stmd
    if (typeof stmd === "undefined") {
        console.error("Standard markdown can't found.")
    }

    var markdown = "";
    var pages = [];
    var __index__ = -1;
    var onfocus = false;
//    var onerror = options.onerror;
//    var onwarning = options.onwarning;
    var parser = new stmd.DocParser();
    var renderer = new stmd.HtmlRenderer();
    var player = document.querySelector("#player");
    var dropZone = document.querySelector("#drop_zone");
    var playZone = document.querySelector("#play_zone");

    this.play = function (index) {
        __play__(index);
    };

    this.fullScreen = function (selector) {
        var element = document.querySelector(selector);
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    };

    var __play__ = function (index) {
        dropZone.style.display = "none";
        if (pages.length == 0 || __index__ === index) {
            return;
        }
        __index__ = index;
        playZone.innerHTML = pages[__index__];
    };

    var swipePlay = function (next) {
        var index = -1;
        if (next) {
            index = __index__ + 1
        } else {
            index = __index__ - 1
        }
        if (index < 0) {
            index = 0;
            return;
        } else if (index > pages.length - 1) {
            index = pages.length == 0 ? 0 : pages.length - 1;
            return;
        }
        __play__(index);
    };

    var parseMarkdown = function (markdown) {
        pages = renderer.render(parser.parse(markdown)).split(/<\s*hr\s*\/*\s*>/);
        console.log(pages);
    };

    var handleDragOver = function (event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
    };

    var handleFileSelect = function (event) {
        event.stopPropagation();
        event.preventDefault();

        var files = event.dataTransfer.files;
        var reader = new FileReader();
        reader.readAsBinaryString(files[0]);

        reader.onloadend = function (event) {
            if (event.target.readyState == FileReader.DONE) {
                markdown = event.target.result;
                parseMarkdown(markdown);
                __play__(0);
            }
        };
    };

    var handleKeyUp = function (event) {
        var keyCode = (typeof event.which === "number") ? event.which : event.keyCode;
        console.log(keyCode);
        if (27 == keyCode) {
            //esc
        } else if (37 == keyCode) {
            swipePlay(false)
        } else if (39 == keyCode) {
            swipePlay(true)
        }
    };

    player.addEventListener('dragover', handleDragOver, false);
    player.addEventListener('drop', handleFileSelect, false);

    window.addEventListener('keyup', handleKeyUp, false);

    console.log("Player init success.");
}