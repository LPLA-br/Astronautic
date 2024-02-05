
/*estrutura para ângulos*/
class Angulo
{
  constructor( angulo )
  {
    this.angulo = (angulo > 360 || angulo < 0) ? (45) : (angulo) ;
  }

  grausParaRadianos()
  {
    return (this.angulo*(Math.PI/180));
  }

  definirNovoAngulo( graus )
  {
    this.angulo = (graus > 360 || graus < 0) ? (this.angulo) : (graus) ;
  }

  incrementarAngulo()
  {
    this.angulo = ((this.angulo + 1) > 360) ? (0) : (this.angulo+1) ;
  }

  decrementarAngulo()
  {
    this.angulo = ((this.angulo - 1) < 0) ? (360) : (this.angulo-1) ;
  }
};

function obterNumeroAleatorioEntre( max, min )
{
  return Math.floor( (Math.random() * (max - min + 1)) ) + min ;
}

class Corpo
{
  constructor( raio, px=undefined, py=undefined, vx, vy, ax, ay, m )
  {
    this.raio = raio;
    this.posicaoX = (typeof px == 'undefined')  ? obterNumeroAleatorioEntre(0,500) : px ;
    this.posicaoY =  (typeof py == 'undefined') ? obterNumeroAleatorioEntre(0,500) : py ;
    this.velocidadeX = vx;
    this.velocidadeY = vy;
    this.aceleracaoX = ax;
    this.aceleracaoY = ay;
    this.massa = m;
  }

  seMover()
  {
    this.posicaoX += this.velocidadeX;
    this.posicaoY += this.velocidadeY;
  }

  mutarVelocidadePelaAceleracao()
  {
    this.velocidadeX += this.aceleracaoX;
    this.velocidadeY += this.aceleracaoY;
  }

};

/* Observações interessantes:
 * CorpoAlternativo é um conjunto de métodos e atributos interseccionante com Corpo.
 * Ele pode ser empregado sem modificações no método renderizador!
 * A Herança não é através de extenção, mas sim por interface inplicita.
 * seMover() é polimorfico {difere no algorítmo} */
class CorpoAlternativo
{
  constructor( raio, px, py, vx, vy )
  {
    this.raio = raio;
    this.velocidade = 0.1;
    this.angulo = new Angulo( 0.1 ); //injeção de dependência.
    this.posicaoX = px;
    this.posicaoY = py;
    this.velocidadex = vx;
    this.velocidadey = vy;
  }

  seMover()
  {
    let rad = this.angulo.grausParaRadianos(); 
    this.velocidadex = this.velocidade * Math.cos( rad );
    this.velocidadey = this.velocidade * Math.sin( rad );
    this.posicaoX += this.velocidadex;
    this.posicaoY += this.velocidadey;
  }

  lerInputsPadronizados()
  {
    const velocidade = document.getElementById('velocidade'); 
    const direcao = document.getElementById('angulo'); 
    this.velocidade = +velocidade.value;
    this.angulo.definirNovoAngulo( +direcao.value );
  }

};

// lista de corpos físicos
let corpos = []; //dados dos corpos

corpos.push( new Corpo( 10, undefined, undefined, 0, 0, 0, 0, 1000000000 ) );
corpos.push( new Corpo( 10, undefined, undefined, 0, 0, 0, 0, 1000 ) );
corpos.push( new CorpoAlternativo(10,100,100,0,0) );

const canvas = document.getElementById("superficie");

// desenha todos os objetos salvos em corpos.
function renderizarCorpos( listaDeCorpos, contexto )
{
  for( i=0; i<listaDeCorpos.length; i++ )
  {
    const representacao = new Path2D();
    representacao.arc(
      listaDeCorpos[i].posicaoX,
      listaDeCorpos[i].posicaoY,
      listaDeCorpos[i].raio,
      0,
      (2 * Math.PI)
    );
    contexto.fill( representacao );
  }
}

function distanciaEntreDoisCorpos( CorpoA, CorpoB )
{
  return Math.sqrt(( CorpoA.posicaoX - CorpoB.posicaoX )^2 + 
    ( CorpoA.posicaoY - CorpoB.posicaoY)^2 );
}

function gravitacaoUniversal( CorpoA, CorpoB, distancia )
{
  const G = 0.00000000006674081;
  return (CorpoA.massa * CorpoB.massa * G )/(distancia);
}

function direcaoEntrePontos( partida, alvo ) // [int,int]
{
  return [ Math.abs( partida.posicaoX - alvo.posicaoX ) , Math.abs( partida.posicaoY - alvo.posicaoY ) ];
}

function moverCorpos( listaDeCorpos )
{
  for( i=0; i<listaDeCorpos.length; i++ )
  {
    listaDeCorpos[i].seMover();
  }
}

function lerInputsParaCorposAlternativos( listaDeCorpos )
{
  for( i=0; i<listaDeCorpos.length; i++ )
  {
    if( typeof listaDeCorpos[i].lerInputsPadronizados != 'undefined' )
    {
      listaDeCorpos[i].lerInputsPadronizados();
    }
  }
}

function desenhar()
{
  if (canvas.getContext)
  {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000"; //fundo
    ctx.clearRect(0, 0, canvas.width, canvas.height );
    ctx.fillRect( 0, 0, 1000, 1000 );

    ctx.fillStyle = "#FFFFFF"; //cor das proximas renderizações.

    renderizarCorpos( corpos, ctx );
    moverCorpos( corpos );
    lerInputsParaCorposAlternativos( corpos );

  }
  window.requestAnimationFrame( desenhar );
}
desenhar();


