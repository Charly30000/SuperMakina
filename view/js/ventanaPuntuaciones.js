const { ipcRenderer } = require('electron');
        let nombreJuego;
        ipcRenderer.on('juego', (evt, juego) => {
            //creacionStorage(juego);
            creacionTabla(juego);
            document.getElementById("tituloJuego").textContent = juego;
        });
        function creacionStorage(juego) {
            localStorage.setItem(juego, JSON.stringify(
                [
                    {
                        "nombre": "san",
                        "puntuacion": 123312
                    },
                    {
                        "nombre": "alb",
                        "puntuacion": 123123123
                    },
                    {
                        "nombre": "and",
                        "puntuacion": 4567867
                    }
                ]
            ));
        }

        function creacionTabla(juego) {
            let objeto = JSON.parse(localStorage.getItem(juego));
            if (!objeto) {
                $('body').empty();
                $(`<div class="alert alert-primary" role="alert">
                ${juego}
                </div>'`).appendTo($('body'));
            } else {
                objeto.sort((a, b) => {
                    if (a.puntuacion > b.puntuacion) {
                        return -1;
                    } else if (a.puntuacion < b.puntuacion) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                let tabla = document.getElementById("tabla");
                $(`<tr><th scope="col">Puesto</th><th scope="col">Nombre</th><th scope="col">Puntuacion</th></tr>`).appendTo("#tabla");
                $("<tbody></tbody>").appendTo("#tabla");
                for (let i = 1; i < objeto.length + 1; i++) {
                    $(`<tr><th scope="row">${i}</th><td>${objeto[i - 1].nombre}</td><td>${objeto[i - 1].puntuacion}</td></tr>`).appendTo("tbody");
                }
            }
        }