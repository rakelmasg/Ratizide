//función que guarda la puntación en el localStorage si está entre las 10 mejores 
function guardarHighscore(newscore){
	var highscores_stored = localStorage.getItem("highscores"); //obtenemos las puntuaciones almacenadas en el localStorage
	var name = ""; 
	if(highscores_stored==null){ //si no hay puntuaciones almacenadas la guardamos directamente
		name = prompt("¡NUEVO RECORD! \n "+newscore+" PUNTOS \nIntroduce tu nombre: "); //pedimos el nombre
		localStorage.setItem("highscores", '{"scores":['+newscore+'],"names":["'+name+'"]}'); //guardamos en formato JSON
	}else{   //si ya hay puntuaciones almacenadas la guardamos en la posición correspondiente si procede
		highscores_stored = JSON.parse(highscores_stored); //pasamos de texto a JSON
		var scores_array = highscores_stored.scores;
		var names_array = highscores_stored.names; 
		var changed = false; //auxiliar
		for(var i=0;i<scores_array.length && !changed;i++){ //recorremos las puntuaciones en orden decreciente
			if(scores_array[i]<newscore){ //si la nueva puntuación es mayor
				name = prompt("¡NUEVO RECORD! \n "+newscore+" PUNTOS \nIntroduce tu nombre: "); //pedimos el nombre
				var aux = []; //nuevo array de puntuaciones
				var auxNames = []; //nuevo array de nombres
				if(i==0){  //si es mejor que todas
					aux[0] = newscore; //la guardamos en la primera posición
					aux = aux.concat(scores_array); //añadimos el resto de puntuaciones al final
					//hacemos lo mismo con los nombres
					auxNames[0] = name;
					auxNames = auxNames.concat(names_array);
				}else{ //si está en otra posición
					aux = scores_array.slice(0,i); //guardamos las puntuaciones que hay delante
					aux[i] = newscore; //la colocamos en su posición
					aux = aux.concat(scores_array.slice(i)); //añadimos el resto de puntuaciones detrás
					//hacemos lo mismo con los nombres
					auxNames = names_array.slice(0,i);
					auxNames[i] = name;
					auxNames = auxNames.concat(names_array.slice(i));
				}
				//nos quedamos con las 10 primeras (si previamente había 10 almacenadas el aux ahora tendria 11)
				scores_array = aux.slice(0,10); 
				//hacemos lo mismo con los nombres
				names_array  = auxNames.slice(0,10);
				changed = true; //indicamos que se han actualizado los arrays
			}
		}
		//si la puntuación no supera a las almacenadas pero hay menos de 10 se añade la nueva al final
		if(!changed && scores_array.length<10){
			name = prompt("¡NUEVO RECORD! \n "+newscore+" PUNTOS \nIntroduce tu nombre: ");	//pedimos el nombre
			//añadimos la puntuación y el nombre al final de cada array
			scores_array[scores_array.length] = newscore;
			names_array[names_array.length] = name;
		}
		//actualizamos los arrays del JSON por los nuevos
		highscores_stored.names = names_array; 
		highscores_stored.scores = scores_array;
		localStorage.setItem("highscores", JSON.stringify(highscores_stored)); //almacenamos el JSON en el localStorage
	}  
}
			
