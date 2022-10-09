function fallbackCopyTextToClipboard(text: string) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    let successful = false;
    
    try {
        successful = document.execCommand("copy");
    } catch (err) {
        return false;
    }

    document.body.removeChild(textArea);

    return successful;
}

export async function copyTextToClipboard(text: string) {
    if (!navigator.clipboard) return fallbackCopyTextToClipboard(text);

    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        return false;
    }
}