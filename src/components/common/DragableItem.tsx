import React, { CSSProperties } from 'react';
import { makeStyles } from '@material-ui/core';
import { useDrag } from 'react-dnd';

const useStyles = makeStyles((theme) => ({
    item: {
        borderRadius: '10em',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: '0.5rem 1rem',
        cursor: 'move',
    }
}));

interface DragableItemProps {
    name: string,
    style?: CSSProperties,
    iconButton?: React.ReactNode
}

export const DragableItem: React.FC<DragableItemProps> = (props: DragableItemProps) => {
    const  { name, style, iconButton } = props;

    const classes = useStyles();

    const [{ opacity }, drag] = useDrag(
        () => ({
            type: 'dnd',
            item: { name },
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0.4 : 1,
            }),
        }),
        [name],
    );

    return (
        <div
            ref={drag}
            className={classes.item}
            style={{
                opacity,
                ...style
            }}
        >
            {name}
            {
                iconButton
            }
        </div>
    );
};
