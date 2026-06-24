// Native OS controller (Available globally because the shell handles local permissions natively)
const osShell = (typeof require !== 'undefined') ? require('child_process') : null;

function launchApp(appId, appUrl, appType) {
    console.log(`Launching application: ${appId} [Type: ${appType}]`);
    
    switch(appType) {
        case 'web':
            // Renders standard websites or local web sub-apps inside an iframe space
            const targetContainer = document.getElementById('desktop-container');
            if (targetContainer) {
                targetContainer.innerHTML = `<iframe src="${appUrl}" style="width:100%; height:100%; border:none; background:#fff;"></iframe>`;
            }
            break;
            
        case 'cpp':
            // Seamlessly invokes local Windows C++ applications (.exe)
            if (osShell) {
                osShell.exec(`"${appUrl}"`, (err) => {
                    if (err) alert(`Failed to open target C++ binary: ${err.message}`);
                });
            }
            break;
            
        case 'java':
            // Triggers external Java archives (.jar) utilizing the local system path variables
            if (osShell) {
                osShell.exec(`java -jar "${appUrl}"`, (err) => {
                    if (err) alert(`Java initialization failed! Ensure JRE is configured on this PC.\nError: ${err.message}`);
                });
            }
            break;
    }
}
