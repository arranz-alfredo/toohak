import { makeStyles } from '@material-ui/core';
import React, { CSSProperties } from 'react';
import { useDrag } from 'react-dnd';

const useStyles = makeStyles((theme) => ({
    item: {
        borderRadius: '10em',
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.primary.contrastText,
        padding: '0.5rem 1rem',
        cursor: 'move',
    }
}));

interface DragableItemProps {
    name: string
    type: string
    style?: CSSProperties
}

export const DragableItem: React.FC<DragableItemProps> = (props: DragableItemProps) => {
    const  { name, type, style } = props;

    const classes = useStyles();

    const [{ opacity }, drag] = useDrag(
        () => ({
            type,
            item: { name },
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0.4 : 1,
            }),
        }),
        [name, type],
    );

    return (
        <div
            ref={drag}
            className={classes.item}
            style={{
                opacity,
                ...style
            }}>
            {name}
        </div>
    );
};
