const btn = document.getElementById('button');

document.getElementById('form')
    .addEventListener('submit', function(event) {
        event.preventDefault();

        btn.value = 'Envoi...';

        const serviceID = 'service_bh5bh4p';
        const templateID = 'template_2s7msp8';

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                btn.value = 'Envoyer';
                alert('Sent!');
            }, (err) => {
                btn.value = 'Envoyer';
                alert(JSON.stringify(err));
            });
    });