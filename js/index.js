var drag = document.getElementById('drag'),
    title = document.getElementsByClassName('title')[0],
    box = document.getElementsByClassName('box')[0],
    btnBox = document.getElementsByClassName('btn-box')[0],
    dotBox = document.getElementsByClassName('dot-box')[0],
    dots = document.getElementsByClassName('dot'),
    dotUp = document.getElementsByClassName('up')[0],
    dotDown = document.getElementsByClassName('down')[0],
    dotLeft = document.getElementsByClassName('left')[0],
    dotRight = document.getElementsByClassName('right')[0],
    loading = document.getElementsByClassName('loading')[0],
    sx = 0,
    sy = 0,
    swidth = 0,
    sheight = 0,
    canvas = document.createElement('canvas'),
    context = canvas.getContext('2d'),
    clipBtn = document.getElementsByClassName('clip-btn')[0],
    wrapperObj = document.getElementsByClassName('wrapper')[0],
    imgObj = document.getElementsByClassName('clip-img')[0],
    widthScale = 1, // 实际图片宽度 / 显示图片宽度
    heightScale = 1,    // 实际图片高度 / 显示图片高度
    imgPath = './images/yamap.jpg',
    img = new Image(),
    boxWidth = 300, // 页面显示盒子的宽度（px）
    cliped = false, // 是否已裁剪
    clipConfig = {  // 裁剪配置对象
        scale: 1 / 1,   // 设定初始裁剪框比例（宽 / 高）
        fixScale: true   // 是否固定裁剪框比例
    },
    imgScale;   // 图片自身的比例（宽 / 高）
    
// 裁剪框比例不存在时，设定默认比例
if (!clipConfig.scale) {
    clipConfig.scale = 1 / 1;
}

// 设置显示盒子的宽度
if (boxWidth > document.body.clientWidth) {
    boxWidth = document.body.clientWidth;
}
box.style.width = boxWidth + 'px';
btnBox.style.width = box.style.width;
title.style.width = box.style.width;
// 设置需要裁剪的图片对象的源，用于裁剪查看
imgObj.src = imgPath;
// 设置创建的图片对象的源，用于获取图片原尺寸
img.src = imgPath;

window.onload = function() {
    imgScale = imgObj.width / imgObj.height;
    if (imgScale >= clipConfig.scale) {
        drag.style.top = 0;
        drag.style.left = ((imgObj.width - imgObj.height * clipConfig.scale) / 2) + 'px';
        drag.style.height = imgObj.height + 'px';
        drag.style.width = (imgObj.height * clipConfig.scale) + 'px';
    } else {
        drag.style.left = 0;
        drag.style.top = ((imgObj.height - imgObj.width / clipConfig.scale) / 2) + 'px';
        drag.style.width = imgObj.width + 'px';
        drag.style.height = (imgObj.width / clipConfig.scale) + 'px';
    }

    // 获取裁剪坐标原点
    sx = (imgObj.width - drag.offsetWidth) / 2;
    sy = (imgObj.height - drag.offsetHeight) / 2;

    // 设定剪裁框外阴影（遮罩）
    drag.style.outline = 'rgba(0, 0, 0, .5) solid ' + (imgObj.width > imgObj.height ? imgObj.width : imgObj.height) + 'px';

    // 获取显示图与实际图的宽高缩放比
    widthScale = img.width / imgObj.width;
    heightScale = img.height / imgObj.height;

    // 隐藏加载层
    loading.style.display = 'none';
}

