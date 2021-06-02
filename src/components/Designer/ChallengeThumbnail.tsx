import React, { useEffect, useRef, useState } from 'react';
import { Card, CardActionArea, CardActions, CardContent, CardHeader, Chip, Grid, Icon, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { Challenge } from '../../types/Challenge';
import { getChallengeTypeDescription, getChallengeTypeIcon } from '../../utils/utilChallenges';
import { isValidChallenge, Validation } from '../../utils/utilValidationTypes';
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { colors } from '../../theme';

const useStyles = makeStyles({
    fullWidth: {
        width: '100%',
    },
    fullHeight: {
        height: '100%',
    },
    headerContainer: {
        overflow: "hidden"
    },
    contentContainer: {
        overflow: "hidden"
    },
    actionContainer: {
        marginTop: '8px'
    },
    descriptionContainer: {
        width: '100%',
    },
    description: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    tooltipRow: {
        fontSize: '12px'
    },
    statusContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    }
});

interface DragItem {
    index: number,
    challenge: Challenge,
    type: string
}

interface ChallengeThumbnailProps {
    challenge: Challenge,
    index: number,
    selected?: boolean,
    compact?: boolean,
    onChallengeMove: (dragIndex: number, hoverIndex: number) => void,
    onClick?: (selectedChallenge: Challenge) => void,
    onDelete?: (deletedChallenge: Challenge) => void
}

export const ChallengeThumbnail: React.FC<ChallengeThumbnailProps> = (props: ChallengeThumbnailProps) => {
    const { challenge, index, selected, compact, onChallengeMove, onClick, onDelete } = props;

    const ref = useRef(null);

    const [validation, setValidation] = useState<Validation>({ valid: true, errorMessage: [] });

    const classes = useStyles();

    const [, drop] = useDrop({
        accept: 'challengeThumbnail',
        hover(item: DragItem, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = (ref.current as any).getBoundingClientRect();
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            onChallengeMove(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag, preview] = useDrag({
        type: 'challengeThumbnail',
        item: { type: 'challengeThumbnail', challenge, index },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging()
        }),
    });

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
    }, []);

    const style = isDragging ? ({
        opacity: 5,
        backgroundColor: colors.primary.light
    }) : ({
        opacity: 1
    });
    drag(drop(ref));


    const handleClick = () => {
        if (onClick) {
            onClick(challenge);
        }
    };

    const handleDeleteClick = () => {
        if (onDelete) {
            onDelete(challenge);
        }
    };

    useEffect(() => {
        setValidation(isValidChallenge(challenge));
    }, [challenge]);

    return (
        <Grid item className={classes.fullWidth}>
            <Card
                ref={ref}
                style={{ ...style }}
                variant={selected ? 'elevation' : 'outlined'}
                elevation={10}
                className={classes.fullWidth}
            >
                <CardActionArea className={classes.fullWidth} onMouseDown={handleClick}>
                    <CardHeader
                        classes={{
                            root: classes.headerContainer,
                            content: classes.contentContainer,
                        }}
                        avatar={
                            compact ? getChallengeTypeIcon(challenge.type, 'small') : undefined
                        }
                        subheader={
                            <Typography variant='subtitle2' color={selected ? 'secondary' : 'textPrimary'} className={classes.description}>
                                {compact ? challenge.question : `#${index + 1} ${getChallengeTypeDescription(challenge.type)}`}
                            </Typography>
                        }
                        action={
                            compact ? (
                                <Grid container alignItems="center" className={classes.actionContainer}>
                                    {
                                        validation.valid ? <Icon color="primary" fontSize="small">check</Icon>
                                            : (
                                                <Tooltip arrow title={
                                                    <>
                                                        {
                                                            validation.errorMessage.map((
                                                                aMessage: string,
                                                                messageIdx: number
                                                            ) => (
                                                                <li
                                                                    key={`li_${messageIdx}`}
                                                                    className={classes.tooltipRow}
                                                                >
                                                                    {aMessage}
                                                                </li>
                                                            ))
                                                        }
                                                    </>
                                                }>
                                                    <Icon color="secondary" fontSize="small">priority_high</Icon>
                                                </Tooltip>
                                            )
                                    }
                                </Grid>
                            ) : undefined
                        }
                    />
                    {
                        !compact && (
                            <CardContent>
                                <Typography noWrap>{challenge.question}</Typography>
                            </CardContent>
                        )
                    }
                </CardActionArea>
                {
                    !compact && (
                        <CardActions className={classes.statusContainer}>
                            {
                                validation.valid ? <Chip label="completo" color="primary" size="small" icon={<Icon fontSize="small">check</Icon>} />
                                    : (
                                        <Tooltip arrow title={
                                            <>
                                                {
                                                    validation.errorMessage.map((aMessage: string, messageIdx) => (
                                                        <li
                                                            key={`li_${messageIdx}`}
                                                            className={classes.tooltipRow}>
                                                            {aMessage}
                                                        </li>
                                                    ))
                                                }
                                            </>
                                        }>
                                            <Chip label="error" color="secondary" size="small" style={{ color: '#ffffff' }} icon={<Icon fontSize="small">priority_high</Icon>} />
                                        </Tooltip>
                                    )
                            }
                            <IconButton onClick={handleDeleteClick}>
                                <Icon>delete</Icon>
                            </IconButton>
                        </CardActions>
                    )
                }
            </Card>
        </Grid>
    );
};
