//constructor del mundo de juego
function Mundo(ctxt,player2, movil) //prametros: contexto gráfico, si es jugador 2, si se ejecuta desde un móvil
{	
	//contexto gráfico donde se va a mostrar el mundo
	var contexto=ctxt;
	//actual entrada de teclado introducida por el jugador
	this.pulsacion = NOACCION;
	var puntos = 0;
	//personaje principal controlado por el jugador
	var mouse = (player2) ? new Actor(2,2):new Actor(2,0); //sprite ratón marrón o gris dependiendo del jugador
	var nivel=1; //nivel actual
	var mapa = nivel1.slice(); //array que representa con números el mapa del nivel actual
	var desplazamiento = 0; //desplazamiento vertical del nivel
	var aux_personaje = true; //auxiliar para actualizar el sprite del ratón 
	var aux_titulo = 200; //auxiliar para mostrar el titulo del nivel durante cierto tiempo
	var started = false; //si el juego ha empezado o no
	var escala = (movil) ? 2 : 1; //si se reproduce en un movil pinta el juego al doble de tamaño
	this.state = 0; // en juego = 0, perder = 1, ganar = 2
	var instrucciones = true; // para mostrar las instrucciones al iniciar al juego
	
	//inicia el juego y deja de mostrar las instrucciones
	this.init = function(){
		started = true;	
		instrucciones = false;
	}
	
	this.getPuntos = function(){
		return puntos;
	}
	
	//devuelve TRUE si la casilla se puede atravesar o FALSE en caso contrario
	var esAtravesable= function(x)
	{
		var y = Math.ceil(desplazamiento); 
		var casilla = y*ANCHOMAPA+ANCHOMAPA-x-1; //casilla del mapa donde se encuentra el ratón
		
		//si la casilla está dentro de los límites del mapa y no hay un mueble es atravesable
		if (mapa[casilla]<13 && x>-1 && x<ANCHOMAPA){ 
			return true;
		}
		return false;
		
	}
			
	//comprueba si el personaje se puede mover en la direccion indicada y actualiza su destino
	this.validaActualizaMovimiento = function()
	{
		//calculamos la casilla de destino según la dirección de movimiento
		var futuraX;
		switch(this.pulsacion)
		{
			case DERECHA:
				futuraX = Math.floor(mouse.x) + 1;	
				break;
			case IZQUIERDA:
				futuraX = Math.floor(mouse.x) - 1;							
				break;
		}
		//comprobamos que su casilla de destino es atravesable
		if (esAtravesable(futuraX) == true){
			//actualizamos el destino del personaje
			mouse.xDestino = futuraX;
		}
		this.pulsacion = NOACCION; 
	}
								
	//desplaza el personaje hacia su destino
	this.muevePersonaje = function()
	{
		//DERECHA
		if (mouse.x < mouse.xDestino)
		{
			mouse.x = mouse.x+0.5;
		}//IZQUIERDA
		else if (mouse.x > mouse.xDestino)
		{
			mouse.x = mouse.x-0.5;
		}
		
		if(aux_personaje){ //actualiza el sprite del personaje alternadamente
			mouse.actualizaSprite();
		}
		aux_personaje = !aux_personaje;
	}
		
	//resuelve las colisiones con los quesitos, trampas y muebles
	this.resolverColisiones = function()
	{
		var y = Math.ceil(desplazamiento);
		var x = mouse.x;
		var casilla = y*ANCHOMAPA+ANCHOMAPA-x-1; //casilla actual del ratón
		
		if(mapa[casilla]==2) //si la casilla es una trampa
		{
			//audios
			trampa.play();
			grito.play();
			
			if(player2){ // si es el jugador 2
				mouse.cambiarSprite(27); //dejamos de mostrar el ratón
				mapa[casilla]=5; //sustituimos la trampa por la trampa con el ratón marrón
			}else{ //si es el jugador 1 
				mouse.cambiarSprite(29); //dejamos de mostrar el ratón	
				mapa[casilla]=4; //sustituimos la trampa por la trampa con el ratón gris
			}
			this.state = 1; //estado de juego perdido
		}else if (mapa[casilla]==10 || mapa[casilla]==11 || mapa[casilla]==12){ //si la casilla es un mueble
			if(player2){  // si es el jugador 2
				mouse.cambiarSprite(22);  //sustituimos el ratón marrón por el de los ojos en cruz
			}else{ //si es el jugador 1 
				mouse.cambiarSprite(23); //sustituimos el ratón gris por el de los ojos en cruz
			}
			grito.play(); //audio
			this.state = 1; //estado de juego perdido
		}else if (mapa[casilla]==1){ //si la casilla es un trozo de queso
			puntos += 10; //aumentamos los puntos
			morder_trozo.play(); //audio
			mapa[casilla]=0; //quitamos el sprite del trozo de queso
		}else if (mapa[casilla]==3){ //si la casilla es un queso
			puntos += 30; //aumentamos los puntos
			morder_queso.play(); //audio
			mapa[casilla]=0; //quitamos el sprite del queso
		}else if (mapa[casilla]==9){  //si la casilla es un trozo de queso malo
			if(puntos >0) //restamos puntos si son mayores que 0
				puntos -= 10;
			asco.play(); //audio
			mapa[casilla]=0; //quitamos el sprite del trozo de queso
		}else if(desplazamiento>=(mapa.length/5) && nivel==3){ //si se ha llegado al final del nivel 3
			this.state = 2; //estado de juego ganado
		}
	}
	
	//cambia al siguiente nivel
	var cambiarNivel = function(){
		if(desplazamiento>=(mapa.length/5) && nivel < 3){ //si llega al final del nivel y no es el último
			if(nivel==1){ //si el nivel actual es el 1
				mapa = nivel2.slice(); //cargamos en el mapa el nivel 2	
			}else if(nivel==2){ //si el nivel actual es el 2
				mapa = nivel3.slice(); //cargamos en el mapa el nivel 3
			}
			desplazamiento=0; //reiniciamos el desplazamiento
			aux_titulo=100;	//mostramos el titulo del nivel
			victoria.play(); //audio
			nivel++; //actualizamos el valor del nivel actual
		}
	}
	
	//función para pintar 'victoria'
	var pintarVictoria = function(){
		var tam = 60*escala;
		contexto.font = "bold "+tam+"px arial";
		contexto.lineWidth = 5*escala;
		contexto.strokeStyle = 'black';
		contexto.fillStyle="lime";
		contexto.strokeText("VICTORIA",20*escala,300*escala);	
		contexto.fillText("VICTORIA",20*escala,300*escala);		
	}
	
	//función para pintar 'game over'
	var pintarGameOver = function(){
		var tam = 60*escala;
		contexto.font = "bold "+tam+"px arial";
		contexto.lineWidth = 5*escala;
		contexto.strokeStyle = 'black';
		contexto.fillStyle="red";
		contexto.strokeText("GAME",70*escala,280*escala);	
		contexto.fillText("GAME",70*escala,280*escala);
		contexto.strokeText("OVER",70*escala,340*escala);	
		contexto.fillText("OVER",70*escala,340*escala);
	}	
	
	//función para pintar el número de nivel
	var pintarTituloNivel = function(){
		var tam = 50*escala;
		if(aux_titulo>0){
			contexto.font = "bold "+tam+"px arial";
			contexto.fillStyle = "white";
			contexto.lineWidth = 5*escala;
			contexto.strokeStyle = 'black';
			contexto.strokeText("NIVEL "+nivel,60*escala,310*escala);	
			contexto.fillText("NIVEL "+nivel,60*escala,310*escala);	
			aux_titulo--;
		}		
	}
	
	//función para mostrar los puntos actuales al jugador
	var pintarPuntos = function(){
		var tam = 25*escala;
		contexto.font = "bold "+tam+"px arial";
		contexto.fillStyle = "yellow";
		contexto.fillText(puntos,10*escala,30*escala);
		contexto.lineWidth = 1*escala;
		contexto.strokeStyle = 'black';
		contexto.strokeText(puntos,10*escala,30*escala);		
	}
	
	//para la actualización del juego
	this.parar = function()
	{
		started = false;
		//paramos la actualización del estado del juego
		if(player2){
			clearInterval(actualiza2);
		}else{
			clearInterval(actualiza1);
		}
		this.pulsacion = NOACCION;
	}
			
	//muestra el mundo por pantalla
	this.render = function()
	{
		//borramos toda la escena anterior
		contexto.clearRect(0,0,ANCHOMAPA*TAMANIOSPRITE,ALTOMAPA*TAMANIOSPRITE);
		
		//recorremos la porción del mapa que se va a visualizar pintando los sprites correspondientes
		for(var j=0+Math.floor(desplazamiento);j<Math.floor(desplazamiento)+ALTOMAPA+1;j++)
		{
			for(var i=0;i<ANCHOMAPA;i++)
			{
				//mostramos el suelo
				listaSprites[7].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
				
				var casilla = mapa[(j)*ANCHOMAPA+i]; //casilla del mapa a pintar
				//trozo queso
				if(casilla==1)
					listaSprites[5].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//trampa
				if(casilla==2)
					listaSprites[4].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
				
				//queso
				if(casilla==3)
					listaSprites[6].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
				
				//player1 muerto ratonera
				if(casilla==4)
					listaSprites[25].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
				
				//player2 muerto ratonera
				if(casilla==5)
					listaSprites[26].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
				
				//player1 muerto choque
				if(casilla==6)
					listaSprites[23].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
				
				//player2 muerto choque
				if(casilla==7)
					listaSprites[24].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
				
				//casilla final nivel
				if(casilla==8)
					listaSprites[27].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//trozo queso malo
				if(casilla==9)
					listaSprites[28].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
				
				//MUEBLES
				//borde inf izq
				if(casilla==10)
					listaSprites[13].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//borde inf der
				if(casilla==11)
					listaSprites[18].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//borde inf cen
				if(casilla==12)
					listaSprites[8].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//mitad izq
				if(casilla==13)
					listaSprites[14].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//mitad der
				if(casilla==14)
					listaSprites[19].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//mitad cen
				if(casilla==15)
					listaSprites[9].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//borde sup izq
				if(casilla==16)
					listaSprites[15].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//borde sup der
				if(casilla==17)
					listaSprites[20].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//borde sup cen
				if(casilla==18)
					listaSprites[10].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//encimera izq
				if(casilla==19)
					listaSprites[16].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//encimera der
				if(casilla==20)
					listaSprites[21].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//encimera cen
				if(casilla==21)
					listaSprites[11].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
		
				//encimera sup izq
				if(casilla==22)
					listaSprites[17].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//encimera sup der
				if(casilla==23)
					listaSprites[22].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
			
				//encimera sup cen
				if(casilla==24)
					listaSprites[12].dibuja(contexto, (ANCHOMAPA-i-1)*TAMANIOSPRITE, (ALTOMAPA-j-1+desplazamiento)*TAMANIOSPRITE,escala);
				}
		}
		if(started) //si el juego está iniciado desplazamos el suelo
			desplazamiento += 0.1;
		
		if(instrucciones){  //mostramos las instrucciones antes al inicio del juego
			var tam= 25*escala;
			contexto.lineWidth = 2*escala;
			contexto.strokeStyle = 'black';
			
			contexto.fillStyle = "orange";
			contexto.fillRect(5*escala,105*escala,310*escala,105*escala); 
			contexto.strokeRect(5*escala,105*escala,310*escala,105*escala); 
			contexto.font = "bold "+tam+"px arial";
			contexto.fillStyle = "white";
			contexto.lineWidth = 1*escala;
			if(player2){
				contexto.fillText("Utiliza A y D",30*escala,140*escala);
				contexto.strokeText("Utiliza A y D",30*escala,140*escala);
			}else{
				contexto.fillText("Utiliza las flechas",30*escala,140*escala);
				contexto.strokeText("Utiliza las flechas",30*escala,140*escala);
			}
			contexto.fillText("para moverte a",30*escala,165*escala);
			contexto.fillText("izquierda y derecha",30*escala,192*escala);
			contexto.strokeText("para moverte a",30*escala,165*escala);
			contexto.strokeText("izquierda y derecha",30*escala,192*escala);	
		}
		
		mouse.render(contexto,escala); //pintamos el ratón en su posición actual
		pintarPuntos(); //pintamos los puntos actuales 
		if(this.state==2) //en caso de victoria mostramos el texto
			pintarVictoria();
		if(this.state==1) //en caso de derrota mostramos el texto
			pintarGameOver();
		cambiarNivel(); //comprobamos si hay que cambiar de nivel
		pintarTituloNivel(); //al inicio de cada nivel pintamos el título
	}
	
}
