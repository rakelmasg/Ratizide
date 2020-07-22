//constructor de Sprite
function Sprite (imagenFuente, x, y, ancho, alto){
	
	//imagen que contiene todos los sprites 
	var imagen = imagenFuente;
	//coordenada x(pixel) de la imagen donde empieza el sprite
	this.x = x;
	//coordenada y(pixel) de la imagen donde empieza el sprite
	this.y = y;
	//ancho en pixels del sprite
	this.ancho = ancho;
	//alto en pixels del sprite
	this.alto = alto;
	
	//dibuja el sprite en el contexto dado, desde la posición(x,y) en pixels y en la escala indicada
	this.dibuja = function(contexto, x, y, escala)
	{
		contexto.drawImage(imagen, this.x, this.y, this.ancho, this.alto, x, y, this.ancho*escala, this.alto*escala);
	}			
}