// 遍历裁剪框缩放点对象
for (var i = 0; i < dots.length; i++) {
    dots[i].onmousedown = function(event) {
        var _this = this;
        var ev = event || window.event;
        var distanceX = ev.clientX - drag.offsetLeft;
        var distanceY = ev.clientY - drag.offsetTop;
        var left = 0;
        var top = 0;
        var width = 0;
        var height = 0;
        var deltaLeft = 0;
        var deltaTop = 0;
        var oldLeft = drag.offsetLeft;
        var oldTop = drag.offsetTop;
        var moveWidth = 0;
        var moveHeight = 0;
        var originalLeft = drag.offsetLeft;
        var originalTop = drag.offsetTop;
        var originalWidth = Number(drag.style.width.replace(/px/g, ''));
        var originalHeight = Number(drag.style.height.replace(/px/g, ''));
        wrapperObj.onmousemove = function(event) {
            var e = event || window.event;
            left = e.clientX - distanceX;
            top = e.clientY - distanceY;

            deltaLeft = left - oldLeft; // 与上次left差值
            deltaTop = top - oldTop;
            oldLeft = left; // 本次left赋值给上次left
            oldTop = top;
            moveWidth = left - originalLeft;    // 计算移动的宽度
            moveHeight = top - originalTop;

            if (clipConfig.fixScale == true) {
                // 计算移动后宽高比与裁剪框宽高比的大小。
                if (Math.abs(moveWidth / moveHeight) > clipConfig.scale) {
                    left =  moveHeight * clipConfig.scale + originalLeft;
                    width = originalWidth - moveHeight * clipConfig.scale;
                    height = originalHeight - moveHeight;
                } else if ((Math.abs(moveWidth / moveHeight) < clipConfig.scale)) {
                    top = moveWidth / clipConfig.scale + originalTop;
                    width = originalWidth - moveWidth;
                    height = originalHeight - moveWidth / clipConfig.scale;
                } else {
                    width = originalWidth - moveWidth;
                    height = originalHeight - moveHeight;
                }
            } else {
                width = Number(drag.style.width.replace(/px/g, ''));    // 获取当前裁剪框宽度
                height = Number(drag.style.height.replace(/px/g, ''));
            }

            if (left < 0) {
                left = 0;
            } else if (left > box.offsetWidth) {
                left = box.offsetWidth;
            }
            if (top < 0) {
                top = 0;
            } else if (top > box.offsetHeight) {
                top = box.offsetHeight;
            }
            if (width < 0) {
                width = 0;
            } else if (width > box.offsetWidth) {
                width = box.offsetWidth;
            }
            if (height < 0) {
                height = 0;
            } else if (height > box.offsetHeight) {
                height = box.offsetHeight;
            }

            // 上
            if (_this.className == 'up dot') {
                if (!clipConfig.fixScale) {
                    height -= deltaTop;
                    if (height > (box.offsetHeight - drag.offsetTop)) {
                        height = box.offsetHeight - drag.offsetTop;
                    }
                    drag.style.top = top + 'px';
                    drag.style.height = height + 'px';
                }
            // 右
            } else if (_this.className == 'right dot') {
                if (!clipConfig.fixScale) {
                    width += deltaLeft;
                    if (width > (box.offsetWidth - drag.offsetLeft)) {
                        width = box.offsetWidth - drag.offsetLeft;
                    }
                    drag.style.width = width + 'px';
                }
            // 下
            } else if (_this.className == 'down dot') {
                if (!clipConfig.fixScale) {
                    height += deltaTop;
                    if (height > (box.offsetHeight - drag.offsetTop)) {
                        height = box.offsetHeight - drag.offsetTop;
                    }
                    drag.style.height = height + 'px';
                }
            // 左
            } else if (_this.className == 'left dot') {
                if (!clipConfig.fixScale) {
                    width -= deltaLeft;
                    if (width > (box.offsetWidth - drag.offsetLeft)) {
                        width = box.offsetWidth - drag.offsetLeft;
                    }
                    drag.style.left = left + 'px';
                    drag.style.width = width + 'px';
                }
            // 左上
            } else if (_this.className == 'left-up dot') {
                if (clipConfig.fixScale) {
                    if (drag.style.top.replace(/px/g, '') > 0 && drag.style.top.replace(/px/g, '') < box.offsetHeight) {
                        drag.style.left = left + 'px';
                        drag.style.width = width + 'px';
                    }
                    if (drag.style.left.replace(/px/g, '') > 0 && drag.style.left.replace(/px/g, '') < box.offsetWidth) {
                        drag.style.top = top + 'px';
                        drag.style.height = height + 'px';
                    }
                } else {
                    width -= deltaLeft;
                    if (width > (box.offsetWidth - drag.offsetLeft)) {
                        width = box.offsetWidth - drag.offsetLeft;
                    }
                    height -= deltaTop;
                    if (height > (box.offsetHeight - drag.offsetTop)) {
                        height = box.offsetHeight - drag.offsetTop;
                    }

                    drag.style.left = left + 'px';
                    drag.style.top = top + 'px';
                    drag.style.width = width + 'px';
                    drag.style.height = height + 'px';
                }
            // 右上
            } else if (_this.className == 'right-up dot') {
                if (clipConfig.fixScale) {

                } else {
                    width += deltaLeft;
                    if (width > (box.offsetWidth - drag.offsetLeft)) {
                        width = box.offsetWidth - drag.offsetLeft;
                    }
                    height -= deltaTop;
                    if (height > (box.offsetHeight - drag.offsetTop)) {
                        height = box.offsetHeight - drag.offsetTop;
                    }

                    drag.style.top = top + 'px';
                    drag.style.width = width + 'px';
                    drag.style.height = height + 'px';
                }
            // 左下
            } else if (_this.className == 'left-down dot') {
                if (clipConfig.fixScale) {

                } else {
                    width -= deltaLeft;
                    if (width > (box.offsetWidth - drag.offsetLeft)) {
                        width = box.offsetWidth - drag.offsetLeft;
                    }
                    height += deltaTop;
                    if (height > (box.offsetHeight - drag.offsetTop)) {
                        height = box.offsetHeight - drag.offsetTop;
                    }

                    drag.style.left = left + 'px';
                    drag.style.width = width + 'px';
                    drag.style.height = height + 'px';
                }
            // 右下
            } else if (_this.className == 'right-down dot') {
                if (clipConfig.fixScale) {

                } else {
                    width += deltaLeft;
                    if (width > (box.offsetWidth - drag.offsetLeft)) {
                        width = box.offsetWidth - drag.offsetLeft;
                    }
                    height += deltaTop;
                    if (height > (box.offsetHeight - drag.offsetTop)) {
                        height = box.offsetHeight - drag.offsetTop;
                    }

                    drag.style.width = width + 'px';
                    drag.style.height = height + 'px';
                }
            }
        }
    }
}

