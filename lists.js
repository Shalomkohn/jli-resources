const noteIcons = document.querySelectorAll('.note-icon');


document.addEventListener('touchstart', function(){}, true);

if(noteIcons) {
    noteIcons.forEach(icon => {
        icon.addEventListener('touchstart', e => {

            e.preventDefault();
        
            let noteIcon = document.querySelector(`[data-note="${e.target.dataset.note}"]`)
            noteIcon.classList.add('show-note');
        })
        icon.addEventListener('touchend', e => {

            e.preventDefault();

            let noteIcon = document.querySelector(`[data-note="${e.target.dataset.note}"]`)
            noteIcon.classList.remove('show-note');
        })
    });
} 


