import { CSSProperties } from '@material-ui/styles';
import React from 'react';
import { useDrop } from 'react-dnd';
import { colors } from '../../theme';

interface DropGapProps {
    value: string,
    style?: CSSProperties,
    fontSize: number,
    onDrop: (text: string) => void
}

export const DropGap: React.FC<DropGapProps> = (props: DropGapProps) => {
    const { value, style, fontSize, onDrop } = props;

    const handleDrop = (item: any) => {
        onDrop(item.name);
    };

    const [{ isOver, canDrop }, drop] = useDrop({
        accept: 'dnd',
        drop: handleDrop,
        collect: (monitor: { isOver: () => boolean, canDrop: () => boolean }) => {
            return ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop()
            });
        }
    });

    return (
        <div
            ref={drop}
            style={{
                width: '150px',
                height: '50px',
                lineHeight: '50px',
                textAlign: 'center',
                borderBottom: `solid 1px ${colors.primary.main}`,
                color: colors.primary.main,
                fontSize: `${fontSize ? fontSize : 50}px`,
                ...style
            }}

        >
            {value}
        </div>
    );
};
