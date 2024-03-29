
//velocidade constante
function velocidadeXY( posicaoXY, velocidade, aceleracao )
{
  return (posicaoXY + velocidade) + aceleracao;
}

function alterarAceleracao( aceleracao, taxa )
{
  return aceleracao + taxa;
}

class Corpo
{
  constructor( alt, lar, px, py, vx, vy, ax, ay, m )
  {
    this.altura = alt;
    this.largura = lar;
    this.posicaoX = px;
    this.posicaoY =  py;
    this.velocidadeX = vx;
    this.velocidadeY = vy;
    this.aceleracaoX = ax;
    this.aceleracaoY = ay;
    this.massa = m;
  }
}

class CorpoEsferico extends Corpo
{
  constructor( raio, px, py, vx, vy, ax, ay, m )
  {
    super( 0, 0, px, py, vx, vy, ax, ay, m );
    this.raio = raio;
  }
}

let corpos = [];
corpos.push();

const o = new CorpoEsferico( 5, 0, 500, 0, 0, 0, 0, 10 );
const planeta = new CorpoEsferico( 10, 500, 500, 0, 0, 0, 0, 1000000000 );

const canvas = document.getElementById("superficie");
const aceleY = document.getElementById("aceleY");
const aceleX = document.getElementById("aceleX");

//controle do quadrado por wasd
document.addEventListener("keydown", aoBaixarDeUmaTecla, false);
async function aoBaixarDeUmaTecla( event ) 
{
  let keyCode = event.which;

  if (keyCode == 87) //w
  {
    o.aceleracaoY += 0.1;
  }
  else if (keyCode == 83) //s
  {
    o.aceleracaoY -= 0.1;
  }
  else if (keyCode == 68 ) //d
  {
    o.aceleracaoX -= 0.1;
  }
  else if (keyCode == 65 ) //a
  {
    o.aceleracaoX += 0.1;
  }
};

//loop
function desenhar()
{
  if (canvas.getContext)
  {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect( 0, 0, 1000, 1000 );

    ctx.fillStyle = "#FFFFFF";

    const nave = new Path2D();
    nave.arc( o.posicaoX, o.posicaoY, o.raio, 0, 2 * Math.PI);
    ctx.fill( nave );

    const circle = new Path2D();
    circle.arc( planeta.posicaoX, planeta.posicaoY, planeta.raio, 0, 2 * Math.PI);
    ctx.fill( circle );

    o.posicaoX = velocidadeXY( o.posicaoX, o.velocidadeX, o.aceleracaoX );
    o.posicaoY = velocidadeXY( o.posicaoY, o.velocidadeY, o.aceleracaoY );

    o.aceleracaoX = alterarAceleracao( o.aceleracaoX, Number.parseFloat(aceleX.value) );
    o.aceleracaoY = alterarAceleracao( o.aceleracaoY, Number.parseFloat(aceleY.value) );

    ctx.fillText(`${JSON.stringify(o)}`,10,10);
    
  }
  window.requestAnimationFrame( desenhar );
}
desenhar();


