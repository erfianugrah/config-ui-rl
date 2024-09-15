export function initDragAndDrop(container, onOrderChange) {
  let draggedItem = null;

  container.addEventListener('dragstart', (e) => {
    draggedItem = e.target;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.getAttribute('data-id'));
    setTimeout(() => {
      e.target.style.opacity = '0.5';
      e.target.style.transform = 'scale(1.05)';
    }, 0);
  });

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const targetItem = e.target.closest('[draggable]');
    if (targetItem && targetItem !== draggedItem) {
      const rect = targetItem.getBoundingClientRect();
      const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
      targetItem.parentNode.insertBefore(draggedItem, next ? targetItem.nextSibling : targetItem);
    }
  });

  container.addEventListener('dragend', (e) => {
    e.target.style.opacity = '';
    e.target.style.transform = '';
    draggedItem = null;

    const newOrder = Array.from(container.children).map((child) =>
      parseInt(child.getAttribute('data-id'))
    );
    onOrderChange(newOrder);
  });
}
