// Fonction de décodage Quoted-Printable
function decodeQuotedPrintable(encodedText) {
    return encodedText.replace(/=([0-9A-F]{2})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
}

// off_email.js

export default function viewEmail(emailFilePath) {
    fetch(emailFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(emailContent => {
            // Extraire le sujet de l'e-mail
            const subjectMatch = emailContent.match(/Subject: (.*)/);
            const subject = subjectMatch ? decodeQuotedPrintable(subjectMatch[1]) : 'Sujet non trouvé';

            // Extraire la date de l'e-mail
            const dateMatch = emailContent.match(/Date: (.*)/);
            const date = dateMatch ? dateMatch[1] : 'Date non trouvée';

            // Chercher le début du corps du message en ignorant les en-têtes
            const bodyStartIndex = emailContent.search(/\r?\n\r?\n/);
            if (bodyStartIndex !== -1) {
                // Extraire le corps du message à partir du début du corps du message
                const encodedMessageBody = emailContent.substring(bodyStartIndex).trim();
                const messageBody = decodeQuotedPrintable(encodedMessageBody);

                // Ouvrir une nouvelle fenêtre avec les informations extraites
                const newWindow = window.open('', '_blank');
                newWindow.document.write(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Email Viewer</title>
                        <link rel="stylesheet" href="styles.css">
                    </head>
                    <body>
                        <h1>${subject}</h1>
                        <p>Date: ${date}</p>
                        <div>${messageBody}</div>
                    </body>
                    </html>
                `);
            } else {
                throw new Error('Could not find message body in email content');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
