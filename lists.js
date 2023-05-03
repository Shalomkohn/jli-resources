const noteIcons = document.querySelectorAll('.note-icon');


document.addEventListener('touchstart', function(){}, true);

if(noteIcons) {
    noteIcons.forEach(icon => {
        icon.addEventListener('touchstart', e => {

            e.preventDefault();
            e.target.classList.add('show-note')
        })
        icon.addEventListener('touchend', e => {

            e.preventDefault();
            e.target.classList.remove('show-note')
        })
    });
} 


