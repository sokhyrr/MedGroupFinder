export default function fetchEventsData(matricules) {
    return Array.isArray(matricules)
        ? Promise.all(matricules.map(fetchEventsForMatricule))
        : fetchEventsForMatricule(matricules);
}

const fetchEventsForMatricule = matricule => {
    return fetch('data/groupeq6.json')
        .then(response => response.ok ? response.json() : Promise.reject('Erreur lors de la récupération des données des événements'))
        .then(data => {
            const student = data.find(objet => objet.matricule === parseInt(matricule));
            if (!student) throw new Error('Aucune activité trouvée pour le matricule ' + matricule);
            ["20205558", "20203392", "20217129"].includes(matricule) && confetti({particleCount: 100, spread: 70, origin: {y: 0.6}}); // VIP
            return student.events;
        });
};