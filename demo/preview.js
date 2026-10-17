(() => {
  const canvas=document.getElementById('source'), ctx=canvas.getContext('2d'), video=document.getElementById('demo-video');
  let tick=0;
  function paint(){
    tick++;
    ctx.fillStyle='#132b29';ctx.fillRect(0,0,1280,720);
    ctx.strokeStyle='#25473b';ctx.lineWidth=1;
    for(let x=0;x<1280;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,720);ctx.stroke();}
    for(let y=0;y<720;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(1280,y);ctx.stroke();}
    ctx.fillStyle='#203e35';
    for(let i=0;i<34;i++){let x=(i*347+151)%1280,y=(i*181+80)%720;ctx.beginPath();ctx.arc(x,y,25+i%4*9,0,7);ctx.fill();}
    ctx.strokeStyle='#3b6656';ctx.lineWidth=90;ctx.beginPath();ctx.moveTo(145,635);ctx.lineTo(145,135);ctx.lineTo(1135,135);ctx.lineTo(1135,635);ctx.closePath();ctx.stroke();
    ctx.strokeStyle='#47716a';ctx.lineWidth=65;ctx.beginPath();ctx.moveTo(145,635);ctx.lineTo(1135,135);ctx.stroke();
    ctx.strokeStyle='#7b9ca03b';ctx.lineWidth=35;ctx.beginPath();ctx.moveTo(380,0);ctx.bezierCurveTo(900,300,400,420,870,720);ctx.stroke();
    for(let i=0;i<10;i++){const x=440+(i*71)%370+Math.sin(tick/30+i)*30,y=280+(i*53)%230+Math.cos(tick/25+i)*15;ctx.fillStyle=i<5?'#80dbef':'#e0a16f';ctx.beginPath();ctx.arc(x,y,8,0,7);ctx.fill();ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=2;ctx.strokeRect(x-12,y-20,24,3);}
    ctx.fillStyle='#09131fe8';ctx.fillRect(260,0,760,65);ctx.textAlign='center';ctx.fillStyle='#a3b8c4';ctx.font='bold 20px system-ui';ctx.fillText('ALPHA',380,39);ctx.fillText('BRAVO',900,39);ctx.fillStyle='#fff';ctx.font='bold 28px system-ui';ctx.fillText('2  :  1',640,40);
    ctx.fillStyle='#c3d5d0';ctx.textAlign='left';ctx.font='13px system-ui';ctx.fillText('SYNTHETIC REPLAY / INTERACTIVE MASK PREVIEW',32,685);
  }
  paint();
  // Generate a local moving sample without downloading a video or including real results.
  if(canvas.captureStream){video.srcObject=canvas.captureStream(12);video.play().catch(()=>{});setInterval(paint,84);}
  for(const button of document.querySelectorAll('.demo-native button'))button.addEventListener('click',()=>{
    const toast=document.getElementById('toast');toast.textContent='已触发演示控件；这里没有真实赛事分集。';toast.hidden=false;setTimeout(()=>toast.hidden=true,3000);
  });
  for(const button of document.querySelectorAll('[data-demo]'))button.addEventListener('click',()=>{
    document.getElementById('video-demo').scrollIntoView({behavior:'smooth'});
    const toast=document.getElementById('toast');toast.textContent='这是演示回放。安装扩展后，原站按钮会打开真实回放。';toast.hidden=false;setTimeout(()=>toast.hidden=true,4500);
  });
})();
