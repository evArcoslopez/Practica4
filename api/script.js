$(document).ready(function() {
    const API_URL = 'https://www.thesportsdb.com/api/v1/json/3/';
    const ARSENAL_ID = 133604; // ID oficial del Arsenal en TheSportsDB

    function showLoading(show) {
        $('.loading').toggle(show);
    }

    function clearResults() {
        $('#results').empty();
        $('#error').text('');
    }

    function validateForm() {
        return true; // Ahora permitimos buscar solo por país sin necesidad de nombre
    }

    $('#searchBtn').click(async function() {
        clearResults();
        showLoading(true);

        const playerName = $('#playerName').val().trim().replace(' ', '_');
        const playerCountry = $('#playerCountry').val().trim();
        let url = `${API_URL}searchplayers.php?p=${playerName}`;

        // Si el nombre está vacío y hay un país, buscar jugadores globalmente y filtrar
        if (!playerName && playerCountry) {
            url = `${API_URL}searchplayers.php?p=`;
        }

        try {
            const response = await $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json'
            });

            if (!response || !response.player || response.player.length === 0) {
                $('#error').text('No se encontraron jugadores con los criterios ingresados.');
                return;
            }

            let filteredPlayers = response.player;
            if (playerCountry) {
                filteredPlayers = filteredPlayers.filter(player => player.strNationality?.toLowerCase().includes(playerCountry.toLowerCase()));
            }

            if (filteredPlayers.length === 0) {
                $('#error').text('No se encontraron jugadores con la nacionalidad ingresada.');
                return;
            }

            filteredPlayers.slice(0, 25).forEach(player => {
                const card = `
                    <div class="player-card">
                        <img class="player-image" src="${player.strThumb || 'https://via.placeholder.com/200'}" alt="Imagen de ${player.strPlayer}">
                        <div class="player-info">
                            <h2 class="player-name">${player.strPlayer}</h2>
                            <ul class="player-stats">
                                <li><span>Edad:</span> ${player.dateBorn || 'N/A'}</li>
                                <li><span>Posición:</span> ${player.strPosition || 'N/A'}</li>
                                <li><span>Equipo:</span> ${player.strTeam || 'Sin equipo'}</li>
                                <li><span>Nacionalidad:</span> ${player.strNationality || 'N/A'}</li>
                            </ul>
                        </div>
                    </div>
                `;
                $('#results').append(card);
            });
        } catch (error) {
            $('#error').text('Error al obtener los datos: ' + error.statusText);
        } finally {
            showLoading(false);
        }
    });

    $('#realMadridBtn').click(async function() {
        clearResults();
        showLoading(true);

        const url = `${API_URL}lookup_all_players.php?id=${ARSENAL_ID}`;

        try {
            const response = await $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json'
            });

            if (!response || !response.player || response.player.length === 0) {
                $('#error').text('No se encontró la plantilla del Arsenal.');
                return;
            }

            response.player.forEach(player => {
                const card = `
                    <div class="player-card">
                        <img class="player-image" src="${player.strThumb || 'https://via.placeholder.com/200'}" alt="Imagen de ${player.strPlayer}">
                        <div class="player-info">
                            <h2 class="player-name">${player.strPlayer}</h2>
                            <ul class="player-stats">
                                <li><span>Edad:</span> ${player.dateBorn || 'N/A'}</li>
                                <li><span>Posición:</span> ${player.strPosition || 'N/A'}</li>
                                <li><span>Nacionalidad:</span> ${player.strNationality || 'N/A'}</li>
                            </ul>
                        </div>
                    </div>
                `;
                $('#results').append(card);
            });
        } catch (error) {
            $('#error').text('Error al obtener la plantilla del Arsenal: ' + error.statusText);
        } finally {
            showLoading(false);
        }
    });

    $('#clearBtn').click(function() {
        $('#searchForm')[0].reset();
        clearResults();
    });
});