// 鼠标点击裁剪框
drag.onmousedown = function(event) {
    event.stopPropagation();
    if (event.type == 'mousedown' && event.target != dotBox) {
        return;
    }
    var ev = event || window.event;
    var distanceX = ev.clientX - drag.offsetLeft;
    var distanceY = ev.clientY - drag.offsetTop;
    var left = 0;
    var top = 0;
    // 鼠标经过容器
    wrapperObj.onmousemove = function(event) {
        event.stopPropagation();
        var e = event || window.event;
        left = e.clientX - distanceX;
        top = e.clientY - distanceY;
        if (left < 0) {
            left = 0;
        } else if (left > (box.offsetWidth - drag.offsetWidth)) {
            left = box.offsetWidth - drag.offsetWidth;
        }
        if (top < 0) {
            top = 0;
        } else if (top > (box.offsetHeight - drag.offsetHeight)) {
            top = box.offsetHeight - drag.offsetHeight;
        }
        drag.style.left = left + 'px';
        drag.style.top = top + 'px';
    };
};

// 开始触碰裁剪框
drag.ontouchstart = function(event) {
    event.stopPropagation();
    if (event.type == 'touchstart' && event.target != dotBox) {
        return;
    }
    var ev = event || window.event;
    var distanceX = ev.touches[0].clientX - drag.offsetLeft;
    var distanceY = ev.touches[0].clientY - drag.offsetTop;
    var left = 0;
    var top = 0;
    // 触碰后移动裁剪框
    wrapperObj.ontouchmove = function(event) {
        event.stopPropagation();
        var e = event || window.event;
        left = e.touches[0].clientX - distanceX;
        top = e.touches[0].clientY - distanceY;
        if (left < 0) {
            left = 0;
        } else if (left > (box.offsetWidth - drag.offsetWidth)) {
            left = box.offsetWidth - drag.offsetWidth;
        }
        if (top < 0) {
            top = 0;
        } else if (top > (box.offsetHeight - drag.offsetHeight)) {
            top = box.offsetHeight - drag.offsetHeight;
        }
        drag.style.left = left + 'px';
        drag.style.top = top + 'px';
    };
};

