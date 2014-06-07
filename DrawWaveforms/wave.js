$(document).ready(function() {
    var $waves = $("#board > ul");
    var board = document.getElementById("board");
    var $board = $(board);
    var $display = $("#display");

    var tag = "div", href = "";
    var textHover = false;
    if ($("html").hasClass("ie6")) {
        tag = "a"; href=" href='#'"; textHover = true;
    } else if ($("html").hasClass("ie7") || $("html").hasClass("ie8")) {
        textHover = true;
    }
    function getWaveHtml(length) {
        var str = "<li><input type='text' value='label'/><" + tag + " class='l end'" + href + "></" + tag + ">";
        var flag = true;
        for (var i = 0; i < length; i++) {
            if (flag) {
                str += "<div class='l2h'></div><" + tag + " class='h'" + href + "></" + tag + ">";
            } else {
                str += "<div class='h2l'></div><" + tag + " class='l'" + href + "></" + tag + ">";
            }
            flag = !flag;
        }
        if (flag) {
            str += "<div class='l2h'></div><" + tag + " class='h end'" + href + "></" + tag + "></li>";
        } else {
            str += "<div class='h2l'></div><" + tag + " class='l end'" + href + "></" + tag + "></li>";
        }
        return str;
    }

    function checkCanvas() {
        var canvas = document.createElement("canvas");
        if ("getContext" in canvas) {
            var cxt = canvas.getContext("2d");
            if ("fillText" in cxt && "toDataURL" in canvas) {
                return true;
            }
        }
        return false;
    }

    var initWaveHtml = getWaveHtml(8);
    $waves.append(initWaveHtml).append(initWaveHtml).append(initWaveHtml).append(initWaveHtml);
    var $selected = $waves.children(":first");
    $selected.addClass("selected");
    $waves.waveLength = 8;
    $waves.actualWidth = 267;

    var fullWidth = 638, fullHieght = 400, lineHeight = 24;
    function getData() {
        var data = [];
        data.width = $waves.actualWidth;
        data.height = $waves.outerHeight();
        data.waveNum = $waves.children().length;
        $waves.children().each(function() {
            var $wave = $(this);
            var datum = {};
            datum.label = $wave.children(":text").val();
            datum.value = "";
            if ($wave.children(tag + ":first").hasClass("h")) {
                datum.value += "h";
            } else {
                datum.value += "l";
            }
            $wave.children("div.h2h, div.h2l, div.l2l, div.l2h").each(function() {
                var $gap = $(this);
                if ($gap.hasClass("h2h") || $gap.hasClass("l2l")) {
                    datum.value += "s";
                } else {
                    datum.value += "c";
                }
            });
            data.push(datum);
        });
        return data;
    }
    function canvasDraw(data) {
        var canvas = document.createElement("canvas");
        var cxt = canvas.getContext("2d");
        canvas.width = data.width;
        canvas.height = data.height;
        cxt.font = "16px Georgia";
        cxt.textAlign = "right";
        cxt.save();
        cxt.translate(0.5, 0.5);

        var x = 0, y = 0, bottom = 15, top = 0;
        for (var i = 0; i < data.waveNum; i++) {
            var datum = data[i];
            //console.log(datum);
            bottom += 24;
            top = bottom - 20;
            x = 59; y = bottom;
            cxt.fillText(datum.label, x, y);
            cxt.beginPath();
            x = 70;
            var selfIsHigh = null;
            if (datum.value[0] == "h") {
                y = top;
                selfIsHigh = true;
            } else {
                y = bottom;
                selfIsHigh = false;
            }
            cxt.moveTo(x, y);
            x += 9;
            cxt.lineTo(x, y);
            var len = datum.value.length;
            for (var j = 1; j < len; j++) {
                if (datum.value[j] == "c") {
                    selfIsHigh = !selfIsHigh;
                    if (selfIsHigh) {
                        y = top;
                    } else {
                        y = bottom;
                    }
                    cxt.lineTo(x, y);
                }
                if (j == len - 1) {
                    x += 8;
                } else {
                    x += 20;
                }
                cxt.lineTo(x, y);
            }
            cxt.stroke();
        }
        $display.empty().append(canvas);
        var download = document.getElementById("download");
        download.href = canvas.toDataURL("png");
        download.download = "波形图.png";
    }
    function phpDraw(data) {
        var q = "";
        q += "?w=" + data.width + "&h=" + data.height + "&l=" + data.waveNum;
        for (var i = 0; i < data.waveNum; i++) {
            q += "&l" + i + "=" + data[i].label + "&v" + i + "=" + data[i].value;
        }
        $display.$img.attr("src", "diagram.php" + q);
    }
    var menu = {
        reset: function() {
            $waves.empty()
                .append(initWaveHtml).append(initWaveHtml).append(initWaveHtml).append(initWaveHtml)
                .width("");
            $selected = $waves.children(":first");
            $selected.addClass("selected");
            $waves.waveLength = 8;
            $waves.actualWidth = 267;
        },
        create: function() {
            $selected.after(getWaveHtml($waves.waveLength));
            if (board.clientWidth != fullWidth) {
                fullWidth = board.clientWidth;
                if ($waves.actualWidth <= fullWidth) {
                    $waves.outerWidth(fullWidth);
                } else {
                    $waves.outerWidth($waves.actualWidth);
                }
            }
        },
        drop: function() {
            var $candidate = null;
            if ($selected.next().length == 1) {
                $candidate = $selected.next();
            } else if ($selected.prev().length == 1) {
                $candidate = $selected.prev();
            } else {
                return;
            }
            $selected.remove();
            $selected = $candidate;
            $selected.addClass("selected");
            if (board.clientWidth != fullWidth) {
                fullWidth = board.clientWidth;
                if ($waves.actualWidth <= fullWidth) {
                    $waves.outerWidth(fullWidth);
                } else {
                    $waves.outerWidth($waves.actualWidth);
                }
            }
        },
        add: function() {
            $waves.waveLength++;
            $waves.actualWidth += 20;
            if ($waves.actualWidth > fullWidth) {
                $waves.outerWidth($waves.actualWidth);
            }

            $waves.children().each(function() {
                var $last = $(this).find(":last");

                $last.removeClass("end");
                if ($last.hasClass("h")) {
                    $last.after("<div class='h2l'></div><" + tag + " class='l end'" + href + "></" + tag + ">");
                } else {
                    $last.after("<div class='l2h'></div><" + tag + " class='h end'" + href + "></" + tag + ">");
                }
            });
        },
        sub: function() {
            if ($waves.waveLength <= 0) { return; }
            $waves.waveLength--;
            if ($waves.actualWidth > fullWidth) {
                $waves.actualWidth -= 20;
                if ($waves.actualWidth <= fullWidth) {
                    $waves.outerWidth(fullWidth);
                } else {
                    $waves.outerWidth($waves.actualWidth);
                }
            } else {
                $waves.actualWidth -= 20;
            }

            $waves.children().each(function() {
                $(this).children(":last").remove().end()
                    .children(":last").remove().end()
                    .children(":last").addClass("end");
            });
        },
        generate: function() {
            if (menu.isDirty) {
                var data = getData();
                if (menu.canvasState) {
                    canvasDraw(data);
                } else {
                    phpDraw(data);
                }
                menu.isDirty = false;
            }
            $board.hide();
            $display.show();
        },
        back: function() {
            $display.hide();
            $board.show();
        }
    };
    menu.canvasState = checkCanvas();
    menu.isDirty = true;
    menu.isReset = true;
    if (menu.canvasState) {
        menu.download = function() {
            if (menu.isDirty) {
                canvasDraw(getData());
            }
            menu.isDirty = false;
        };
    } else {
        $("#download").remove();
        $display.append("<div>下载提示：右键 -> 图片另存为</div><img/>");
        $display.$img = $display.children("img");
    }

    $("#head").on("click", ".button", function(event) {
        if ($(this).hasClass("disabled")) {
            event.preventDefault();
            return;
        }
        var cmd = this.getAttribute("cmd");
        if (cmd != "download" && tag == "a") { event.preventDefault(); }
        if (cmd == "create" || cmd == "drop" || cmd == "add" || cmd == "sub") {
            menu.isDirty = true;
            menu.isReset = false;
            $("#head :eq(0)").removeClass("disabled");
        }
        if (cmd == "reset") {
            menu.isDirty = true;
            menu.isReset = true;
            $("#head :eq(0)").addClass("disabled");
        }
        if (cmd == "generate") {
            $("#head :last").removeClass("disabled").siblings(":not(#download)").addClass("disabled");
        }
        if (cmd == "back") {
            $(this).addClass("disabled").siblings().removeClass("disabled");
            if (menu.isReset) {
                $("#head :eq(0)").addClass("disabled");
            }
        }
        menu[cmd]();
    });
    $board.on("click", ".h, .l", function(event) {
        if (tag == "a") { event.preventDefault(); }
        menu.isDirty = true;
        menu.isReset = false;
        $("#head :eq(0)").removeClass("disabled");
        var $line = $(this);
        var $left = $line.prev();
        var $right = $line.next();
        if ($line.hasClass("h")) {
            $line.removeClass("h").addClass("l");
        } else {
            $line.removeClass("l").addClass("h");
        }
        if ($left.length == 1) {
            switch ($left.attr("class")) {
                case "h2h": $left.removeClass().addClass("h2l"); break;
                case "l2l": $left.removeClass().addClass("l2h"); break;
                case "h2l": $left.removeClass().addClass("h2h"); break;
                case "l2h": $left.removeClass().addClass("l2l"); break;
            }
        }
        if ($right.length == 1) {
            switch ($right.attr("class")) {
                case "h2h": $right.removeClass().addClass("l2h"); break;
                case "l2l": $right.removeClass().addClass("h2l"); break;
                case "h2l": $right.removeClass().addClass("l2l"); break;
                case "l2h": $right.removeClass().addClass("h2h"); break;
            }
        }
    }).on("click", "li", function() {
        $selected.removeClass("selected");
        $selected = $(this);
        $selected.removeClass("liHover").addClass("selected");
    }).on("click", ":text", function() {
        $(this).select();
    }).on("change", ":text", function() {
        menu.isDirty = true;
        menu.isReset = false;
        $("#head :eq(0)").removeClass("disabled");
    });
    if (textHover) {
        $board.on("mouseenter", ":text", function() {
            $(this).css("color", "#E56758");
        }).on("mouseleave", ":text", function() {
            $(this).css("color", "black");
        });
    }
    if (tag == "a") {
        $board.on("mouseenter", "li", function() {
            $li = $(this);
            if (!$li.hasClass("selected")) {
                $li.addClass("liHover");
            }
        }).on("mouseleave", "li", function() {
            $(this).removeClass("liHover");
        });
    }
});
