//constructor de Actor
function Actor(x, posicionSpriteBase)
{
	//posición horizontal actual en el mapa expresada en casillas
	this.x = x;
	//posición horizontal a donde se quiere mover
	this.xDestino = x;
	//posición dentro de la lista de sprites donde está su primer sprite
	this.posicionSpriteBase = posicionSpriteBase;
	//sprite actual contando a partir del sprite base
	this.spriteActual = 0;
	
	this.actualizaSprite = function()
	{
		//cambia entre 2 sprites para dar dinamismo
		this.spriteActual = this.spriteActual==0?1:0;
	}
	
	//cambia el sprite actual 
	this.cambiarSprite = function(num)
	{
		this.spriteActual = num;
	}
	
	//dibuja al personaje en la posición actual en el contexto gráfico
	this.render = function(contexto,escala)
	{
		listaSprites[this.posicionSpriteBase + this.spriteActual].dibuja(contexto, this.x*TAMANIOSPRITE, 8*TAMANIOSPRITE,escala);
	}
}