wrapperObj.addEventListener('mouseup', cancelWrapperObjMove.bind(this));
wrapperObj.addEventListener('touchend', cancelWrapperObjMove.bind(this));
function cancelWrapperObjMove(e) {
    e.stopPropagation();
    wrapperObj.onmousemove = null;
}

// 裁剪按钮、双击裁剪框、enter键裁剪
clipBtn.addEventListener('click', clip.bind(this));
drag.addEventListener('dblclick', clip.bind(this));
document.onkeydown = function(ev) {
    var e = ev || window.event,
        key = e.keyCode,
        position = 0,
        deltaWidth = 0,
        deltaHeight = 0;
    switch (key) {
        // 按了←键
        case 37:
            position = drag.style.left.replace(/px/g, '');
            position--;
            if (position < 0) {
                position = 0;
            }
            drag.style.left = position + 'px';
            break;
        // 按了↑键
        case 38:
            position = drag.style.top.replace(/px/g, '');
            position--;
            if (position < 0) {
                position = 0;
            }
            drag.style.top = position + 'px';
            break;
        // 按了→键
        case 39:
            position = drag.style.left.replace(/px/g, '');
            deltaWidth = imgObj.width - drag.style.width.replace(/px/g, '');
            position++;
            if (position > deltaWidth) {
                position = deltaWidth;
            }
            drag.style.left = position + 'px';
            break;
        // 按了↓键
        case 40:
            position = drag.style.top.replace(/px/g, '');
            deltaHeight = imgObj.height - drag.style.height.replace(/px/g, '');
            position++;
            if (position > deltaHeight) {
                position = deltaHeight;
            }
            drag.style.top = position + 'px';
            break;
        // 按了enter键
        case 13:
            clip(e);
            break;
        default:
            console.log('keycode = ' + key);
    }
}

function clip(e) {
    e.stopPropagation();
    // 若未双击事件，且目标非裁剪框时直接返回
    if (e.type == 'dblclick' && e.target != dotBox) {
        return;
    }
    if (cliped) {
        return;
    }
    cliped = true;
    if (drag.style.left) {
        sx = drag.style.left.replace(/px/g, '');
    }
    if (drag.style.top) {
        sy = drag.style.top.replace(/px/g, '');
    }
    // 根据裁剪框获取裁剪尺寸
    swidth = drag.offsetWidth;
    sheight = drag.offsetHeight;

    console.log('dragObj：sx = ' + sx + ' | sy = ' + sy + ' | swidth = ' + swidth + ' | sheight = ' + sheight);
    console.log('imgObj：x = ' + 0 + ' | y = ' + 0 + ' | width = ' + imgObj.width + ' | height = ' + imgObj.height);
    console.log('newImg(after clip)：width = ' + swidth * widthScale + ' | height = ' + sheight * heightScale);
    console.log('img(before clip)：width = ' + imgObj.width * widthScale + ' | height = ' + imgObj.height * heightScale);
    
    // 裁剪时对尺寸根据比例还原，基于原尺寸裁剪
    canvas.width = swidth * widthScale;
    canvas.height = sheight * widthScale;
    context.drawImage(imgObj, sx * widthScale, sy * heightScale, swidth * widthScale, sheight *  heightScale, 0, 0, swidth * widthScale, sheight * heightScale);

    // 图片展示时，根据裁剪框尺寸展示（不按剪裁的尺寸展示）
    var newImg = new Image();
    newImg.src = canvas.toDataURL('image/jpeg', 1);
    newImg.width = swidth;
    newImg.height = sheight;
    box.innerHTML = '';
    box.appendChild(newImg);
    btnBox.innerHTML = '<div>Clip successed! <a href="' + window.location.href.split('\?')[0] + '?&t=' + new Date().getTime() + '">Try it once ?</a></div>';
}
