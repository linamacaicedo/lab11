class Agente {
    constructor(nombre, rol, habilidades, imagen) {
        this.nombre = nombre;
        this.rol = rol;
        this.habilidades = habilidades;
        this.imagen = imagen;
    }
}

async function getAgents() {
    try {
        const response = await fetch('https://valorant-api.com/v1/agents');
        const data = await response.json();

        const agents = data.data.map(agentData => {
            return new Agente(
                agentData.displayName,
                agentData.role?.displayName || 'N/A', // Rol o "N/A" si no tiene
                agentData.abilities.map(ability => ability.displayName), // Lista de habilidades
                agentData.displayIcon // URL de la imagen del agente
            );
        });

        return agents;
    } catch (error) {
        console.error("Error al obtener los agentes:", error);
    }
}

const agentContainer = document.getElementById('agent-container');

function renderAgents(agents) {
    agentContainer.innerHTML = ''; // Limpia el contenedor

    agents.forEach(agent => {
        const agentElement = document.createElement('div');
        agentElement.classList.add('agent');

        agentElement.innerHTML = `
            <img src="${agent.imagen}" alt="${agent.nombre}">
            <div class="agent-content">
                <h2>${agent.nombre}</h2>
                <p>Rol: ${agent.rol}</p>
                <h3>Habilidades:</h3>
                <ul>
                    ${agent.habilidades.map(habilidad => `<li>${habilidad}</li>`).join('')}
                </ul>
            </div>
        `;

        agentContainer.appendChild(agentElement);
    });
}

let allAgents = [];

document.addEventListener('DOMContentLoaded', async () => {
    allAgents = await getAgents();
    renderAgents(allAgents);
});

document.getElementById('search-bar').addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();

    const filteredAgents = allAgents.filter(agent =>
        agent.nombre.toLowerCase().includes(searchTerm)
    );

    renderAgents(filteredAgents);
});
