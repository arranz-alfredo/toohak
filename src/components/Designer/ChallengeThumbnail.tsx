import React, { Fragment, useEffect, useState } from 'react';
import { Card, CardActionArea, CardActions, CardContent, CardHeader, Chip, Grid, Icon, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { Challenge } from '../../types/Challenge';
import { getChallengeTypeDescription, getChallengeTypeIcon } from '../../utils/utilChallenges';
import { isValidChallenge, Validation } from '../../utils/utilValidationTypes';

const useStyles = makeStyles({
    fullWidth: {
        width: '100%',
    },
    description: {
        width: '100%',
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

interface ChallengeThumbnailProps {
    challenge: Challenge,
    position: number,
    selected?: boolean,
    compact?: boolean,
    onClick?: (selectedChallenge: Challenge) => void,
    onDelete?: (deletedChallenge: Challenge) => void
}

export const ChallengeThumbnail: React.FC<ChallengeThumbnailProps> = (props: ChallengeThumbnailProps) => {
    const { challenge, position, selected, compact, onClick, onDelete } = props;

    const [validation, setValidation] = useState<Validation>({ valid: true, errorMessage: [] });

    const classes = useStyles();

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
        <Fragment>
            {
                <Card variant={selected ? 'elevation' : 'outlined'} elevation={10} className={classes.fullWidth}>
                    <CardActionArea className={classes.fullWidth} onClick={handleClick}>
                        <CardHeader
                            avatar={
                                compact ? getChallengeTypeIcon(challenge.type, 'small') : undefined
                            }
                            subheader={
                                <Typography variant='subtitle2' color={selected ? 'secondary' : 'textPrimary'} className={classes.description}>
                                    { compact ? challenge.question : `#${position} ${getChallengeTypeDescription(challenge.type)}` }
                                </Typography>
                            }
                            action={
                                compact ? (
                                    <Grid container alignItems="center">
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
                                        {/* <IconButton onClick={handleDeleteClick}>
                                            <Icon>delete</Icon>
                                        </IconButton> */}
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
            }
        </Fragment>
    );
};
