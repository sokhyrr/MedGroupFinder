let lecture;

const fetchLecture = () => {
    return new Promise((resolve, reject) => {
        document.getElementById('matriculeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const matricule = "20"+document.getElementById('matriculeInput').value;
            fetch('data/groupeq6.json')
                .then(response=> response.json())
                .then(data => {
                    const student = data.find(objet => objet.matricule === parseInt(matricule));
                    if (student) {
                        lecture = student.events;
                        resolve(lecture);
                        const vip =["20205558", "20203392"];
                        if(vip.includes(matricule)){
                            confetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
});

                        }
                    } else {
                        reject('Aucune activité trouvée pour ce matricule.');
                    }
                })
                .catch(error => reject('Une erreur est survenue:', error));
        });
    });
};

export default fetchLecture;