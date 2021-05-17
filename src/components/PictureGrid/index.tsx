import React, { Fragment, useEffect, useState } from 'react';
import { Fab, Grid, GridSize, Icon, makeStyles } from '@material-ui/core';
import { ChallengePicture } from '../../types/Challenge';
import { PictureType } from '../../enums/PictureType';
import { ComponentMode } from '../../enums/ComponentMode';
import { DialogPictureForm } from '../DialogPictureSelector';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '99%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    fullHeight: {
        height: '100%'
    },
    pic: {
        maxWidth: '100%',
        maxHeight: '100%'
    }
}));

interface PictureDialogState {
    selectedPicture: ChallengePicture,
    selectedPictureIdx: number,
    openDialog: boolean
}

interface ItemGridSize {
    height: string,
    width: GridSize
}

interface PictureGridProps {
    mode: ComponentMode,
    pictures: ChallengePicture[],
    onPicturesChange?: (newPictures: ChallengePicture[]) => void
}

export const PictureGrid: React.FC<PictureGridProps> = (props: PictureGridProps) => {
    const { mode, pictures, onPicturesChange } = props;

    const [pictureDialogState, setPictureDialogState] = useState<PictureDialogState>();

    const classes = useStyles();

    const [pictureItemSize, setPictureItemSize] = useState<ItemGridSize>({ height: '100%', width: 8 });

    useEffect(() => {
        switch (pictures.length) {
            case 9:
            case 8:
            case 7:
                setPictureItemSize({ height: '33.3%', width: 4 });
                break;
            case 6:
            case 5:
                setPictureItemSize({ height: '50%', width: 4 });
                break;
            case 4:
            case 3:
                setPictureItemSize({ height: '50%', width: 6 });
                break;
            case 2:
                setPictureItemSize({ height: '100%', width: 6 });
                break;
            default:
                setPictureItemSize({ height: '100%', width: 12 });
                break;
        }
    }, [pictures]);

    const handleAddPictureClick = (picture: ChallengePicture, pictureIdx: number) => {
        setPictureDialogState({
            openDialog: true,
            selectedPicture: picture,
            selectedPictureIdx: pictureIdx
        });
    };

    const handleAcceptPicture = (picture: ChallengePicture, pictureIdx: number) => {
        if (onPicturesChange) {
            onPicturesChange(
                pictures.map((aPicture: ChallengePicture, idx: number) => idx !== pictureIdx ? {...aPicture} : {...picture})
            );
        }
        setPictureDialogState({
            openDialog: false,
            selectedPicture: {
                type: PictureType.None,
                data: ''
            },
            selectedPictureIdx: -1
        });
    };

    const handleCancelPicture = () => {
        setPictureDialogState({
            openDialog: false,
            selectedPicture: {
                type: PictureType.None,
                data: ''
            },
            selectedPictureIdx: -1
        });
    };


    return (
        <Fragment>
            {
                pictureDialogState && (
                    <DialogPictureForm
                        open={pictureDialogState.openDialog}
                        picture={pictureDialogState.selectedPicture}
                        onAccept={(newPic: ChallengePicture) => handleAcceptPicture(
                            newPic, pictureDialogState.selectedPictureIdx
                        )}
                        onCancel={handleCancelPicture}
                    />
                )
            }
            <Grid container className={classes.root}>
                {
                    pictures.map((aPicture: ChallengePicture, pictureIdx: number) => (
                        <Grid item
                            key={`pic${pictureIdx.toString()}`}
                            xs={pictureItemSize.width}
                            style={{ height: pictureItemSize.height, border: mode === ComponentMode.Design ? 'solid 1px' : '0px' }}
                        >
                            <Grid container justify="center" alignItems="center" className={classes.fullHeight}>
                                {
                                    aPicture.type !== PictureType.None && (
                                        <img className={classes.pic} src={aPicture.data} alt=""/>
                                    )
                                }
                                {
                                    mode === ComponentMode.Design && (
                                        <Fab
                                            size="medium"
                                            color="primary"
                                            style={{position: 'absolute', color: '#ffffff'}}
                                            onClick={() => { handleAddPictureClick(aPicture, pictureIdx); }}
                                        >
                                            <Icon>add_a_photo</Icon>
                                        </Fab>
                                    )
                                }
                            </Grid>
                        </Grid>
                    ))
                }
            </Grid>
        </Fragment>
    );
};
