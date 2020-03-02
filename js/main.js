window.onload = () => {
  class Block {
    constructor(x, y, c) {
      this.x = x;
      this.y = y;
      this.color = c;
      this.focus = false;
      this.fallow = false;
      this.display = false;
      this.ay = 0;
      this.gy = 0;
    }
  }
  class ScoreText {
    constructor(x, y, t) {
      this.x = x;
      this.y = y;
      this.text = t;
    }
  }
  class Button {
    constructor(t, x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.text = t;
      this.color = "#FFD300"
      this.font = "bold 微软雅黑"
      this.focus = false;
      this.clickF = null;
      this.active = false;
    }
    draw() {
      if ((sInterface === true || menuC === true) && this.active === false && this.click !== null) {
        document.addEventListener('click', this.click);
        this.active = true;
      }
      if (this.focus === true) {
        drawRect(this.color, this.x - 20, this.y - 5, this.w + 40, this.h + 10);
        drawText(25 + "px " + this.font, "#000", this.text, this.x + this.w / 2, this.y + this.h / 2, "center");
      }
      else {
        drawRect(this.color, this.x, this.y, this.w, this.h);
        drawText(20 + "px " + this.font, "#000", this.text, this.x + this.w / 2, this.y + this.h / 2, "center")
      }
    }
    inThisButton(x, y) {
      if (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h) {
        return true;
      }
      else {
        return false;
      }
    }
  }
  var j;
  var victory = new Audio("sound/victory.mp3");
  var good = new Audio("sound/good.wav");
  var perfect = new Audio("sound/perfect.wav");
  var click = new Audio("sound/click.wav");
  var bgm = new Audio("music/LuvLetter.mp3");
	setCookie("score",500);
	
  function reset() {
    victory.pause();
    victory.currentTime = 0;
    bgm.loop = true;
    bgm.volume = 0.2;
    click.volume = 0.2;
    victory.volume = 0.2;

    vFlag = false;

    color1 = ["rgba(7,128,207,1)", "rgba(118,80,5,1)", "rgba(250,109,29,1)", "rgba(14,44,130,1)", "rgba(182,181,31,1)", "rgba(218,31,24,1)"];
    colorC1 = ["rgba(7,128,207,1)", "rgba(118,80,5,1)", "rgba(250,109,29,1)", "rgba(14,44,130,1)", "rgba(182,181,31,1)", "rgba(218,31,24,1)"];
    color2 = ["rgba(7,128,207, 0.5)", "rgba(118,80,5, 0.5)", "rgba(250,109,29, 0.5)", "rgba(14,44,130, 0.5)", "rgba(182,181,31, 0.5)", "rgba(218,31,24, 0.5)"];
    buttonText = ["音乐：开", "音效：开", "重新开始", "返回主菜单"]

    gameCanvas = document.getElementById("gameCanvas");
    ctx = gameCanvas.getContext("2d");
    gameCanvas.width = 700;
    gameCanvas.height = 700;

    size = 30;
    space = 60;
    score = 0;
    console.log(document.cookie.substring(6,document.cookie.length))
    maxScroe = parseInt(document.cookie.substring(6,document.cookie.length));
    lastGetScroe = 0;

    aimScroe = 10000;
    controlTimes = 20;

    chooseBlock = [];
    block = [];
    scoreTextBox = [];
    menuButton = [];

    mouseD = false;
    control = true;
    menuC = false;
    sInterface = false;
    soundOff = false;
    musicOff = false;
    deal = 0;
    beginTime = 0;
    animationTime = 0;

    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {
        x = 65 + j * space
        y = 65 + i * space
        c = Math.floor(Math.random() * 3);
        block[i * 10 + j] = new Block(x, y, c);
      }
    }

    menuButton[0] = new Button(buttonText[0], 200, 100 + 50, 300, 50)
    menuButton[0].click = () => {
      var e = event || window.event || arguments.callee.caller.arguments[0];
      let x = e.offsetX;
      let y = e.offsetY;
      if (menuButton[0].inThisButton(x, y)) {
        musicOff = !musicOff;
        if (!soundOff)
          click.play();
      }
      if (musicOff)
        menuButton[0].text = "音乐：关"
      else
        menuButton[0].text = "音乐：开"
    }
    menuButton[1] = new Button(buttonText[1], 200, 200 + 50, 300, 50)
    menuButton[1].click = () => {
      var e = event || window.event || arguments.callee.caller.arguments[0];
      let x = e.offsetX;
      let y = e.offsetY;
      if (menuButton[1].inThisButton(x, y)) {
        soundOff = !soundOff;
        if (!soundOff)
          click.play();
      }
      if (soundOff)
        menuButton[1].text = "音效：关"
      else
        menuButton[1].text = "音效：开"
    }
    menuButton[2] = new Button(buttonText[2], 200, 300 + 50, 300, 50)
    menuButton[2].click = () => {
      var e = event || window.event || arguments.callee.caller.arguments[0];
      let x = e.offsetX;
      let y = e.offsetY;
      if (menuButton[2].inThisButton(x, y)) {
        reset();
        if (!soundOff)
          click.play();
      }
    }
    menuButton[3] = new Button(buttonText[3], 200, 400 + 50, 300, 50)
    menuButton[3].click = () => {
      var e = event || window.event || arguments.callee.caller.arguments[0];
      let x = e.offsetX;
      let y = e.offsetY;
      if (menuButton[3].inThisButton(x, y)) {
        if (!soundOff)
          click.play();
        window.location.href="主页.html";
      }
    }

    document.onkeydown = (event) => {
      var e = event || window.event || arguments.callee.caller.arguments[0];
      if ((control === true || menuC === true) && e && e.keyCode === 27) { // 按 Esc 
        menuC = !menuC;
        control = !control;
        if (menuC === false)
          for (var i = 0; i < menuButton.length; i++) {
            menuButton[i].focus = false;
            menuButton[i].active = false;
            document.removeEventListener("click", menuButton[i].click)
          }
        for (var i = 0; i < block.length; i++)
          block[i].focus = false;
        chooseBlock = []
      }
    };
    bgm.play();
  }

  reset();

  setInterval(() => {
    drawCanvas();
    if (control === true) {
      if (controlTimes === 0) {
        control = false;
        sInterface = true;
        document.onkeydown = () => { }
      } else {
        play();
      }
    }
    else
      if (deal === 1)
        scoreDisplay();
      else if (deal === 2)
        oldBlockMove();
      else if (deal === 3)
        addNewBlock();
    if (musicOff)
      bgm.pause();
    else
      bgm.play();
  }, 10)

  function scoreDisplay() {
    //计算得分位
    if (chooseBlock.length > 0) {
      beginTime = (new Date()).valueOf()
      var s = 0
      for (var i = 0; i < chooseBlock.length; i++) {
        scoreTextBox[i] = new ScoreText(block[chooseBlock[i]].x + size / 2, block[chooseBlock[i]].y + size / 2, 10 + i * 10);
        block[chooseBlock[i]] = null
        s += (i + 1) * 10;
      }
      score += s;
      lastGetScroe = s
      chooseBlock = []
    }
    for (var i = 0; i < scoreTextBox.length; i++) {
      drawText("16px bold 黑体", "#f00", "+" + scoreTextBox[i].text, scoreTextBox[i].x, scoreTextBox[i].y, "center");
    }
    if ((new Date()).valueOf() - beginTime >= 600) {
      beginTime = 0;
      deal = 2;
      scoreTextBox = [];
    }
  }

  function oldBlockMove() {
    //计算位移
    if (beginTime === 0) {
      beginTime = (new Date()).valueOf();
      animationTime = 0;
      for (var a = 0; a < 10; a++)
        for (var i = 99; i >= 0; i--) {
          if (block[i] === null && i - 10 >= 0) {
            block[i] = block[i - 10];
            if (block[i - 10] !== null) {
              block[i].ay = block[i].y;//初始
              block[i].gy += space;//经过
              block[i].fallow = true;
              if (block[i].gy / 60 * 200 + 100 > animationTime + 100)
                animationTime = block[i].gy / 60 * 200 + 100
            }
            block[i - 10] = null;
          }
        }
    }
    //动画
    for (var i = 99; i >= 0; i--) {
      if (block[i] !== null) {
        if (block[i].fallow === true) {
          block[i].y = block[i].ay + ((new Date()).valueOf() - beginTime) * 60 / 200;
          if (((new Date()).valueOf() - beginTime) * 60 / 200 >= block[i].gy) {
            block[i].y = block[i].ay + block[i].gy;
            block[i].fallow = false;
            block[i].ay = 0;
            block[i].gy = 0;
          }
        }
      }
    }
    //动画结束判定
    if ((new Date()).valueOf() - beginTime >= animationTime - 1) {
      beginTime = 0;
      deal = 3;
    }
  }

  function addNewBlock() {
    if (beginTime === 0) {
      beginTime = (new Date()).valueOf();
      for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
          if (block[i * 10 + j] === null) {
            x = 65 + j * space
            y = 65 + i * space
            c = Math.floor(Math.random() * 3);
            block[i * 10 + j] = new Block(x, y, c);
            block[i * 10 + j].display = true;
          }
        }
      }
    }
    //动画
    for (var i = 99; i >= 0; i--) {
      if (block[i].display === true) {
        var obj = JSON.stringify(colorC1[block[i].color])
        objClone = JSON.parse(obj)
        aaa = objClone.substring(0, objClone.length - 2);
        time = (new Date()).valueOf() - beginTime;
        if (time / 400 > 1) {
          c2 = aaa + 1 + ')';
          block[i].display = false;
        }
        else
          c2 = aaa + time / 400 + ')';
        //console.log(c2)
        drawRect(c2, block[i].x, block[i].y, size, size)
      }
    }
    if ((new Date()).valueOf() - beginTime >= 420) {
      control = true;
      beginTime = 0;
      deal = 0;
    }
  }

  function play() {
    if (mouseD === true) {
      for (var i = 0; i < chooseBlock.length; i++) {
        if (chooseBlock[i] !== null)
          drawRect("rgba(255,255,255, 0.5)", block[chooseBlock[i]].x - 10, block[chooseBlock[i]].y - 10, size + 20, size + 20)
      }
      for (var i = 0; i < chooseBlock.length; i++) {
        if (chooseBlock[i] !== null)
          if (i === chooseBlock.length - 1)
            drawLine("rgba(0,0,0, 0.5)", block[chooseBlock[i]].x + size / 2, block[chooseBlock[i]].y + size / 2, x, y)
          else {
            if (chooseBlock[i + 1] !== null)
              drawLine("rgba(0,0,0, 0.5)", block[chooseBlock[i]].x + size / 2, block[chooseBlock[i]].y + size / 2, block[chooseBlock[i + 1]].x + size / 2, block[chooseBlock[i + 1]].y + size / 2)
          }
      }
    }
  }
  function drawCanvas() {
    ctx.clearRect(0, 0, 700, 700);
    for (var i = 0; i < block.length; i++) {
      if (block[i] !== null && block[i].display === false) {
        drawRect(color1[block[i].color], block[i].x, block[i].y, size, size);
        if (block[i].focus === true) {
          drawRect(color2[block[i].color], block[i].x - 10, block[i].y - 10, size + 20, size + 20);
        }
        //drawText("10px bold 黑体", "#ff0", block[i].ay + ' ' + block[i].gy, block[i].x + size / 2, block[i].y + size / 2, "center");
      }
    }
    drawText("15px bold 黑体", "#000", "得分：" + score + ' (+' + lastGetScroe + ')', 30, 35, "left");
    drawText("15px bold 黑体", "#000", "剩余操作次数：" + controlTimes, 290, 35, "left");
    drawText("15px bold 黑体", "#000", "剩余时间：无限", 560, 35, "left");
    drawText("15px bold 黑体", "#000", "按ESC打开/关闭菜单", 350, 670, "center");
    drawText("15px bold 黑体", "#000", "最高分：" + maxScroe, 30, 670, "left");
    //drawText("15px bold 黑体", "#000", "目标得分：" + aimScroe, 560, 670, "left");
    if (menuC === true) {
      drawRect("rgba(255,255,255, 0.9)", 0, 0, 700, 700);
      for (var i in menuButton) {
        menuButton[i].draw();
      }
    }
    else if (sInterface === true) {
      if (!vFlag) {
        victory.play();
        musicOff = true;
        vFlag = true;
      }
      drawRect("rgba(255,255,255, 0.9)", 0, 0, 700, 700);
      drawText(30 + "px " + "bold 黑体", "#000", "最终得分", 350, 100, "center")
      drawText(80 + "px " + "bold 黑体", "#f00", score, 350, 235, "center")
      if (score > maxScroe) {
        drawText(20 + "px " + "bold 黑体", "#f00", "新纪录!", 350, 150, "center");
        setCookie("score",score)
      }
      for (var i in menuButton) {
        if (i >= 2)
          menuButton[i].draw();
      }
    }
  }
	function setCookie(name, value) { 
        document.cookie = name + "=" + escape(value);
        //console.log(document.cookie);
   }
	
  function drawText(font, color, text, x, y, a) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = a;
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
  }
  function drawLine(c, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 5; //线的宽度
    ctx.strokeStyle = c; //线的颜色
    ctx.lineCap = 'round'; //线的两头圆滑
    ctx.stroke();
    ctx.closePath();
  }
  function drawRect(c, x, y, w, h) {
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
    ctx.closePath();
  }
  gameCanvas.onmousemove = () => {
    x = event.offsetX;
    y = event.offsetY;
    if (control === true) {
      for (var i = 0; i < block.length; i++) {
        if (block[i] !== null)
          if (x >= block[i].x && x <= block[i].x + size && y >= block[i].y && y <= block[i].y + size) {
            block[i].focus = true;
            if (mouseD === true && chooseBlock.indexOf(i) === -1 && chooseBlock.length > 0) {
              if (block[i].color === block[chooseBlock[0]].color) {
                index = chooseBlock[chooseBlock.length - 1]
                if (i === index + 1 || i === index - 1 || i === index + 10 || i === index - 10)
                  chooseBlock.push(i)
                else if (i === index + 9 || i === index - 9 || i === index + 11 || i === index - 11)
                  chooseBlock.push(i)
              }
            }
          } else {
            block[i].focus = false;
          }
      }
    }
    if (menuC === true || sInterface === true) {
      for (var i = 0; i < menuButton.length; i++) {
        if (menuButton[i].inThisButton(x, y)) {
          menuButton[i].focus = true;
        }
        else
          menuButton[i].focus = false;
      }
    }
  }
  gameCanvas.onmousedown = () => {
    if (control === true) {
      for (var i = 0; i < block.length; i++) {
        if (block[i] !== null)
          if (x >= block[i].x && x <= block[i].x + size && y >= block[i].y && y <= block[i].y + size) {
            chooseBlock.push(i)
            mouseD = true;
          }
      }
    }
  }
  document.onmouseup = () => {
    if (control === true) {
      mouseD = false;
      if (chooseBlock.length > 2) {
        //结算时间开始
        control = false;
        deal = 1;
        controlTimes -= 1;
        if (soundOff === false)
          if (chooseBlock.length > 7)
            perfect.play();
          else
            good.play();
      }
      else
        chooseBlock = []
    }
  }
}