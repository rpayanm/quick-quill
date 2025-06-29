import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CircleX, GripVertical } from 'lucide-react';

export function ItemSortable(props: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: '1px solid #ccc',
    padding: '8px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <span style={{ cursor: 'grab', userSelect: 'none' }}
              {...listeners}>
        <GripVertical/>
      </span>
      <span style={{ flex: 1 }}>{props.body}</span>
      <CircleX style={{ cursor: 'pointer' }} onClick={() => props.onRemove(props.id)}/>
    </div>
  );
}