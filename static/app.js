// dragula([
//     document.querySelector('#backlog'),
//     document.querySelector('#progress'),
//     document.querySelector('#completed')
//   ]);



const draggable = document.getElementById('draggable');
let isDragging = false;
let touchStartX = 0;
let touchStartY = 0;
let offsetX = 0;
let offsetY = 0;

let touch1 = null; // First touch (for dragging)
let touch2 = null; // Second touch (for scrolling)

draggable.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        // First touch to drag the container
        touch1 = e.touches[0];
        isDragging = true;
        touchStartX = touch1.pageX - offsetX;
        touchStartY = touch1.pageY - offsetY;
        draggable.style.cursor = 'grabbing';
    }
}, { passive: false });

draggable.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
        // Only allow dragging when one finger is on the container
        touch1 = e.touches[0];
        offsetX = touch1.pageX - touchStartX;
        offsetY = touch1.pageY - touchStartY;
        draggable.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }

    // Allow scrolling with the second finger
    if (e.touches.length === 2) {
        touch2 = e.touches[1];
        // Disable scrolling on the container if we're dragging
        e.preventDefault(); // Prevent default scrolling behavior
    }

}, { passive: false });

draggable.addEventListener('touchend', (e) => {
    if (e.touches.length === 0) {
        isDragging = false;
        draggable.style.cursor = 'grab';
    }
}, { passive: false });

draggable.addEventListener('touchcancel', () => {
    isDragging = false;
    draggable.style.cursor = 'grab';
});